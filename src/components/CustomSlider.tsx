import { ILogEntries, ILogEntry } from '@/services/FetchService';
import { NavigationService } from '@/services/NavigationService';
import { BookPageIndex } from '@/types/BookPageIndex';
import { Slider } from '@base-ui-components/react/slider';
import { useRouter } from 'next/navigation';

export default function CustomSlider({ entries, currentlySelectedDay}: { entries: ILogEntries; currentlySelectedDay:ILogEntry | null }) {

  const router = useRouter();
  const dayIndex = currentlySelectedDay ? entries.data.findIndex((entry) => entry.Id == currentlySelectedDay!.Id) : 0;

  console.log(currentlySelectedDay ? entries.data.findIndex((entry) => entry.Id == currentlySelectedDay!.Id) : 0)
  console.log(dayIndex)
  return (
    <div className='flex grid place-content-center'>
      <Slider.Root
        key={dayIndex}
        value={dayIndex}
        step={1}
        min={0}
        max={entries.data.length - 1}
        onValueCommitted={(value, event) => {
          NavigationService.navigateTo(router, BookPageIndex.entry(entries.data[value as number]))
        }
        }>
        <Slider.Control className="flex w-56 items-center py-3">
          <Slider.Track className="h-1 w-full rounded bg-gray-500 shadow-[inset_0_0_0_1px] shadow-gray-500">
            <Slider.Indicator className="rounded bg-gray-700" />
            <Slider.Thumb aria-valuetext={dayIndex + ""} className="h-[20px] w-[10px] bg-white outline outline-1 outline-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  );
}
