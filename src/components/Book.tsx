import { BookPage } from './BookPage';
import PullOutDrawer from './PullOutDrawer';

export default function Book() {
    return (
        <>
            <div className="flex-grow min-h-0">
                <BookPage />
            </div>
            <div className="flex-none">
                <PullOutDrawer />
            </div>
        </>
    );
}
