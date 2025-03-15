import MainLayout from '@/components/Main';
import { fetchFromStrapi } from '@/util/FetchService';

export default async function Home() {
    const entries = await fetchFromStrapi();
    return <MainLayout data={{ entries: entries! }}></MainLayout>;
}
