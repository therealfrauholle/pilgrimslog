import BlogEntry from '@/components/BlogEntry';
import { BookPageIndex } from '@/components/PullOutDrawer';
import { PageProps } from '../_app';
import { useParams } from 'next/navigation';

export default function Page({ entries, layout }: PageProps) {
    const { dayId } = useParams();
    const theEntry = entries.getDayById(dayId as string)!;

    let previous = BookPageIndex.homepage();
    let next = null;

    if (theEntry.getPrevious() != null) {
        previous = BookPageIndex.entry(theEntry.getPrevious()!);
    }

    if (theEntry.getNext() != null) {
        next = BookPageIndex.entry(theEntry.getNext()!);
    }

    layout.setNext(next);
    layout.setPrevious(previous);
    layout.setCurrentEntry(theEntry);

    return <BlogEntry data={theEntry} />;
}
