import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import React from 'react';
import SliderValueLabel from '@mui/material/Slider/SliderValueLabel';
import { Mark } from '@mui/material/Slider/useSlider.types';
import { BookPageIndex } from '@/types/BookPageIndex';
import { ILogEntries, ILogEntry } from '@/util/FetchService';
import { SliderModel } from '@/util/SliderDataModel';

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

enum ZoomState {
    /**
     * Slider is in its normal, zoomed out size.
     */
    Normal,
    /**
     * The slider is currently executing a css transition.
     * The actual width and left valie are adapting (zooming in).
     */
    Zooming,
    /**
     * The slider is zoomed in and currently being changed.
     */
    Zoomed,
    /**
     * The slider has been released and is returning to its normal
     * size.
     */
    Release,
}

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
    const [hoveredDay, setHoveredDay] = useState(theDay);
    const [center, setCenter] = useState(0);
    const [zoomState, setZoomState] = useState(ZoomState.Normal);

    // We need this to properly rerender the slider on external navigatio
    // It appears thaz this can retrigger a component update
    useEffect(() => {
        setDay(currentlySelectedDay);
    }, [currentlySelectedDay]);

    const normalWidth = 300;
    const zoomedWidth = 2000;
    const total = entries.data[entries.data.length - 1].getDaysSinceStart() - 1;
    const handleChange = (event: Event, newValue: number | number[]) => {
        if (newValue != theDay && zoomState != ZoomState.Zoomed) {
            setZoomState(ZoomState.Zooming);
        }
        if (zoomState == ZoomState.Normal || zoomState == ZoomState.Release) {
            const dim = SliderModel.generateCenter(
                (newValue as number) - 1,
                total,
                normalWidth,
                zoomedWidth,
            );
            setCenter(dim.newCenter());
        } else {
            const dim = new SliderModel(
                (newValue as number) - 1,
                total,
                center,
                normalWidth,
                zoomedWidth,
            );
            setCenter(dim.newCenter());
        }
        setDay(
            entries
                .getClosestEntryByDay(newValue as number)
                .getDaysSinceStart(),
        );
        setHoveredDay(newValue as number);
    };

    function handlePointerDown() {
        const dim = SliderModel.generateCenter(
            theDay - 1,
            total,
            normalWidth,
            zoomedWidth,
        );
        setCenter(dim.newCenter());
        setZoomState(ZoomState.Zooming);
    }

    const isZoomed = [ZoomState.Zooming, ZoomState.Zoomed].includes(zoomState);

    const zoomDimensions = new SliderModel(
        hoveredDay - 1,
        total,
        center,
        normalWidth,
        zoomedWidth,
    );

    const spacingLeft = zoomDimensions.left();
    console.log('spacing js', spacingLeft);

    let spacingString = '+ ' + spacingLeft + 'px';
    if (spacingLeft < 0) {
        spacingString = '- ' + -spacingLeft + 'px';
    }
    const marks = entries.data.map((entry) => {
        return { value: entry.getDaysSinceStart() };
    });

    return (
        <div>
            {center}
            <br />
            <div className="relative h-[100px] overflow-x-hidden w-full min-w-0 pt-[50px]">
                <div
                    onTransitionEnd={() => {
                        if (
                            zoomState == ZoomState.Release ||
                            zoomState == ZoomState.Normal
                        ) {
                            setZoomState(ZoomState.Normal);
                        } else {
                            setZoomState(ZoomState.Zoomed);
                        }
                    }}
                    className={
                        ' absolute translate-x-[-50%] ease-in-out ' +
                        ([
                            ZoomState.Zooming,
                            ZoomState.Normal,
                            ZoomState.Release,
                        ].includes(zoomState)
                            ? 'duration-500 transition-[left,width]'
                            : 'duration-200 transition-[left,width]') +
                        ' h-[50px]'
                    }
                    style={{
                        // Need to do these style updates here because with tailwind classes it breaks
                        width: isZoomed ? zoomedWidth : normalWidth,
                        left: isZoomed
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
                            router.push(
                                BookPageIndex.entry(closestDay).asUrl(),
                            );
                            setZoomState(ZoomState.Release);
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
        </div>
    );
}
