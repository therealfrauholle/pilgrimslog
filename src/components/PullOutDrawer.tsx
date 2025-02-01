import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { ILogEntry } from '../services/FetchService';
import { JSX } from 'react/jsx-runtime';
import CustomSlider from './CustomSlider';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { BookContext } from './Book';
import { BookPageIndex } from '@/types/BookPageIndex';

export default function PullOutDrawer() {
    const router = useRouter();

    const bookData = useContext(BookContext)!;
    const entries = bookData!.entries;

    const currentlySelectedDay: ILogEntry | null = bookData.current;

    let previousLocation = null;
    let nextLocation = null;

    if (currentlySelectedDay != null) {
        const previousEntry = currentlySelectedDay.getPrevious();
        if (previousEntry != null) {
            previousLocation = BookPageIndex.entry(previousEntry);
        } else {
            previousLocation = BookPageIndex.homepage();
        }

        const nextEntry = currentlySelectedDay.getNext();
        if (nextEntry != null) {
            nextLocation = BookPageIndex.entry(nextEntry);
        } else {
            nextLocation = null;
        }
    } else {
        previousLocation = null;
        nextLocation = BookPageIndex.entry(entries.data[0]);
    }

    let previousButton: JSX.Element = <></>;
    let nextButton: JSX.Element = <></>;

    if (previousLocation != null) {
        previousButton = (
            <button
                onClick={() => router.push(previousLocation.asUrl())}
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

    if (nextLocation != null) {
        nextButton = (
            <button
                onClick={() => router.push(nextLocation.asUrl())}
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
    let slider = <></>;
    if (currentlySelectedDay != null) {
        description = (
            <>
                {currentlySelectedDay.getDaysSinceStart()}. Tag | ≈
                {currentlySelectedDay.km}km
            </>
        );
        slider = (
            <CustomSlider
                entries={entries}
                currentlySelectedDay={currentlySelectedDay}
            ></CustomSlider>
        );
    }

    return (
        <>
            <div className="flex flex-row pl-[20px] pr-[20px] pb-[10px]">
                <div className="pointer-events-auto w-20">{previousButton}</div>
                <div className="flex-grow p-4 text-center text-gray-600 text-lg">
                    {description}
                </div>
                <div className="grow">
                    <input type="text" />
                </div>
                <div className="pointer-events-auto w-20">{nextButton}</div>
            </div>
            {slider}
        </>
    );
}
