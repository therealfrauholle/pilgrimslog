import BlogEntry from '../components/BlogEntry';
import { useParams } from 'react-router-dom';
import { ILogEntries } from '../services/FetchService';
import { LinkLocation } from '../components/NavigationButtons';
import Book from '../components/Book';

export default function Entry({ entries }: { entries: ILogEntries }) {
    const { id } = useParams();

    let theEntry = entries.getDayById(id);

    if (theEntry === null) return <div>Day not found</div>;

    let previous = LinkLocation.content();
    let next = null;

    if (theEntry.getPrevious() != null) {
        previous = LinkLocation.entry(theEntry.getPrevious());
    }

    if (theEntry.getNext() != null) {
        next = LinkLocation.entry(theEntry.getNext());
    }

    return (
        <>
            <Book
                pageContent={<BlogEntry data={theEntry} />}
                next={next}
                previous={previous}
            />
        </>
    );
}
