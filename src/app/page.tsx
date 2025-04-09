import MainLayout from '@/components/Main';
import { fetchFromStrapi } from '@/util/FetchService';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Logbuch eines Pilgers',
};

export default async function Home() {
    const entries = await fetchFromStrapi();
    return <MainLayout data={{ entries: entries! }}></MainLayout>;
}
