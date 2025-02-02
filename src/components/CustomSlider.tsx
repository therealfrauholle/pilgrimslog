import { ILogEntries, ILogEntry } from '@/services/FetchService';
import { BookPageIndex } from '@/types/BookPageIndex';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Slider from '@mui/material/Slider';
import { SliderThumb } from '@mui/material/Slider';
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

enum ZoomState {
    Normal,
    Zooming,
    ZoomingWithChange,
    Zoomed,
    Release,
}

export default function CustomSlider({
    entries,
    currentlySelectedDay,
}: {
    entries: ILogEntries;
    currentlySelectedDay: ILogEntry;
}) {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [zoomState, setZoomState] = useState(ZoomState.Normal);
    const containerRef = useRef<HTMLDivElement>(null);
    const dayIndex = entries.data.findIndex(
        (entry) => entry.Id == currentlySelectedDay.Id,
    );

    useEffect(() => {
        setIndex(dayIndex);
    }, [dayIndex]);

    console.log('Slider sees index', dayIndex);

    const handleChange = (event: Event, newValue: number | number[]) => {
        console.log('value updated', newValue);
        if (newValue != index && zoomState != ZoomState.Zoomed) {
            setZoomState(ZoomState.ZoomingWithChange);
        }
        setIndex(newValue as number);
    };

    function handlePointerDown() {
        setZoomState(ZoomState.Zooming);
    }

    const normalWidth = 300;
    const zoomedWidth = 500;
    const percentalOffset = index / entries.data.length;
    const offsetCenter = 0.5 - percentalOffset;
    const maximumAbsoluteOffset = zoomedWidth - normalWidth;
    const spacingLeft = offsetCenter * maximumAbsoluteOffset;
    let spacingString = '+ ' + spacingLeft + 'px';
    if (spacingLeft < 0) {
        spacingString = '- ' + -spacingLeft + 'px';
    }
    console.log('spaxing ought to be ' + spacingString);
    const isZoomed = [
        ZoomState.ZoomingWithChange,
        ZoomState.Zooming,
        ZoomState.Zoomed,
    ].includes(zoomState);
    return (
        <div className="relative h-[100px] overflow-x-hidden w-full min-w-0 pt-[50px]">
            <div
                onTransitionEnd={() => {
                    if (zoomState == ZoomState.Release) {
                        console.log('transition ended, state normal');
                        setZoomState(ZoomState.Normal);
                    } else {
                        console.log('transition ended, state zoomed');
                        setZoomState(ZoomState.Zoomed);
                    }
                }}
                ref={containerRef}
                className={
                    'absolute translate-x-[-50%] transition-[left,width] min-w-0 place-self-center duration-[1s] ease-in-out ' +
                    ([
                        ZoomState.Zooming,
                        ZoomState.Normal,
                        ZoomState.Release,
                    ].includes(zoomState)
                        ? 'duration-[1s] transition-[left,width]'
                        : zoomState == ZoomState.ZoomingWithChange
                            ? 'duration-100 transition-[left,width]'
                            : 'transition-none') +
                    ' ' +
                    (isZoomed
                        ? 'w-[' + zoomedWidth + 'px]'
                        : 'w-[' + normalWidth + 'px]') +
                    ' h-[50px]'
                }
                style={{
                    left: isZoomed ? 'calc(50% ' + spacingString + ')' : '50%',
                }}
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
                        setZoomState(ZoomState.Release);
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
