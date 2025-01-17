import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

const NavigationButtons = ({ availableDays }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [navigation, setNavigation] = useState({
        showPrev: false,
        showNext: false,
        prevPath: '',
        nextPath: '',
    });

    // Helper function to get the current page type and day
    const getCurrentPageInfo = () => {
        const path = location.pathname;

        if (path === '/') return { type: 'home', day: null };
        if (path === '/Content') return { type: 'content', day: null };

        const dayMatch = path.match(/\/Tag\/(\d+)/);
        if (dayMatch) return { type: 'entry', day: parseInt(dayMatch[1]) };

        return { type: 'unknown', day: null };
    };

    // Helper function to find the next available day
    const findNextDay = (currentDay) => {
        const nextAvailable = availableDays.find((day) => day > currentDay);
        return nextAvailable || null;
    };

    // Helper function to find the previous available day
    const findPrevDay = (currentDay) => {
        const prevAvailable = [...availableDays]
            .reverse()
            .find((day) => day < currentDay);
        return prevAvailable || null;
    };

    useEffect(() => {
        const { type, day } = getCurrentPageInfo();
        let newNavigation = {
            showPrev: false,
            showNext: false,
            prevPath: '',
            nextPath: '',
        };

        switch (type) {
            case 'home':
                newNavigation = {
                    showPrev: false,
                    showNext: true,
                    prevPath: '',
                    nextPath: '/Content',
                };
                break;

            case 'content':
                const firstDay = Math.min(...availableDays);
                newNavigation = {
                    showPrev: true,
                    showNext: true,
                    prevPath: '/',
                    nextPath: `/Tag/${firstDay}`,
                };
                break;

            case 'entry':
                const nextDay = findNextDay(day);
                const prevDay = findPrevDay(day);
                newNavigation = {
                    showPrev: true,
                    showNext: !!nextDay,
                    prevPath: prevDay ? `/Tag/${prevDay}` : '/Content',
                    nextPath: nextDay ? `/Tag/${nextDay}` : '',
                };
                break;

            default:
                break;
        }

        setNavigation(newNavigation);
    }, [location.pathname, availableDays]);

    const handleNavigation = (direction) => {
        const path =
            direction === 'next' ? navigation.nextPath : navigation.prevPath;
        if (path) {
            navigate(path);
        }
    };

    return (
        <div className="fixed inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between">
            <div className="pointer-events-auto">
                {navigation.showPrev && (
                    <button
                        onClick={() => handleNavigation('prev')}
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
                )}
            </div>
            <div className="pointer-events-auto">
                {navigation.showNext && (
                    <button
                        onClick={() => handleNavigation('next')}
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
                )}
            </div>
        </div>
    );
};

export default NavigationButtons;
