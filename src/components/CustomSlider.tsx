import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import { BookContext } from './Book';
import TouchSlider from './TouchSlider';

export default function CustomSlider() {
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
        <div className="relative h-[100px] overflow-x-hidden w-full min-w-0 pt-[50px]">
            <TouchSlider
                zoomPadding={0.2}
                value={(theDay - 1) / total}
                onChange={handleChange}
                onChangeCommitted={changeCommitted}
                onStart={() => {}}
                marks={marks}
                zoomLevel={5}
                scrollPads={0.3}
            />
        </div>
    );
}
