import { useReducer, useRef } from 'react';

export type TouchSliderProps = {
    value: number;
    marks: number[];
    onChange: (newValue: number) => void;
    onChangeCommitted: (newValue: number) => void;
    onStart: () => void;
    zoomLevel: number;
    scrollPads: number;
    zoomPadding: number;
};

type Action = { action: 'set' | 'scroll' | 'clear'; value?: number };

type State = {
    zoomCenter: number | null;
    lastScroll: number;
    fireChange: (value: number) => void;
    zoomLevel: number;
};

function reducer(state: State, action: Action): State {
    switch (action.action) {
        case 'set':
            return { ...state, zoomCenter: action.value!, lastScroll: 0 };
        case 'scroll':
            const factor = 0.025;
            const now = Date.now();
            if (now - state.lastScroll > 50 && state.zoomCenter != null) {
                if (action.value! > 0) {
                    state.fireChange(state.zoomCenter + 0.5 / state.zoomLevel);
                } else {
                    state.fireChange(state.zoomCenter - 0.5 / state.zoomLevel);
                }
                const newZoom =
                    state.zoomCenter + factor * Math.pow(action.value!, 3);
                const lowerBound = 0.5 / state.zoomLevel;
                const upperBound = 1 - lowerBound;
                return {
                    ...state,
                    zoomCenter:
                        newZoom < lowerBound
                            ? lowerBound
                            : newZoom > upperBound
                              ? upperBound
                              : newZoom,
                    lastScroll: now,
                };
            } else {
                return { ...state };
            }
        case 'clear':
            return { ...state, zoomCenter: null, lastScroll: 0 };
    }
}

export default function TouchSlider(props: TouchSliderProps) {
    const [zoomCenter, modifyZoomCenter] = useReducer(reducer, {
        zoomCenter: null,
        lastScroll: 0,
        fireChange: props.onChange,
        zoomLevel: props.zoomLevel,
    });
    const trackRef = useRef<HTMLSpanElement | null>(null);
    const leftRef = useRef<HTMLSpanElement | null>(null);
    const rightRef = useRef<HTMLSpanElement | null>(null);
    const timer = useRef<NodeJS.Timeout | null>(null);

    function offset(event: MouseEvent, element: HTMLElement): number {
        const bounds = element.getBoundingClientRect();
        const leftOffset = bounds.x;
        const width = bounds.width;
        const pointerX = event.pageX;
        const trackOffset = pointerX - leftOffset;
        const relativeTrackOffset = trackOffset / width;
        return relativeTrackOffset;
    }

    function offsetFromPointer(event: MouseEvent): number {
        return offset(event, trackRef.current!);
    }

    function detectScroll(event: MouseEvent): number | null {
        let scroll: number | null = -(1 - offset(event, leftRef.current!));
        if (scroll > 0 || scroll < -1) {
            scroll = null;
        }
        const right: number = offset(event, rightRef.current!);
        if (right > 1 || right < 0) {
            return scroll;
        }

        if (scroll != null) {
            console.warn(
                'overlap between right and left scroll area detected, not scrolling',
            );
            return null;
        }

        return right;
    }
    function onMove(this: Document, e: MouseEvent) {
        const offset = offsetFromPointer(e);
        props.onChange(offset);
        const scroll = detectScroll(e);

        if (timer.current != null) {
            console.log('timer clear from move');
            clearInterval(timer.current);
            timer.current = null;
        }
        if (scroll != null) {
            console.log('start scroll', scroll);
            modifyZoomCenter({ action: 'scroll', value: scroll });
            timer.current = setInterval(() => {
                console.log('scrolling');
                modifyZoomCenter({ action: 'scroll', value: scroll });
            }, 100);
        }
    }

    function onRelease(this: Document, e: MouseEvent) {
        deactivateGlobalHandlers();
        modifyZoomCenter({ action: 'clear' });
        if (timer.current != null) {
            console.log('timer clear from release');
            clearInterval(timer.current);
            timer.current = null;
        }
        props.onChangeCommitted(offsetFromPointer(e));
    }

    function registerGlobalHandlers() {
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onRelease);
    }
    function deactivateGlobalHandlers() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onRelease);
    }

    function calculateZoomInCenter(currentTouch: number) {
        let clampedTouch: number;
        if (currentTouch < 0) {
            console.warn('Ceiling zoom target', currentTouch);
            clampedTouch = 0;
        } else if (currentTouch > 1) {
            console.warn('Flooring zoom target', currentTouch);
            clampedTouch = 1;
        } else {
            clampedTouch = currentTouch;
        }
        const offset = 0.5 - clampedTouch;
        return clampedTouch + offset / props.zoomLevel;
    }

    const left =
        props.value < 0
            ? '0%'
            : props.value > 1
              ? '100%'
              : `${props.value * 100}%`;
    const smallTrackWidth = 1 - props.zoomPadding * 2;
    const width = zoomCenter.zoomCenter
        ? props.zoomLevel * smallTrackWidth * 100
        : smallTrackWidth * 100;
    const trackLeft = zoomCenter.zoomCenter
        ? (0.5 - smallTrackWidth * zoomCenter.zoomCenter * props.zoomLevel) *
          100
        : props.zoomPadding * 100;
    return (
        <div className="relative w-full bg-blue-200 h-[50px]">
            <span
                ref={leftRef}
                style={{
                    width: props.scrollPads * 100 + '%',
                    height: '100%',
                    position: 'absolute',
                    background: 'red',
                    opacity: 0.2,
                }}
            ></span>
            <span
                ref={rightRef}
                style={{
                    left: `${(1 - props.scrollPads) * 100}%`,
                    width: props.scrollPads * 100 + '%',
                    height: '100%',
                    position: 'absolute',
                    background: 'red',
                    opacity: 0.2,
                }}
            ></span>
            <span
                ref={trackRef}
                className="absolute bg-amber-400 h-[15px]"
                style={{
                    top: '50%',
                    borderRadius: '3px',
                    left: trackLeft + '%',
                    transform: 'translateY(-50%)',
                    width: `${width}%`,
                    transitionProperty: 'width,left',
                    transitionDuration: '0.7s',
                    userSelect: 'none',
                    touchAction: 'none',
                }}
                onPointerDown={(e) => {
                    registerGlobalHandlers();
                    const offset = offsetFromPointer(
                        e as unknown as PointerEvent,
                    );
                    modifyZoomCenter({
                        action: 'set',
                        value: calculateZoomInCenter(offset),
                    });
                    props.onStart();
                    props.onChange(offset);
                }}
            >
                {props.marks.map((value, index) => {
                    return (
                        <span
                            key={value + index}
                            className="bg-slate-400/60"
                            style={{
                                borderRadius: '1px',
                                top: '50%',
                                height: '110%',
                                position: 'absolute',
                                transform: 'translate(-50%, -50%)',
                                width: '2px',
                                background: 'black',
                                left: value * 100 + '%',
                            }}
                        ></span>
                    );
                })}
                <span
                    className="absolute w-[10px] h-[30px] bg-slate-900"
                    style={{
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '3px',
                        left: left,
                        userSelect: 'none',
                        touchAction: 'none',
                        top: '50%',
                        transitionProperty: 'left',
                        transitionDuration: '0.3s',
                    }}
                    onPointerDown={(e) => {
                        const offset = offsetFromPointer(
                            e as unknown as PointerEvent,
                        );
                        registerGlobalHandlers();
                        modifyZoomCenter({ action: 'set', value: offset });
                        props.onStart();
                    }}
                    draggable={false}
                ></span>
            </span>
        </div>
    );
}
