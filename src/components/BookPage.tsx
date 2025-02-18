import BlogEntry from './BlogEntry';
import Title from './Title';
import { BookPageIndex } from '@/types/BookPageIndex';

export function BookPage({ current }: { current: BookPageIndex }) {

    function toElement(current: BookPageIndex) {
        let entry;
        if ((entry = current.getEntry())) {
            return <BlogEntry data={entry} />;
        } else {
            return <Title />;
        }
    }

    return toElement(current);
}
