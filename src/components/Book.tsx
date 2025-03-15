import { useContext } from 'react';
import { BookPage } from './BookPage';
import PullOutDrawer from './PullOutDrawer';
import { BookContext } from './Main';

export default function Book() {
    const { displayed } = useContext(BookContext)!;

    if (displayed.is404()) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center">
                <h1>404</h1>
            </div>
        );
    }

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
