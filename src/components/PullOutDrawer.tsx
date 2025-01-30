import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { ILogEntry } from '../services/FetchService';
import { JSX } from 'react/jsx-runtime';
import { useRouter } from 'next/navigation';

enum Page {
    Homepage,
    Entry,
}

export class BookPageIndex {
    page: Page;
    entry: ILogEntry | null;

    constructor(page: Page, entry: ILogEntry | null) {
        this.page = page;
        this.entry = entry;
    }

    static entry(entry: ILogEntry): BookPageIndex {
        return new BookPageIndex(Page.Entry, entry);
    }

    static homepage(): BookPageIndex {
        return new BookPageIndex(Page.Homepage, null);
    }

    equals(other: BookPageIndex | null): boolean {
        return other
            ? this.page == other.page && this.entry == other.entry
            : false;
    }
}

export default function PullOutDrawer({
    previous,
    next,
    currentlySelectedDay,
}: {
    previous: BookPageIndex | null;
    next: BookPageIndex | null;
    currentlySelectedDay: ILogEntry | null;
}) {
    const navigate = useRouter();
    let previousButton: JSX.Element = <></>;
    let nextButton: JSX.Element = <></>;

    const handleNavigation = (location: BookPageIndex) => {
        switch (location.page) {
            case Page.Homepage:
                navigate.push('/');
                break;
            case Page.Entry:
                navigate.push('/tag/' + location.entry!.Id);
                break;
        }
    };
    if (previous != null) {
        previousButton = (
            <button
                onClick={() => handleNavigation(previous)}
                className="h-16 w-16 bg-gray-100/30 mx-1 hover:bg-gray-200/50 
                          backdrop-blur-sm rounded-lg 
                          flex items-center justify-center 
                          transition-all duration-300 
                          shadow-md hover:shadow-xl 
                          border border-gray-200/20"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-8 h-8 text-gray-700 opacity-70 hover:opacity-100" />
            </button>
        );
    }

    if (next != null) {
        nextButton = (
            <button
                onClick={() => handleNavigation(next)}
                className="h-16 w-16 mx-1 bg-gray-100/30 hover:bg-gray-200/50 
                          backdrop-blur-sm rounded-lg 
                          flex items-center justify-center 
                          transition-all duration-300 
                          shadow-md hover:shadow-xl 
                          border border-gray-200/20"
                aria-label="Next page"
            >
                <ChevronRight className="w-8 h-8 text-gray-700 opacity-70 hover:opacity-100" />
            </button>
        );
    }

    let description = <></>;
    if (currentlySelectedDay != null) {
        description = (
            <>
                {currentlySelectedDay.getDaysSinceStart()}. Tag | ≈
                {currentlySelectedDay.km}km
            </>
        );
    }

    return (
        <div className="flex flex-row pl-[20px] pr-[20px] pb-[10px]">
            <div className="pointer-events-auto w-20">{previousButton}</div>
            <div className="flex-grow p-4 text-center text-gray-600 text-lg">
                {description}
            </div>
            <div className="pointer-events-auto w-20">{nextButton}</div>
        </div>
    );
}
