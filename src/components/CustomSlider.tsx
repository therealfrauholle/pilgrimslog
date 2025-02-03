import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';
import Slider from '@mui/material/Slider';
import React from 'react';
import SliderValueLabel from '@mui/material/Slider/SliderValueLabel';
import { Mark } from '@mui/material/Slider/useSlider.types';
import { BookPageIndex } from '@/types/BookPageIndex';
import { ILogEntries, ILogEntry } from '@/util/FetchService';
import { reducer, SliderModel, UiModel } from '@/util/SliderDataModel';

const labelHiddenWhenNoMark: React.ElementType = (props) => {
    const selectedValue = props.ownerState.value;
    if (
        props.ownerState.marks.find((mark: Mark) => {
            return mark.value == selectedValue;
        }) == null
    ) {
        return (
            <SliderValueLabel
                {...props}
                className={props.className + ' hidden'}
            ></SliderValueLabel>
        );
    }
    return <SliderValueLabel {...props}></SliderValueLabel>;
};

export default function CustomSlider({
    entries,
    currentlySelectedDay: currentlySelectedEntry,
}: {
    entries: ILogEntries;
    currentlySelectedDay: ILogEntry;
}) {
    const router = useRouter();
    const currentlySelectedDay = currentlySelectedEntry.getDaysSinceStart();
    const [theDay, setDay] = useState(currentlySelectedDay);

    const normalWidth = 300;
    const zoomedWidth = 2000;
    const total = entries.data[entries.data.length - 1].getDaysSinceStart() - 1;
    const [model, dispatch] = useReducer(
        reducer,
        new UiModel(total, currentlySelectedDay - 1, normalWidth, zoomedWidth),
    );

    // We need this to properly rerender the slider on external navigatio
    // It appears thaz this can retrigger a component update
    useEffect(() => {
        setDay(currentlySelectedDay);
    }, [currentlySelectedDay]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        if (!model.zoomed) {
            dispatch({ type: 'zoom', value: (newValue as number) - 1 });
        } else {
            dispatch({ type: 'change', value: (newValue as number) - 1 });
        }
        setDay(
            entries
                .getClosestEntryByDay(newValue as number)
                .getDaysSinceStart(),
        );
    };

    function handlePointerDown() {
        dispatch({ type: 'zoom' });
    }

    const spacingLeft = model.slider.left();

    let spacingString = '+ ' + spacingLeft + 'px';
    if (spacingLeft < 0) {
        spacingString = '- ' + -spacingLeft + 'px';
    }
    const marks = entries.data.map((entry) => {
        return { value: entry.getDaysSinceStart() };
    });

    return (
        <div className="relative h-[100px] overflow-x-hidden w-full min-w-0 pt-[50px]">
            <div
                className={
                    ' absolute translate-x-[-50%] ease-in-out ' +
                    (model.zoomed
                        ? 'duration-600 transition-[left,width]'
                        : 'duration-500 transition-[left,width]') +
                    ' h-[50px]'
                }
                style={{
                    // Need to do these style updates here because with tailwind classes it breaks
                    width: model.zoomed ? zoomedWidth : normalWidth,
                    left: model.zoomed
                        ? 'calc(50% ' + spacingString + ')'
                        : '50%',
                }}
            >
                <Slider
                    sx={{
                        '& .MuiSlider-mark': {
                            height: '10px',
                            background: 'black',
                        },
                        '& .MuiSlider-valueLabel': {
                            whiteSpace: 'nowrap',
                            background: '#888888',
                            color: '#eeeeee',
                            top: -30,
                            position: 'absolute',
                            padding: '1px 5px 1px 5px',
                            borderRadius: 1,
                        },
                        '& .MuiSlider-valueLabel::before': {
                            position: 'absolute',
                            display: 'inherit',
                            content: '""',
                            width: 8,
                            height: 8,
                            transform: 'translate(-50%, 50%) rotate(45deg)',
                            backgroundColor: 'inherit',
                            left: '50%',
                            bottom: 0,
                        },
                    }}
                    value={theDay}
                    step={1}
                    min={1}
                    max={entries.data[
                        entries.data.length - 1
                    ].getDaysSinceStart()}
                    onChange={handleChange}
                    marks={marks}
                    onChangeCommitted={(event, value) => {
                        const closestDay = entries.getClosestEntryByDay(
                            value as number,
                        );
                        router.push(BookPageIndex.entry(closestDay).asUrl());
                        dispatch({ type: 'release' });
                    }}
                    slots={{
                        valueLabel: labelHiddenWhenNoMark,
                    }}
                    slotProps={{
                        thumb: { onPointerDown: handlePointerDown },
                    }}
                    valueLabelDisplay={'auto'}
                    valueLabelFormat={(value) => {
                        const hoveredDay = entries.getEntryByDay(
                            value as number,
                        );
                        if (hoveredDay == null) {
                            return <></>;
                        }
                        return (
                            'Day ' +
                            hoveredDay!.getDaysSinceStart() +
                            ' | ' +
                            hoveredDay?.km +
                            'km'
                        );
                    }}
                ></Slider>
            </div>
        </div>
    );
}
