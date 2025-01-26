import Book from '../components/Book';
import { LinkLocation } from '../components/BottomBar';
import CoverPage from './CoverPage';

export default function Homepage() {
    return (
        <>
            <Book
                pageContent={<CoverPage />}
                previous={null}
                next={LinkLocation.content()}
                currentlySelectedDay={null}
            />
        </>
    );
}
