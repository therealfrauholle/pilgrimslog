import BlogEntry from '../components/BlogEntry';
import { useParams } from 'react-router-dom';
import HeaderBookmark from '../components/HeaderBookmark';
import { useNavigate } from 'react-router-dom';
import { ILogEntries } from '../services/FetchService';
import NavigationButtons, {
    LinkLocation,
} from '../components/NavigationButtons';

export default function Entry({ entries }: { entries: ILogEntries }) {
    const { id } = useParams();

    const navigate = useNavigate();

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
            <HeaderBookmark isHome={false} onClick={() => navigate('/')} />
            <BlogEntry data={theEntry} />

            <NavigationButtons next={next} previous={previous} />
        </>
    );
}
