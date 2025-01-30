import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { ILogEntries, ILogEntry } from '../services/FetchService';
import { JSX } from 'react/jsx-runtime';
import CustomSlider from './CustomSlider';
import { BookPageIndex } from '@/types/BookPageIndex';
import { NavigationService } from '@/services/NavigationService';
import { useRouter } from 'next/navigation';


export default function PullOutDrawer({
    previous,
    next,
    currentlySelectedDay,
    entries
}: {
    previous: BookPageIndex | null;
    next: BookPageIndex | null;
    currentlySelectedDay: ILogEntry | null;
    entries: ILogEntries;
}) {
    
    const router = useRouter();

    let previousButton: JSX.Element = <></>;
    let nextButton: JSX.Element = <></>;

    if (previous != null) {
        previousButton = (
            <button
                onClick={() => NavigationService.navigateTo(router, previous)}
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
                onClick={() => NavigationService.navigateTo(router,next)}
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
        <>
            <div className="flex flex-row pl-[20px] pr-[20px] pb-[10px]">
                <div className="pointer-events-auto w-20">{previousButton}</div>
                <div className="flex-grow p-4 text-center text-gray-600 text-lg">
                    {description}
                </div>
                <div className="pointer-events-auto w-20">{nextButton}</div>
            </div>
            <CustomSlider entries={entries} currentlySelectedDay={currentlySelectedDay}></CustomSlider>
        </>
    );
}
