'use client';

import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { JSX } from 'react/jsx-runtime';
import { useContext, useState } from 'react';
import { BookContext } from './Book';
import { BookPageIndex } from '@/types/BookPageIndex';
import DaySlider from './DaySlider';
import { Page } from '@/types/Page';
import Map from './Map';

export default function PullOutDrawer() {
    const bookData = useContext(BookContext)!;
    const [hovered, setHovered] = useState<BookPageIndex | null>(null);

    const entries = bookData!.entries;

    const currentPage: BookPageIndex = bookData.displayed;

    let previousLocation = null;
    let nextLocation = null;

    switch (currentPage.page) {
        case Page.Entry:
            const previousEntry = currentPage.entry!.getPrevious();
            if (previousEntry != null) {
                previousLocation = BookPageIndex.entry(previousEntry);
            } else {
                previousLocation = BookPageIndex.homepage();
            }
            const nextEntry = currentPage.entry!.getNext();
            if (nextEntry != null) {
                nextLocation = BookPageIndex.entry(nextEntry);
            } else {
                nextLocation = null;
            }
            break;
        case Page.Homepage:
            previousLocation = null;
            nextLocation = BookPageIndex.entry(entries.data[0]);
            break;
    }

    let previousButton: JSX.Element = <></>;
    let nextButton: JSX.Element = <></>;

    if (previousLocation != null) {
        previousButton = (
            <button
                onClick={() => bookData.setDisplayed(previousLocation)}
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
                onClick={() => bookData.setDisplayed(nextLocation)}
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
    if (currentPage.page == Page.Entry) {
        description = (
            <>
                {currentPage.entry!.getDaysSinceStart() + 1}. Tag | ≈
                {currentPage.entry!.km}km
            </>
        );
    }

    return (
        <>
            <div className="flex flex-row pl-[20px] pr-[20px] pb-[10px]">
                <div className="pointer-events-auto w-20">{previousButton}</div>
                <div className="flex-grow p-4 text-center text-gray-600 text-lg">
                    {description}
                </div>
                <div className="pointer-events-auto w-20">{nextButton}</div>
            </div>
            <div
                className={
                    'w-full ' + (hovered == null ? 'h-[200px]' : 'h-[400px]')
                }
                style={{ transition: 'all 1s ease-in-out' }}
            >
                <Map hovered={hovered} />
            </div>
            <DaySlider hover={setHovered} />
        </>
    );
}
