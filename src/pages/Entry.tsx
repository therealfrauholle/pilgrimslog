import BlogEntry from '../components/BlogEntry';
import { useParams } from 'react-router-dom';
import { ILogEntries } from '../services/FetchService';
import { BookPageIndex } from '../components/BottomBar';
import Book from '../components/Book';

export default function Entry({ entries }: { entries: ILogEntries }) {
    const { id } = useParams();

    let theEntry = entries.getDayById(id);

    if (theEntry === null) return <div>Day not found</div>;

    let previous = BookPageIndex.content();
    let next = null;

    if (theEntry.getPrevious() != null) {
        previous = BookPageIndex.entry(theEntry.getPrevious());
    }

    if (theEntry.getNext() != null) {
        next = BookPageIndex.entry(theEntry.getNext());
    }

    return (
        <>
            <Book
                next={next}
                previous={previous}
                currentlySelectedDay={theEntry}
            >
                <BlogEntry data={theEntry} />
            </Book>
        </>
    );
}
