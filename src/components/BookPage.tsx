import { Page } from '@/types/Page';
import BlogEntry from './BlogEntry';
import Title from './Title';
import { BookPageIndex } from '@/types/BookPageIndex';

export function BookPage({ current }: { current: BookPageIndex }) {
    switch (current.page) {
        case Page.Homepage:
            return <Title />;
        case Page.Entry:
            return <BlogEntry data={current.entry!} />;
    }
}
