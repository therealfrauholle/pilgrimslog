import { ILogEntries, ILogEntry } from '@/services/FetchService';
import { BookPageIndex } from '@/types/BookPageIndex';
import { Slider } from '@base-ui-components/react/slider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    if (index != dayIndex) {
        console.log('update index to ', dayIndex);
        setIndex(dayIndex);
    }
    console.log('Slider sees index', dayIndex);
    return (
        <div className="flex grid place-content-center">
            <Slider.Root
                value={index}
                step={1}
                min={0}
                max={entries.data.length - 1}
                onValueChange={(value) => {
                    console.log('value updated', value);
                }}
                onValueCommitted={(value) => {
                    router.push(
                        BookPageIndex.entry(
                            entries.data[value as number],
                        ).asUrl(),
                    );
                }}
            >
                <Slider.Control className="flex w-56 items-center py-3">
                    <Slider.Track className="h-1 w-full rounded bg-gray-500 shadow-[inset_0_0_0_1px] shadow-gray-500">
                        <Slider.Indicator className="rounded bg-gray-700" />
                        <Slider.Thumb
                            aria-valuetext={index + ''}
                            className="h-[20px] w-[10px] bg-white outline outline-1 outline-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800"
                        />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
        </div>
    );
}
