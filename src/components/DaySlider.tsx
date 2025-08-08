import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { BookPageIndex } from '@/util/BookPageIndex';
import { BookContext } from './Main';
import ZoomSlider from './ZoomSlider';
import { ILogEntry } from '@/util/PageModel';

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
    const jitterWhenEqual = 0.0025;
    const minDayDistance = 0.005; 
    const OFFSET = 0.92;
    const gapToFirst = 1 - OFFSET;
    const endPadding = 0.0025;

    let positionOfPreviousMark = -1;
    let gap = gapToFirst;

    const marks = entries.data.map((entry) => {
        const estimatedPositionOfCurrentMark =
            (entry.getDaysSinceStart() / total) * OFFSET + gap;
        let positionOfCurrentMark = 0;

        if (positionOfPreviousMark >= 0) {
            const distance =
                estimatedPositionOfCurrentMark - positionOfPreviousMark;
            if (distance == 0) {
                positionOfCurrentMark =
                    estimatedPositionOfCurrentMark + jitterWhenEqual;
                gap += jitterWhenEqual;
            } else if (distance > gapToFirst) {
                const distanceReducer = distance - gapToFirst;
                positionOfCurrentMark =
                    estimatedPositionOfCurrentMark - distanceReducer;
                gap -= distanceReducer;
            } else if (distance < minDayDistance && distance > 0) {
                positionOfCurrentMark = positionOfPreviousMark + minDayDistance;
                gap += (minDayDistance - distance);
            } else {
                positionOfCurrentMark = estimatedPositionOfCurrentMark;
            }
        } else {
            positionOfCurrentMark = estimatedPositionOfCurrentMark;
        }
        
        positionOfPreviousMark = positionOfCurrentMark;
        return positionOfCurrentMark;
    });

    let normalizedMarks: number[] = [];
    const lastMarkValue = marks[marks.length - 1];
    const maxNormalizedValue = 1.0 - endPadding; 

    marks.forEach((mark) => {
        normalizedMarks.push((mark / lastMarkValue) * maxNormalizedValue);
    });

    function indexToSliderOffset(index: BookPageIndex): number {
        let entry: ILogEntry | null;
        if ((entry = index.getEntry())) {
            const entryIndex = entries.data.findIndex(e => e === entry);
            if (entryIndex >= 0 && entryIndex < normalizedMarks.length) {
                return normalizedMarks[entryIndex];
            }
        }
        return 0; 
    }

    function sliderOffsetToIndex(offset: number): BookPageIndex {
        const adjustedGapThreshold = (gapToFirst / lastMarkValue) * maxNormalizedValue / 2;
        
        if (offset < adjustedGapThreshold) {
            return BookPageIndex.homepage(entries);
        }
        let closestIndex = 0;
        let minDistance = Math.abs(normalizedMarks[0] - offset);
        
        for (let i = 1; i < normalizedMarks.length; i++) {
            const distance = Math.abs(normalizedMarks[i] - offset);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        
        return BookPageIndex.entry(entries.data[closestIndex], entries);
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
                marks={normalizedMarks}
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
