import MainLayout from '@/components/Main';
import { fetchAndParse, fetchFromStrapi } from '@/util/FetchService';

export async function generateStaticParams() {
    const data = await fetchAndParse();

    return data!.data.map((entry) => ({
        dayId: entry.Id,
    }));
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export default async function Page({
    params,
}: {
    params: Promise<{ dayId: string }>;
}) {
    const { dayId } = await params;
    const entries = await fetchFromStrapi();

    return <MainLayout data={{ entries: entries! }} id={dayId}></MainLayout>;
}
