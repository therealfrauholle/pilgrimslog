import { RefObject, useEffect, useReducer, useRef, useState } from 'react';
import { MouseEvent } from 'react';
import styles from './slider.module.css';

export type TouchSliderProps = {
    value: number;
    marks: number[];
    onChange: (newValue: number) => void;
    onChangeCommitted: (newValue: number) => void;
    onStart: () => void;
    /**
     * Show bounding boxes of the sticky and scroll area.
     */
    debug?: boolean;
    /**
     * How much the maximum slider scroll speed is, in units per second.
     */
    scrollSpeed: number;
    /**
     * Classes applied tk tge different attributes.
     */
    slotClasses?: {
        container?: string;
        rail?: string;
        mark?: string;
        scroll?: string;
        sticky?: string;
        thumb?: string;
        zoomedRail?: string;
    };
};

type PointerLocation = {
    pageX: number;
};

type UiAction = {
    action: 'down' | 'position' | 'up' | 'props';
    location?: PointerLocation;
    props?: {
        scrollSpeed: number;
        value: number;
    };
};

type InnerState = {
    /**
     * If not null, the rail is zoomed in and the center of the
     * container is located at this value on the rail.
     */
    valueInCenter: number | null;
    /**
     * Last time we automatically scrolled the rail.
     *
     * Used for consistent, timing independent  animation.
     */
    lastScrollTime: number;
    /**
     * Last position of the pointer we reported. Used for debouncing
     * change events.
     */
    lastReportedValue: number;
    /**
     * The current value of the thumb.
     */
    value: number;
    /**
     * The maximum speed the slider should scroll, in pixels per second.
     */
    scrollSpeed: number;
    /**
     * If sticky, moving the bar will require touch input further away
     * from the thumb.
     *
     * Only meaningful when the bar is zoomed.
     */
    isSticky: boolean;
    /**
     * How often the scroll position should be updated when scrolling
     * automatically.
     */
    scrollUpdatesPerSecond: number;
    /**
     * Events that happen in the reducer are queued in this list.
     *
     * We cannot fire the handler in the reducer function, but must
     * pustpone the propagation to within a useEffect call.
     */
    enqueueEvent: (newEvent: Event) => void;
    rail: RefObject<HTMLElement | null>;
    leftScrollZone: RefObject<HTMLElement | null>;
    rightScrollZone: RefObject<HTMLElement | null>;
    stickyZone: RefObject<HTMLElement | null>;
    zoomedRail: RefObject<HTMLElement | null>;
    container: RefObject<HTMLElement | null>;
};

class State {
    inner: InnerState;

    constructor(state: InnerState) {
        this.inner = { ...state };
    }

    copy(): State {
        return new State(this.inner);
    }

    withinStickyZone(position: PointerLocation): boolean {
        const stickyOffset = offsetX(position, this.inner.stickyZone.current!);
        return 0 <= stickyOffset && stickyOffset <= 1;
    }

    /**
     * Returns a value betweem -1 and 1 whem the pointer is not in the
     * middle of the container, over the scroll areas or even beyond.
     *
     * If the rail should not scroll, will return 0.
     */
    shouldScroll(position: PointerLocation): number | null {
        let left: number | null = -(
            1 - offsetX(position, this.inner.leftScrollZone.current!)
        );
        if (left > 0) {
            left = null;
        } else if (left < -1) {
            left = -1;
        }
        let right = offsetX(position, this.inner.rightScrollZone.current!);
        if (right < 0) {
            return left;
        } else if (right > 1) {
            right = 1;
        }

        if (left != null) {
            console.warn(
                'overlap between right and left scroll area detected, not scrolling',
            );
            return null;
        }

        return right;
    }

    clampedRailOffset(position: PointerLocation): number {
        return clamp(offsetX(position, this.inner.rail.current!), 0, 1)!;
    }

    isZoomed(): boolean {
        return this.inner.valueInCenter != null;
    }

    processDragStart(position: PointerLocation): boolean {
        if (this.inner.valueInCenter != null) {
            console.warn('down event when already zoomed');
            return false;
        }
        const touchedValue = this.clampedRailOffset(position);
        this.inner.enqueueEvent({ type: 'start' });
        const offsetToValue = this.inner.value - touchedValue;
        const zoomFactor = this.remainingZoomFactor();
        if (this.withinStickyZone(position)) {
            const valueToLocateThumbUnderPointer =
                this.inner.value + offsetToValue / zoomFactor;
            this.inner.valueInCenter = newCenter(
                valueToLocateThumbUnderPointer,
                zoomFactor,
            );
            console.log('Sticky start, center', this.inner.lastReportedValue);
            this.inner.lastReportedValue = this.inner.value;
            this.inner.isSticky = true;
        } else {
            this.inner.valueInCenter = newCenter(touchedValue, zoomFactor);
            this.inner.lastReportedValue = touchedValue;
            this.inner.enqueueEvent({ type: 'change', value: touchedValue });
        }
        return true;
    }

    processDragging(position: PointerLocation): boolean {
        if (this.inner.valueInCenter == null) {
            console.warn('will not update slider when not zoomed');
            return false;
        }
        let mutated = false;
        const pointerAsValue = this.clampedRailOffset(position);
        const scrollForce = this.shouldScroll(position);
        const now = Date.now();
        //FIXME consider a fast swap of scroll direction - or we ignore it...
        const shouldScrollMore =
            now - this.inner.lastScrollTime >
            1000 / this.inner.scrollUpdatesPerSecond;
        // We cannot scroll when still zooming in
        // Effectively when we update the "left" value, we restart the
        // CSS transition but not for the "width". When both become out of
        // sync, the sticky area will move from below the finger and weird things will happen
        const isZooming = this.remainingZoomFactor() != 1;
        if (scrollForce != null && shouldScrollMore && !isZooming) {
            const newCenterValue =
                this.inner.valueInCenter +
                (this.inner.scrollSpeed / this.inner.scrollUpdatesPerSecond) *
                    Math.pow(scrollForce, 3);
            // We need to not scroll beyond the edges of the rail.
            const lowerBound = 0.5 / this.maxZoom();
            const upperBound = 1 - lowerBound;
            const clampedCenterValue = clamp(
                newCenterValue,
                lowerBound,
                upperBound,
            )!;
            if (clampedCenterValue != this.inner.valueInCenter) {
                this.inner.valueInCenter = clampedCenterValue;
                this.inner.lastScrollTime = now;
                mutated = true;
            }
        }
        this.inner.isSticky &&= this.withinStickyZone(position);
        if (
            !this.inner.isSticky &&
            this.inner.lastReportedValue != pointerAsValue
        ) {
            this.inner.lastReportedValue = pointerAsValue;
            this.inner.enqueueEvent({ type: 'change', value: pointerAsValue });
            mutated = true;
        }
        return mutated;
    }

    processDragRelease(action: PointerLocation): boolean {
        if (this.inner.valueInCenter == null) {
            console.warn('Pointer up but not zoomed');
            return false;
        }
        if (!this.inner.isSticky) {
            this.inner.lastReportedValue = this.clampedRailOffset(action);
        }
        this.inner.isSticky = false;
        this.inner.valueInCenter = null;
        this.inner.enqueueEvent({
            type: 'commit',
            value: this.inner.lastReportedValue,
        });

        return true;
    }

    /**
     * The maximum zoom faczor. Will remain static as long as HTML does not change.
     */
    maxZoom(): number {
        return (
            this.inner.zoomedRail.current!.getBoundingClientRect().width /
            this.inner.container.current!.getBoundingClientRect().width
        );
    }

    /**
     * How much the slider can still be zoomed.
     */
    remainingZoomFactor(): number {
        const railWidth =
            this.inner.rail.current!.getBoundingClientRect().width;
        const zoomedRailWidth =
            this.inner.zoomedRail.current!.getBoundingClientRect().width;
        return zoomedRailWidth / railWidth;
    }
}

function generateNewState(previousState: State, action: UiAction): State {
    const newState: State = previousState.copy();
    if (mutateState(newState, action)) {
        return newState;
    } else {
        // Performance: the old state will not trigger a re-render.
        return previousState;
    }
}

/**
 * Perform the given action on the state.
 *
 * Returm whether the state has been updated.
 */
function mutateState(state: State, action: UiAction): boolean {
    switch (action.action) {
        case 'down':
            return state.processDragStart(action.location!);
        case 'position':
            return state.processDragging(action.location!);
        case 'up':
            return state.processDragRelease(action.location!);
        case 'props':
            state.inner.scrollSpeed = action.props!.scrollSpeed;
            state.inner.value = action.props!.value;
            return true;
    }
}

/**
 * Calculate the offset of the give mouse location in relation to the
 * element. Will typically range from 0 to 1, if the pointer is not
 * within the X bounding boxes of the target, the values may exceed
 * this range.
 */
function offsetX(
    position: PointerLocation,
    relativeTarget: HTMLElement,
): number {
    const bounds = relativeTarget.getBoundingClientRect();
    const leftOffset = bounds.x;
    const width = bounds.width;
    const pointerX = position.pageX;
    const trackOffset = pointerX - leftOffset;
    const relativeTrackOffset = trackOffset / width;
    return relativeTrackOffset;
}

/**
 * Clamp the value between min and max (both inclusive).
 * If min and max are not sane, returns null.
 */
function clamp(value: number, min: number, max: number): number | null {
    if (min > max) {
        return null;
    }
    return value > max ? max : value < min ? min : value;
}

/**
 * Calculates the new center of the zoomed in rail, so that animation
 * will revolve around the given point on the rail.
 */
function newCenter(zoomToValue: number, zoomLevel: number) {
    const clampedTouch = clamp(zoomToValue, 0, 1)!;
    const offset = 0.5 - clampedTouch;
    return clampedTouch + offset / zoomLevel;
}

/**
 * Internal variant for the UI event that is propagated to the parent.
 */
type Event = {
    type: 'change' | 'commit' | 'start';
    value?: number;
};

export default function TouchSlider(props: TouchSliderProps) {
    const railRef = useRef<HTMLDivElement | null>(null);
    const leftRef = useRef<HTMLSpanElement | null>(null);
    const rightRef = useRef<HTMLSpanElement | null>(null);
    const stickyRef = useRef<HTMLSpanElement | null>(null);
    const zoomedRailRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const continousPointerReport = useRef<NodeJS.Timeout | null>(null);

    const [queuedEvents, setEvents] = useState<Event[]>([]);

    const UPDATES_PER_SECOND = 10;

    const [sliderState, dispatchUiChange] = useReducer(
        generateNewState,
        new State({
            valueInCenter: null,
            lastReportedValue: props.value,
            lastScrollTime: 0,
            scrollSpeed: props.scrollSpeed,
            value: props.value,
            enqueueEvent: (newEvent: Event) => {
                setEvents((events: Event[]) => {
                    return [...events, newEvent];
                });
            },
            rail: railRef,
            leftScrollZone: leftRef,
            rightScrollZone: rightRef,
            stickyZone: stickyRef,
            isSticky: false,
            scrollUpdatesPerSecond: UPDATES_PER_SECOND,
            zoomedRail: zoomedRailRef,
            container: containerRef,
        }),
    );

    useEffect(() => {
        dispatchUiChange({ action: 'props', props: props });
    }, [props]);

    const { onChangeCommitted, onStart, onChange } = props;

    useEffect(() => {
        queuedEvents.forEach((event) => {
            switch (event.type) {
                case 'change':
                    onChange(event.value!);
                    break;
                case 'commit':
                    onChangeCommitted(event.value!);
                    break;
                case 'start':
                    onStart();
                    break;
            }
        });
        setEvents((events: Event[]) => {
            events.length = 0;
            return events;
        });
    }, [queuedEvents, onChange, onChangeCommitted, onStart]);

    function uninstallTimer() {
        if (continousPointerReport.current != null) {
            clearInterval(continousPointerReport.current);
            continousPointerReport.current = null;
        }
    }

    /**
     * Supposed to be calles always whem the position of the pointer
     * is known.
     */
    function reinstallTimer(position: PointerLocation) {
        uninstallTimer();
        // Timer must be short enough to work well with the automatic scroll updates
        continousPointerReport.current = setInterval(
            () => {
                dispatchUiChange({ action: 'position', location: position });
            },
            1000 / (UPDATES_PER_SECOND * 2),
        );
    }

    // Lint because of react vs. native types
    function onRelease(this: Document, position: PointerEvent) {
        deactivateGlobalHandlers();
        uninstallTimer();
        dispatchUiChange({ action: 'up', location: position });
    }

    let lastMoveUpdate = 0;
    function onMove(this: Document, position: PointerEvent) {
        if (Date.now() - lastMoveUpdate > 1000 / UPDATES_PER_SECOND) {
            dispatchUiChange({ action: 'position', location: position });
            lastMoveUpdate = Date.now();
        }
        reinstallTimer(position);
    }

    function onDown(position: MouseEvent) {
        registerGlobalHandlers();
        dispatchUiChange({
            action: 'down',
            location: position,
        });
        reinstallTimer(position);
    }

    function registerGlobalHandlers() {
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onRelease);
    }

    function deactivateGlobalHandlers() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onRelease);
    }

    const slotClasses = props.slotClasses ? props.slotClasses : {};
    return (
        <div
            ref={containerRef}
            className={
                (props.debug ? styles.debug : '') +
                ' ' +
                styles.container +
                ' ' +
                slotClasses.container +
                (sliderState.isZoomed() ? ' zoomed' : '')
            }
        >
            <span
                className={[
                    styles.scroll,
                    styles.scrollleft,
                    slotClasses.scroll,
                ].join(' ')}
                ref={leftRef}
            ></span>
            <span
                className={[
                    styles.scroll,
                    styles.scrollright,
                    slotClasses.scroll,
                ].join(' ')}
                ref={rightRef}
            ></span>
            <span
                ref={zoomedRailRef}
                className={styles.zoomedref + ' ' + slotClasses.zoomedRail}
            ></span>
            <div
                ref={railRef}
                className={
                    styles.rail +
                    ' ' +
                    slotClasses.rail +
                    ' ' +
                    (sliderState.isZoomed()
                        ? slotClasses.zoomedRail
                        : ' w-full')
                }
                style={{
                    left: sliderState.isZoomed()
                        ? (0.5 -
                              sliderState.inner.valueInCenter! *
                                  sliderState.maxZoom()) *
                              100 +
                          '%'
                        : '0%',
                }}
                onPointerDown={onDown}
            >
                <span
                    ref={stickyRef}
                    className={styles.sticky + ' ' + slotClasses.sticky}
                    style={{
                        left: clamp(props.value, 0, 1)! * 100 + '%',
                    }}
                    onPointerDown={onDown}
                ></span>
                {props.marks.map((value, index) => {
                    return (
                        <span
                            className={styles.mark + ' ' + slotClasses.mark}
                            key={'mark' + value + index}
                            style={{
                                left: value * 100 + '%',
                            }}
                        ></span>
                    );
                })}
                <span
                    className={styles.thumb + ' ' + slotClasses.thumb}
                    style={{
                        left: clamp(props.value, 0, 1)! * 100 + '%',
                    }}
                    onPointerDown={onDown}
                    data-value={props.value}
                ></span>
            </div>
        </div>
    );
}
