import { ILogEntries, ILogEntry } from '@/services/FetchService';
import { BookPageIndex } from '@/types/BookPageIndex';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function CustomSlider({
    entries,
    currentlySelectedDay,
}: {
    entries: ILogEntries;
    currentlySelectedDay: ILogEntry;
}) {
    const router = useRouter();
    const [index, setIndex] = useState(0);
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
    };

    return (
        <div className="flex grid place-content-center">
            <Box sx={{ width: 300 }}>
                <Slider
                    value={index}
                    step={1}
                    min={0}
                    max={entries.data.length - 1}
                    onChange={handleChange}
                    onChangeCommitted={(event, value) => {
                        router.push(
                            BookPageIndex.entry(
                                entries.data[value as number],
                            ).asUrl(),
                        );
                    }}
                >
                </Slider>
            </Box>
        </div>
    );
}

