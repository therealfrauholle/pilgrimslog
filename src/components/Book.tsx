import { ILogEntry } from '../services/FetchService';
import HeaderBookmark from './HeaderBookmark';
import BottomBar, { BookPageIndex } from './BottomBar';
import { useNavigate } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';

export default function Book({
    children,
    previous,
    next,
    currentlySelectedDay,
}: {
    children: JSX.Element;
    previous: BookPageIndex | undefined;
    next: BookPageIndex | undefined;
    currentlySelectedDay: ILogEntry | undefined;
}) {
    const navigate = useNavigate();

    return (
        <>
            <div className="relative flex flex-col h-full w-full">
                <HeaderBookmark
                    isHome={previous !== null && currentlySelectedDay === null}
                    onClick={() => navigate('/Content')}
                />
                <div className="flex-grow min-h-0">{children}</div>
                <div className="flex-none">
                    <BottomBar
                        previous={previous}
                        next={next}
                        currentlySelectedDay={currentlySelectedDay}
                    />
                </div>
            </div>
        </>
    );
}
