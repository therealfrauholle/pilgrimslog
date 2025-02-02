import { ILogEntries, ILogEntry } from '@/services/FetchService';
import { BookPageIndex } from '@/types/BookPageIndex';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { SliderThumb } from '@mui/material/Slider';
import { ZoomIn } from '@mui/icons-material';
import React from 'react';

const myThumb: React.ElementType = (props) => {
    return (
        <SliderThumb
            {...props}
            onPointerDown={(e) => {
                props.onPointerDown?.(e); // Preserve default behavior
                // handlePointerDown(); // Add custom behavior
            }}
        ></SliderThumb>
    );
};

export default function CustomSlider({
    entries,
    currentlySelectedDay,
}: {
    entries: ILogEntries;
    currentlySelectedDay: ILogEntry;
}) {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const dayIndex = entries.data.findIndex(
        (entry) => entry.Id == currentlySelectedDay.Id,
    );

    useEffect(() => {
        setIndex(dayIndex);
    }, [dayIndex]);

    console.log('Slider sees index', dayIndex);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setIndex(newValue as number);
        console.log('value updated', newValue);
        setIsZoomed(true);
    };

    function handlePointerDown() {
        setIsZoomed(true);
    }

    const normalWidth = 300;
    const zoomedWidth = 500;
    const percentalOffset = index / entries.data.length;
    const offsetCenter = 0.5 - percentalOffset;
    const maximumAbsoluteOffset = zoomedWidth - normalWidth;
    const marginRight = offsetCenter * maximumAbsoluteOffset;

    return (
        <div className="relative h-[100px] overflow-x-hidden w-full min-w-0 pt-[50px]">
            <div
                className={
                    'absolute left-[50%] translate-x-[-50%] transition-[width] min-w-0 place-self-center duration-300 ease-in-out ' +
                    (isZoomed
                        ? 'w-[' + zoomedWidth + 'px]'
                        : 'w-[' + normalWidth + '300px]') +
                    ' h-[50px]'
                }
                style={isZoomed ? { paddingRight: marginRight * 2 } : {}}
            >
                <Slider
                    value={index}
                    step={1}
                    min={0}
                    max={entries.data.length - 1}
                    onChange={handleChange}
                    marks={true}
                    onChangeCommitted={(event, value) => {
                        router.push(
                            BookPageIndex.entry(
                                entries.data[value as number],
                            ).asUrl(),
                        );
                        setIsZoomed(false);
                    }}
                    slots={{ thumb: myThumb }}
                    slotProps={{ thumb: { onPointerDown: handlePointerDown } }}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value}
                ></Slider>
            </div>
        </div>
    );
}
