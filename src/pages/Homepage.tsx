import Book from '../components/Book';
import { BookPageIndex } from '../components/BottomBar';
import CoverPage from './CoverPage';

export default function Homepage() {
    return (
        <>
            <Book
                previous={null}
                next={BookPageIndex.content()}
                currentlySelectedDay={null}
            >
                <CoverPage />
            </Book>
        </>
    );
}
