import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { BookPageIndex } from '@/util/BookPageIndex';
import { BookContext } from './Main';
import ZoomSlider from './ZoomSlider';

type DaySliderProps = {
    activeValue: (entry: BookPageIndex | null) => void;
};

export default function DaySlider({ activeValue }: DaySliderProps) {
    const { entries, displayed } = useContext(BookContext)!;
    const [sliderValue, setSliderValue] = useState(displayed);

    useEffect(() => {
        setSliderValue(displayed);
    }, [displayed]);

    const total = entries.data[entries.data.length - 1].getDaysSinceStart() + 1;

    const OFFSET = 0.9;
    const gapToFirst = 1 - OFFSET;

    function indexToSliderOffset(index: BookPageIndex): number {
        let entry;
        if ((entry = index.getEntry())) {
            return gapToFirst + (entry.getDaysSinceStart() * OFFSET) / total;
        } else {
            return 0;
        }
    }

    function sliderOffsetToIndex(offset: number): BookPageIndex {
        if (offset < gapToFirst / 2) {
            return BookPageIndex.homepage(entries);
        }

        return BookPageIndex.entry(
            entries.getClosestEntryByDay(
                (Math.max(gapToFirst, offset) - gapToFirst) *
                    (1 / OFFSET) *
                    total,
            ),
            entries,
        );
    }

    function onStart() {
        activeValue(sliderValue);
    }

    const handleChange = (value: number) => {
        const index = sliderOffsetToIndex(value);
        if (!index.equals(sliderValue)) {
            setSliderValue(index);
            activeValue(index);
        }
    };

    const marks = entries.data.map((entry) => {
        return (entry.getDaysSinceStart() / total) * OFFSET + gapToFirst;
    });

    const changeCommitted = (value: number) => {
        activeValue(sliderOffsetToIndex(value));
        activeValue(null);
    };

    return (
        <div className="h-[100px] overflow-x-hidden w-full min-w-0">
            <ZoomSlider
                value={indexToSliderOffset(sliderValue)}
                onChange={handleChange}
                onChangeCommitted={changeCommitted}
                onStart={onStart}
                marks={marks}
                scrollSpeed={0.25}
                slotClasses={{
                    sticky: 'w-[60px]',
                    scroll: 'w-[100px]',
                    rail: 'rail',
                    mark: 'mark',
                    thumb: 'thumb',
                    container: 'mr-[50px] ml-[50px]',
                    zoomedRail: 'w-[3000px]',
                }}
            />
        </div>
    );
}
