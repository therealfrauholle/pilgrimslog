import BlogEntry from '@/components/BlogEntry';
import Book from '@/components/Book';
import { BookPageIndex } from '@/components/BottomBar';
import { fetchRaw, parse } from '@/services/FetchService';

interface Props {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    data: any;
    id: string;
}

export async function getStaticPaths() {
    const posts = await fetchRaw();

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const paths = posts.data.map((post: any) => ({
        params: { slug: String(post.documentId) },
    }));

    // We'll prerender only these paths at build time.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
    const posts = await fetchRaw();

    return {
        props: { data: posts, id: params.slug },
        // Next.js will invalidate the cache when a
        // request comes in, at most once every 60 seconds.
        revalidate: 60,
    };
}

export default function Page(props: Props) {
    const entries = parse(props.data);

    const theEntry = entries.getDayById(props.id)!;

    let previous = BookPageIndex.content();
    let next = null;

    if (theEntry.getPrevious() != null) {
        previous = BookPageIndex.entry(theEntry.getPrevious()!);
    }

    if (theEntry.getNext() != null) {
        next = BookPageIndex.entry(theEntry.getNext()!);
    }

    return (
        <Book next={next} previous={previous} currentlySelectedDay={theEntry}>
            <BlogEntry data={theEntry} />
        </Book>
    );
}
