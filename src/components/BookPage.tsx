import BlogEntry from './BlogEntry';
import Title from './Title';
import { BookPageIndex } from '@/types/BookPageIndex';
import { useSwipeable } from 'react-swipeable';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { BookContext } from './Book';

type Action = {
    type: 'display' | 'swipe' | 'swipeend';
    swipe?: number;
    display?: BookPageIndex;
};

type ElementState = {
    element: BookPageIndex | null;
    animate: boolean;
    offset: number;
};

type UiState = {
    fastChange: boolean;
    a: ElementState;
    b: ElementState;
    c: ElementState;
};

type InnerState = {
    pages: [BookPageIndex | null, BookPageIndex | null, BookPageIndex | null];
    center: number;
    rotateDirection: 'toRight' | 'toLeft';
    offset: number;
    requestSet: (e: BookPageIndex) => void;
    fastChange: boolean;
    swipeThreshold: number;
};

class State {
    inner: InnerState;
    constructor(inner: InnerState) {
        this.inner = inner;
    }

    static default(
        current: BookPageIndex,
        swipeThreshold: number,
        requestSet: (e: BookPageIndex) => void,
    ): State {
        return new State({
            pages: [current.navPrev(), current, current.navNext()],
            center: 1,
            offset: 0,
            rotateDirection: 'toRight',
            requestSet,
            fastChange: false,
            swipeThreshold,
        });
    }

    main(): BookPageIndex {
        return this.inner.pages[this.inner.center]!;
    }

    update(action: Action): State {
        const result = new State({ ...this.inner });
        switch (action.type) {
            case 'display':
                if (this.main().equals(action.display!)) {
                    return this;
                }
                if (this.main().isBefore(action.display!)) {
                    result.inner.center = (result.inner.center + 1) % 3;
                    result.inner.pages[result.inner.center] = action.display!;
                    result.inner.pages[(result.inner.center + 1) % 3] =
                        action.display!.navNext();
                    result.inner.rotateDirection = 'toLeft';
                } else {
                    result.inner.center = (result.inner.center + 2) % 3;
                    result.inner.pages[result.inner.center] = action.display!;
                    result.inner.pages[(result.inner.center + 2) % 3] =
                        action.display!.navPrev();
                    result.inner.rotateDirection = 'toRight';
                }
                result.inner.fastChange = false;
                return result;
            case 'swipe':
                result.inner.offset = action.swipe!;
                result.inner.pages[(result.inner.center + 1) % 3] =
                    this.main().navNext();
                result.inner.pages[(result.inner.center + 2) % 3] =
                    this.main().navPrev();
                if (action.swipe! > 0) {
                    if (this.main().navPrev() == null) {
                        result.inner.offset = Math.min(
                            result.inner.offset,
                            0.2,
                        );
                    }
                    result.inner.rotateDirection = 'toLeft';
                } else {
                    if (this.main().navNext() == null) {
                        result.inner.offset = Math.max(
                            result.inner.offset,
                            -0.2,
                        );
                    }
                    result.inner.rotateDirection = 'toRight';
                }
                result.inner.fastChange = true;
                return result;
            case 'swipeend':
                result.inner.offset = 0;
                result.inner.fastChange = false;
                if (Math.abs(action.swipe!) > this.inner.swipeThreshold) {
                    if (action.swipe! > 0) {
                        if (this.main().navPrev() == null) {
                            return result;
                        }
                        result.inner.rotateDirection = 'toRight';
                        result.inner.center = (result.inner.center + 2) % 3;
                        result.inner.pages[(result.inner.center + 2) % 3] =
                            result.main().navPrev();
                    } else {
                        if (this.main().navNext() == null) {
                            return result;
                        }
                        result.inner.rotateDirection = 'toLeft';
                        result.inner.center = (result.inner.center + 1) % 3;
                        result.inner.pages[(result.inner.center + 1) % 3] =
                            result.main().navNext();
                    }
                }
                this.inner.requestSet(result.main());
                return result;
        }
    }

    ui(): UiState {
        return {
            fastChange: this.inner.fastChange,
            a: {
                element: this.inner.pages[0],
                offset:
                    -(((this.inner.center + 1) % 3) - 1) + this.inner.offset,
                animate:
                    (this.inner.rotateDirection == 'toRight' &&
                        this.inner.center != 1) ||
                    (this.inner.rotateDirection == 'toLeft' &&
                        this.inner.center != 2),
            },
            b: {
                element: this.inner.pages[1],
                offset: -(this.inner.center - 1) + this.inner.offset,
                animate:
                    (this.inner.rotateDirection == 'toRight' &&
                        this.inner.center != 2) ||
                    (this.inner.rotateDirection == 'toLeft' &&
                        this.inner.center != 0),
            },
            c: {
                element: this.inner.pages[2],
                offset:
                    -(((this.inner.center + 2) % 3) - 1) + this.inner.offset,
                animate:
                    (this.inner.rotateDirection == 'toRight' &&
                        this.inner.center != 0) ||
                    (this.inner.rotateDirection == 'toLeft' &&
                        this.inner.center != 1),
            },
        };
    }
}

function toElement(current: BookPageIndex) {
    let entry;
    if ((entry = current.getEntry())) {
        return <BlogEntry data={entry} />;
    } else {
        return <Title />;
    }
}

function toContainer(element: ElementState, fastChange: boolean) {
    return (
        <div
            className={
                'absolute w-full border-x-2 border-solid border-slate-400 h-full transition-all ' +
                (fastChange
                    ? 'duration-100 ease-linear'
                    : 'duration-1000 ease-in-out')
            }
            style={{
                left: element.offset * 100 + '%',
                ...(element.animate ? {} : { transition: 'none' }),
            }}
        >
            {element.element ? toElement(element.element) : null}
        </div>
    );
}

export function BookPage() {
    const { setDisplayed, displayed: current } = useContext(BookContext)!;
    const containerRef = useRef<HTMLDivElement>(null);
    const [request, setRequest] = useState<BookPageIndex | null>(null);
    const [state, dispatch] = useReducer<State, [Action]>(
        (state: State, action: Action) => state.update(action),
        State.default(current, 0.3, setRequest),
    );

    const main = state.main();

    useEffect(() => {
        if (request != null) {
            setDisplayed(request);
            setRequest(null);
        } else if (!main.equals(current)) {
            dispatch({ type: 'display', display: current });
        }
    }, [main, setDisplayed, current, request]);

    const handlers = useSwipeable({
        onSwiping: (eventData) => {
            const swipePercent =
                eventData.deltaX /
                containerRef.current!.getBoundingClientRect().width;
            dispatch({ type: 'swipe', swipe: swipePercent });
        },
        onSwiped: (eventData) => {
            const swipePercent =
                eventData.deltaX /
                containerRef.current!.getBoundingClientRect().width;
            dispatch({ type: 'swipeend', swipe: swipePercent });
        },
    });
    const { a, b, c, fastChange } = state.ui();
    return (
        <div
            {...handlers}
            ref={(r) => {
                handlers.ref(r);
                containerRef.current = r;
            }}
            className="relative w-full h-full overflow-hidden"
        >
            {toContainer(a, fastChange)}
            {toContainer(b, fastChange)}
            {toContainer(c, fastChange)}
        </div>
    );
}
