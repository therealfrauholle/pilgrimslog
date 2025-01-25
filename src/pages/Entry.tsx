import BlogEntry from '../components/BlogEntry';
import { useParams } from 'react-router-dom';
import HeaderBookmark from '../components/HeaderBookmark';
import { useNavigate } from 'react-router-dom';
import { FetchList } from '../services/FetchService';
import NavigationButtons, {
    LinkLocation,
} from '../components/NavigationButtons';

export default function Entry({ entries }: { entries: FetchList }) {
    const { day } = useParams();
    const theDay = day as any as number;
    const navigate = useNavigate();

    let theEntry = entries.getEntryByDay(theDay);

    if (theEntry === null) return <div>Day not found</div>;

    let previous = LinkLocation.content();
    let next = null;

    if (theEntry.getPrevious() != null) {
        previous = LinkLocation.day(theEntry.getPrevious());
    }

    if (theEntry.getNext() != null) {
        next = LinkLocation.day(theEntry.getNext());
    }

    return (
        <>
            <HeaderBookmark isHome={false} onClick={() => navigate('/')} />
            <BlogEntry data={theEntry} />

            <NavigationButtons next={next} previous={previous} />
        </>
    );
}
