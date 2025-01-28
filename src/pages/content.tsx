import { useRouter } from 'next/navigation';
import Book from '@/components/Book';
import EntriesList from '@/components/EntriesList';
import { BookPageIndex } from '@/components/BottomBar';
import { fetchFromStrapi, parse, StrapiEntries } from '@/services/FetchService';

// This function gets called at build time
export async function getStaticProps() {
    // Call an external API endpoint to get posts
    const entries = await fetchFromStrapi();

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            entries,
        },
    };
}

export default function Contentpage({ entries }: { entries: StrapiEntries }) {
    const navigate = useRouter();

    const theEntries = parse(entries);

    const handleEntrySelect = (id: string) => {
        console.log(id);
        navigate.push(`/tag/${id}`);
    };

    return (
        <>
            <Book
                previous={BookPageIndex.homepage()}
                next={BookPageIndex.entry(theEntries.data[0])}
                currentlySelectedDay={null}
            >
                <EntriesList
                    entries={theEntries}
                    onEntrySelect={handleEntrySelect}
                />
            </Book>
        </>
    );
}
