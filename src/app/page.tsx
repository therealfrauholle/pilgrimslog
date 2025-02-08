import Book from '@/components/Book';
import { fetchFromStrapi } from '@/util/FetchService';

export default async function Home() {
    const entries = await fetchFromStrapi();
    return <Book data={{ entries: entries! }}></Book>;
}
