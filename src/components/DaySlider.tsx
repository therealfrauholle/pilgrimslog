import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import { BookContext } from './Book';
import ZoomSlider from './ZoomSlider';
import { Page } from '@/types/Page';

export default function DaySlider() {
    const { entries, displayed, setDisplayed } = useContext(BookContext)!;
    const [sliderValue, setSliderValue] = useState(displayed);

    useEffect(() => {
        setSliderValue(displayed);
    }, [displayed]);

    const total = entries.data[entries.data.length - 1].getDaysSinceStart() + 1;

    const OFFSET = 0.9;
    const gapToFirst = 1 - OFFSET;

    function indexToSliderOffset(index: BookPageIndex): number {
        switch (index.page) {
            case Page.Homepage:
                return 0;
            case Page.Entry:
                return (
                    gapToFirst +
                    (index.entry!.getDaysSinceStart() * OFFSET) / total
                );
        }
    }

    function sliderOffsetToIndex(offset: number): BookPageIndex {
        if (offset < gapToFirst / 2) {
            return BookPageIndex.homepage();
        }

        return BookPageIndex.entry(
            entries.getClosestEntryByDay(
                (Math.max(gapToFirst, offset) - gapToFirst) *
                    (1 / OFFSET) *
                    total,
            ),
        );
    }

    const handleChange = (value: number) => {
        setSliderValue(sliderOffsetToIndex(value));
    };

    const marks = entries.data.map((entry) => {
        return (entry.getDaysSinceStart() / total) * OFFSET + gapToFirst;
    });

    const changeCommitted = (value: number) => {
        setDisplayed(sliderOffsetToIndex(value));
    };

    return (
        <div className="h-[100px] overflow-x-hidden w-full min-w-0">
            <ZoomSlider
                value={indexToSliderOffset(sliderValue)}
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
                    thumb: 'thumb',
                    container: 'mr-[50px] ml-[50px]',
                    zoomedRail: 'w-[1000px]',
                }}
            />
        </div>
    );
}
