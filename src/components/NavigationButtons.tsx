import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { ILogEntry } from '../services/FetchService';
import { JSX } from 'react/jsx-runtime';

enum Page {
    Homepage,
    Content,
    Day,
}

export class LinkLocation {
    page: Page;
    day: ILogEntry;

    static day(day: ILogEntry): LinkLocation {
        let newLocation = new LinkLocation();
        newLocation.page = Page.Day;
        newLocation.day = day;
        return newLocation;
    }

    static homepage(): LinkLocation {
        let newLocation = new LinkLocation();
        newLocation.page = Page.Homepage;
        return newLocation;
    }

    static content(): LinkLocation {
        let newLocation = new LinkLocation();
        newLocation.page = Page.Content;
        return newLocation;
    }
}

export default function NavigationButtons({
    previous,
    next,
}: {
    previous: LinkLocation | undefined;
    next: LinkLocation | undefined;
}) {
    const navigate = useNavigate();
    let previousButton: JSX.Element;
    let nextButton: JSX.Element;

    const handleNavigation = (location: LinkLocation) => {
        switch (location.page) {
            case Page.Homepage:
                navigate('/');
                break;
            case Page.Content:
                navigate('/Content');
                break;
            case Page.Day:
                navigate('/Tag/' + location.day.getDaysSinceStart());
                break;
        }
    };
    if (previous != null) {
        previousButton = (
            <button
                onClick={() => handleNavigation(previous)}
                className="h-16 w-9 bg-gray-100/30 mx-1 hover:bg-gray-200/50 
                          backdrop-blur-sm rounded-r-lg 
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
                className="h-16 w-9 mx-1 bg-gray-100/30 hover:bg-gray-200/50 
                          backdrop-blur-sm rounded-l-lg 
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

    return (
        <div className="fixed inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between">
            <div className="pointer-events-auto">{previousButton}</div>
            <div className="pointer-events-auto">{nextButton}</div>
        </div>
    );
}
