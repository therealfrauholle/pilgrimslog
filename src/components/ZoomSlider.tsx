import { RefObject, useEffect, useMemo, useReducer, useRef } from 'react';
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
     * Multiplication factor by which the slider will grow when zoomed.
     */
    zoomFactor: number;
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
    };
};

type Action = {
    action: 'down' | 'position' | 'up' | 'props';
    value?: MouseEvent;
    props?: TouchSliderProps;
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
    lastInternalValue: number;
    /**
     * Current component properties.
     */
    props: TouchSliderProps;
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
    rail: RefObject<HTMLElement | null>;
    leftScrollZone: RefObject<HTMLElement | null>;
    rightScrollZone: RefObject<HTMLElement | null>;
    stickyZone: RefObject<HTMLElement | null>;
};

class State {
    inner: InnerState;

    constructor(state: InnerState) {
        this.inner = { ...state };
    }

    copy(): State {
        return new State(this.inner);
    }

    withinStickyZone(position: MouseEvent): boolean {
        const stickyOffset = offsetX(position, this.inner.stickyZone.current!);
        console.log('sticky offset', stickyOffset);
        return 0 <= stickyOffset && stickyOffset <= 1;
    }
    /**
     * Returns a value betweem -1 and 1 whem the pointer is not in the
     * middle of the container, over the scroll areas or even beyond.
     *
     * If the rail should not scroll, will return 0.
     */
    shouldScroll(position: MouseEvent): number | null {
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

    clampedRailOffset(position: MouseEvent): number {
        return clamp(offsetX(position, this.inner.rail.current!), 0, 1)!;
    }

    isZoomed(): boolean {
        return this.inner.valueInCenter != null;
    }

    processDragStart(position: MouseEvent): boolean {
        if (this.inner.valueInCenter != null) {
            console.warn('down event when already zoomed');
            return false;
        }
        const touchedValue = this.clampedRailOffset(position);
        this.inner.props.onStart();
        const offsetToValue = this.inner.props.value - touchedValue;
        if (this.withinStickyZone(position)) {
            const valueToLocateThumbUnderPointer =
                this.inner.props.value +
                offsetToValue / this.inner.props.zoomFactor;
            this.inner.valueInCenter = newCenter(
                valueToLocateThumbUnderPointer,
                this.inner.props.zoomFactor,
            );
            console.log('Sticky start, center', this.inner.valueInCenter);
            this.inner.lastInternalValue = this.inner.props.value;
            this.inner.isSticky = true;
        } else {
            this.inner.valueInCenter = newCenter(
                touchedValue,
                this.inner.props.zoomFactor,
            );
            this.inner.lastInternalValue = touchedValue;
            this.inner.props.onChange(touchedValue);
        }
        return true;
    }

    processDragging(position: MouseEvent): boolean {
        let mutated = false;
        if (this.inner.valueInCenter == null) {
            console.warn('will not update slider when not zoomed');
            return false;
        }
        const pointerAsValue = this.clampedRailOffset(position);
        const scrollForce = this.shouldScroll(position);
        const now = Date.now();
        //FIXME consider a fast swap of scroll direction - or we ignore it...
        if (
            scrollForce != null &&
            now - this.inner.lastScrollTime >
                1000 / this.inner.scrollUpdatesPerSecond
        ) {
            const newCenterValue =
                this.inner.valueInCenter +
                (this.inner.props.scrollSpeed /
                    this.inner.scrollUpdatesPerSecond) *
                    Math.pow(scrollForce, 3);
            // We need to not scroll beyond the edges of the rail.
            const lowerBound = 0.5 / this.inner.props.zoomFactor;
            const upperBound = 1 - lowerBound;
            const clampedCenterValue = clamp(
                newCenterValue,
                lowerBound,
                upperBound,
            )!;
            if (clampedCenterValue != this.inner.valueInCenter) {
                console.log(
                    'scrolling, center',
                    clampedCenterValue,
                    scrollForce,
                    this.inner.valueInCenter,
                );
                this.inner.valueInCenter = clampedCenterValue;
                this.inner.lastScrollTime = now;
                mutated = true;
            }
        }
        this.inner.isSticky &&= this.withinStickyZone(position);
        if (
            !this.inner.isSticky &&
            this.inner.lastInternalValue != pointerAsValue
        ) {
            console.log('not sticky, slider val', pointerAsValue);
            this.inner.lastInternalValue = pointerAsValue;
            this.inner.props.onChange(pointerAsValue);
            mutated = true;
        }
        return mutated;
    }

    processDragRelease(action: MouseEvent): boolean {
        if (this.inner.valueInCenter == null) {
            console.warn('Pointer up but not zoomed');
            return false;
        }
        if (!this.inner.isSticky) {
            this.inner.lastInternalValue = this.clampedRailOffset(action);
        }
        this.inner.isSticky = false;
        this.inner.valueInCenter = null;
        this.inner.props.onChangeCommitted(this.inner.lastInternalValue);

        return true;
    }
}

function generateNewState(previousState: State, action: Action): State {
    const newState: State = previousState.copy();
    if (mutateState(newState, action)) {
        return newState;
    } else {
        // Performance: the old state will not trigger a re-render.
        return previousState;
    }
}

/**
 * Perform the given action on tge state.
 *
 * Returm whether the state has been updated.
 */
function mutateState(state: State, action: Action): boolean {
    switch (action.action) {
        case 'down':
            return state.processDragStart(action.value!);
        case 'position':
            return state.processDragging(action.value!);
        case 'up':
            return state.processDragRelease(action.value!);
        case 'props':
            state.inner.props = action.props!;
            return true;
    }
}

/**
 * Calculate the offset of the give mouse location in relation to the
 * element. Will typically range from 0 to 1, if the pointer is not
 * within the X bounding boxes of the target, the values may exceed
 * this range.
 */
function offsetX(position: MouseEvent, relativeTarget: HTMLElement): number {
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

const TouchSlider = (props: TouchSliderProps) => {
    const railRef = useRef<HTMLSpanElement | null>(null);
    const leftRef = useRef<HTMLSpanElement | null>(null);
    const rightRef = useRef<HTMLSpanElement | null>(null);
    const stickyRef = useRef<HTMLSpanElement | null>(null);
    const continousPointerReport = useRef<NodeJS.Timeout | null>(null);

    const UPDATES_PER_SECOND = 10;

    const [sliderState, modifyZoomCenter] = useReducer(
        generateNewState,
        new State({
            valueInCenter: null,
            lastInternalValue: props.value,
            lastScrollTime: 0,
            props: { ...props },
            rail: railRef,
            leftScrollZone: leftRef,
            rightScrollZone: rightRef,
            stickyZone: stickyRef,
            isSticky: false,
            scrollUpdatesPerSecond: UPDATES_PER_SECOND,
        }),
    );

    useEffect(() => {
        modifyZoomCenter({ action: 'props', props: props });
    }, [props]);

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
    function reinstallTimer(position: MouseEvent) {
        uninstallTimer();
        // Timer must be short enough to work well with the automatic scroll updates
        continousPointerReport.current = setInterval(
            () => {
                modifyZoomCenter({ action: 'position', value: position });
            },
            1000 / (UPDATES_PER_SECOND * 2),
        );
    }

    // Lint because of react vs. native types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onRelease(this: Document, position: any) {
        deactivateGlobalHandlers();
        uninstallTimer();
        modifyZoomCenter({ action: 'up', value: position });
    }

    // Lint because of react vs. native types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onMove(this: Document, position: any) {
        modifyZoomCenter({ action: 'position', value: position });
        reinstallTimer(position);
    }

    function onDown(position: MouseEvent) {
        registerGlobalHandlers();
        modifyZoomCenter({
            action: 'down',
            value: position,
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

    const thumbOffsetRail = clamp(props.value, 0, 1)!;
    const width = sliderState.isZoomed() ? props.zoomFactor : 1;
    const trackContainerOffset = sliderState.isZoomed()
        ? 0.5 - sliderState.inner.valueInCenter! * props.zoomFactor
        : 0;

    const slotClasses = props.slotClasses ? props.slotClasses : {};

    const theMarks = useMemo(() => {
        return props.marks.map((value, index) => {
            return (
                <span
                    className={styles.mark + ' ' + slotClasses.mark}
                    key={'mark' + value + index}
                    style={{
                        left: value * 100 + '%',
                    }}
                ></span>
            );
        });
    }, [props.marks, slotClasses.mark]);

    return (
        <div
            className={
                (props.debug ? styles.debug : '') +
                ' ' +
                styles.container +
                ' ' +
                slotClasses.container
            }
        >
            <span
                key="scrollleft"
                className={[
                    styles.scroll,
                    styles.scrollleft,
                    slotClasses.scroll,
                ].join(' ')}
                ref={leftRef}
            ></span>
            <span
                key="scrollrighz"
                className={[
                    styles.scroll,
                    styles.scrollright,
                    slotClasses.scroll,
                ].join(' ')}
                ref={rightRef}
            ></span>
            <span
                key="rail"
                ref={railRef}
                className={styles.rail + ' ' + slotClasses.rail}
                style={{
                    left: trackContainerOffset * 100 + '%',
                    width: width * 100 + '%',
                }}
                onPointerDown={onDown}
            >
                {theMarks}
                <span
                    key="sticky"
                    ref={stickyRef}
                    className={styles.sticky + ' ' + slotClasses.sticky}
                    style={{
                        left: thumbOffsetRail * 100 + '%',
                    }}
                ></span>
                <span
                    key="thumb"
                    className={styles.thumb + ' ' + slotClasses.thumb}
                    style={{
                        left: thumbOffsetRail * 100 + '%',
                    }}
                    onPointerDown={onDown}
                ></span>
            </span>
        </div>
    );
};

export default TouchSlider;
