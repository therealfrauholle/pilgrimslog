import { ILogEntries } from '@/services/FetchService';
import { NavigationService } from '@/services/NavigationService';
import { BookPageIndex } from '@/types/BookPageIndex';
import { Slider } from '@base-ui-components/react/slider';
import { useRouter } from 'next/navigation';

export default function CustomSlider({ entries }: { entries: ILogEntries }) {

  const router = useRouter();

  return (
    <div className='flex grid place-content-center'>
      <Slider.Root defaultValue={25} step={1} min={0} max={entries.data.length - 1} onValueCommitted={(value, event) => NavigationService.navigateTo(router, BookPageIndex.entry(entries.data[value as number]))}>
        <Slider.Control className="flex w-56 items-center py-3">
          <Slider.Track className="h-1 w-full rounded bg-gray-500 shadow-[inset_0_0_0_1px] shadow-gray-500">
            <Slider.Indicator className="rounded bg-gray-700" />
            <Slider.Thumb className="h-[20px] w-[10px] bg-white outline outline-1 outline-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  );
}
