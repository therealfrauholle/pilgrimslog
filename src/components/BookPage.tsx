import BlogEntry from './BlogEntry';
import Title from './Title';
import { BookPageIndex } from '@/util/BookPageIndex';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { BookContext } from './Main';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

type Action = {
    type: 'display' | 'swipe' | 'swipeend';
    swipe?: {
        x: number;
        y: number;
    };
    display?: BookPageIndex;
};

type Parameters = {
    /**
     * When a navigation is committed by the user, this callback is fired.
     */
    setNewIndex: (e: BookPageIndex) => void;
    /**
     * How much the user must move the page to finish navigatiob.
     */
    swipeThreshold: number;
};

type UiState = {
    /**
     * Currently selected index
     */
    selected: BookPageIndex;
    /**
     * Percentage offset of the selected page, changes when swiped.
     */
    offset: number;
    /**
     * True when changes should be animated fast.
     */
    fastChange: boolean;
};

type InnerState = {
    swipeStatus: 'free' | 'horizontal' | 'locked';
};

class State {
    inner: UiState & Parameters & InnerState;

    constructor(inner: UiState & Parameters & InnerState) {
        this.inner = inner;
    }

    static default(current: BookPageIndex, config: Parameters): State {
        return new State({
            ...config,
            selected: current,
            offset: 0,
            fastChange: false,
            swipeStatus: 'free',
        });
    }

    update(action: Action): State {
        const result = new State({ ...this.inner });
        switch (action.type) {
            case 'display':
                if (this.inner.selected.equals(action.display!)) {
                    return this;
                }
                result.inner.fastChange = false;
                result.inner.selected = action.display!;
                return result;
            case 'swipe':
                const { x, y } = action.swipe!;
                switch (this.inner.swipeStatus) {
                    case 'locked':
                        return this;
                    case 'free':
                        if (Math.abs(y) < 0.05) {
                            if (Math.abs(x) < 0.05) {
                                return this;
                            } else {
                                result.inner.swipeStatus = 'horizontal';
                            }
                        } else {
                            result.inner.offset = 0;
                            result.inner.swipeStatus = 'locked';
                            return result;
                        }
                }
                result.inner.offset = x;
                // Allow the user to swipe slightly beyond the ends of the book
                const BOUNCE_LIMIT = 0.2;
                if (x > 0) {
                    if (this.inner.selected.navPrev() == null) {
                        result.inner.offset = Math.min(
                            result.inner.offset,
                            BOUNCE_LIMIT,
                        );
                    }
                } else {
                    if (this.inner.selected.navNext() == null) {
                        result.inner.offset = Math.max(
                            result.inner.offset,
                            -BOUNCE_LIMIT,
                        );
                    }
                }
                result.inner.fastChange = true;
                return result;
            case 'swipeend':
                result.inner.offset = 0;
                result.inner.fastChange = false;
                result.inner.swipeStatus = 'free';
                if (
                    Math.abs(action.swipe!.x) > this.inner.swipeThreshold &&
                    this.inner.swipeStatus != 'locked'
                ) {
                    if (action.swipe!.x > 0) {
                        if (this.inner.selected.navPrev() == null) {
                            return result;
                        }
                        result.inner.selected = this.inner.selected.navPrev()!;
                    } else {
                        if (this.inner.selected.navNext() == null) {
                            return result;
                        }
                        result.inner.selected = this.inner.selected.navNext()!;
                    }
                    this.inner.setNewIndex(result.inner.selected);
                }
                return result;
        }
    }

    ui(): UiState {
        return this.inner;
    }
}

function toElement(index: BookPageIndex) {
    let entry;
    if ((entry = index.getEntry())) {
        return <BlogEntry data={entry} />;
    } else {
        return <Title />;
    }
}

/**
 * Render an index as rhe UI element
 *
 * @param theElement the index to render
 * @param fastChange whether changes should use fasf css transitions
 * @param scrollOffset the current (manual) offset (when swiping)
 * @param selectedIndex the index visible in the center (not necessarily the index that is to be rendered)
 * @param [padding=0.02] padding between pages
 * @param [visibleZIndex=1000] the z-index of the currently selected index. All other elements will be placed with a lower z-index.
 */
function toPageDiv(
    theElement: BookPageIndex,
    scrollOffset: number,
    selectedIndex: BookPageIndex,
    fastChange: boolean,
    visibleZIndex: number = 1000,
    padding: number = 0.02,
) {
    let zIndex: number;
    let left: number;
    const indexOffset = theElement.index() - selectedIndex.index();
    if (theElement.isBefore(selectedIndex)) {
        zIndex = visibleZIndex + indexOffset;
        left = -1 + padding * indexOffset + scrollOffset;
    } else if (theElement.isAfter(selectedIndex)) {
        zIndex = visibleZIndex - indexOffset;
        left = 1 + padding * indexOffset + scrollOffset;
    } else {
        zIndex = visibleZIndex;
        left = scrollOffset;
    }
    return (
        <div
            key={theElement.index()}
            className={
                'absolute w-full h-full transition-all bg-white ' +
                (fastChange
                    ? 'duration-100 ease-linear'
                    : 'duration-1000 ease-in-out')
            }
            style={{
                background: 'var(--color-plog-neutral)',
                boxShadow: '0px 0px 4px #dddddd',
                left: left * 100 + '%',
                zIndex: zIndex,
            }}
        >
            {toElement(theElement)}
        </div>
    );
}

export function BookPage() {
    const {
        setDisplayed,
        displayed: current,
        entries,
    } = useContext(BookContext)!;
    const containerRef = useRef<HTMLDivElement>(null);
    const [newIndex, setNewIndex] = useState<BookPageIndex | null>(null);
    const [state, dispatch] = useReducer<State, [Action]>(
        (state: State, action: Action) => state.update(action),
        State.default(current, {
            swipeThreshold: 0.3,
            setNewIndex: setNewIndex,
        }),
    );

    const { fastChange, selected, offset } = state.ui();

    useEffect(() => {
        if (newIndex != null) {
            setDisplayed(newIndex);
            setNewIndex(null);
        } else if (!selected.equals(current)) {
            dispatch({ type: 'display', display: current });
        }
    }, [selected, setDisplayed, current, newIndex]);

    function updateSwipe(
        eventData: SwipeEventData,
        type: 'swipe' | 'swipeend',
    ) {
        const fractionX =
            eventData.deltaX /
            containerRef.current!.getBoundingClientRect().width;
        const fractionY =
            eventData.deltaY /
            containerRef.current!.getBoundingClientRect().height;
        dispatch({
            type,
            swipe: { x: fractionX, y: fractionY },
        });
    }

    const handlers = useSwipeable({
        onSwiping: (eventData) => updateSwipe(eventData, 'swipe'),
        onSwiped: (eventData) => updateSwipe(eventData, 'swipeend'),
    });

    return (
        <div
            {...handlers}
            ref={(r) => {
                handlers.ref(r);
                containerRef.current = r;
            }}
            className="relative w-full h-full overflow-hidden"
        >
            <div
                style={{
                    position: 'absolute',
                    width: '50px',
                    height: '50px',
                    padding: '10px',
                    top: '50%',
                    left: '0%',
                    transform: 'translateY(-50%)',
                    background: 'var(--color-plog-neutral)',
                    zIndex: 2000,
                    border: '1px solid var(--color-plog-highlight)',
                    borderRadius: '35px',
                    marginLeft: '5px',
                    opacity: selected.navPrev() ? 1 : 0,
                    transition: 'opacity 1s',
                }}
                onClick={() => {
                    const previous = selected.navPrev();
                    if (previous) {
                        setDisplayed(previous);
                    }
                }}
                role="button"
            >
                <ChevronLeft style={{ width: '100%', height: '100%' }} />
            </div>
            {toPageDiv(
                BookPageIndex.homepage(entries),
                offset,
                selected,
                fastChange,
            )}
            {entries.data.map((element) =>
                toPageDiv(
                    BookPageIndex.entry(element, entries),
                    offset,
                    selected,
                    fastChange,
                ),
            )}
            <div
                style={{
                    position: 'absolute',
                    width: '50px',
                    height: '50px',
                    padding: '10px',
                    top: '50%',
                    right: '0%',
                    transform: 'translateY(-50%)',
                    background: 'var(--color-plog-neutral)',
                    zIndex: 2000,
                    border: '1px solid var(--color-plog-highlight)',
                    borderRadius: '35px',
                    marginRight: '5px',
                    opacity: selected.navNext() ? 1 : 0,
                    transition: 'opacity 1s',
                }}
                onClick={() => {
                    const next = selected.navNext();
                    if (next) {
                        setDisplayed(next);
                    }
                }}
                role="button"
            >
                <ChevronRight style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}
