import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import { BookContext } from './Book';
import ZoomSlider from './ZoomSlider';

export default function DaySlider() {
    const { entries, current, setCurrent } = useContext(BookContext)!;
    const currentlySelectedEntry = current.entry!;
    const currentlySelectedDay = currentlySelectedEntry.getDaysSinceStart();
    const [theDay, setDay] = useState(currentlySelectedDay);

    useEffect(() => {
        setDay(currentlySelectedDay);
    }, [currentlySelectedDay]);

    const total = entries.data[entries.data.length - 1].getDaysSinceStart() - 1;

    const handleChange = (value: number) => {
        const day = Math.round((total - 1) * value) + 1;
        setDay(entries.getClosestEntryByDay(day).getDaysSinceStart());
    };

    const marks = entries.data.map((entry) => {
        return (entry.getDaysSinceStart() - 1) / total;
    });

    const changeCommitted = (value: number) => {
        const day = Math.round((total - 1) * value) + 1;
        const closestDay = entries.getClosestEntryByDay(day);
        setCurrent(BookPageIndex.entry(closestDay));
    };

    return (
        <div className="h-[100px] overflow-x-hidden w-full min-w-0">
            <ZoomSlider
                value={(theDay - 1) / total}
                onChange={handleChange}
                onChangeCommitted={changeCommitted}
                onStart={() => {}}
                marks={marks}
                scrollSpeed={0.25}
                slotClasses={{
                    sticky: 'w-[60px]',
                    scroll: 'w-[100px]',
                    rail: 'rail',
                    mark: 'mark',
                    thumb: 'bg-sky-800 thumb',
                    container: 'mr-[50px] ml-[50px]',
                    zoomedRail: 'w-[1000px]',
                }}
            />
        </div>
    );
}
