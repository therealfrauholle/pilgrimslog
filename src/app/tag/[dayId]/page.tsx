import MainLayout from '@/components/Main';
import { fetchAndParse, fetchFromStrapi } from '@/util/FetchService';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const data = await fetchAndParse();

    return data!.data.map((entry) => ({
        dayId: entry.Id,
    }));
}

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 60;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ dayId: string }>;
}): Promise<Metadata> {
    const { dayId } = await params;

    const page = await fetchAndParse();
    const entry = page!.getDayById(dayId)!;

    return {
        title: 'Tag ' + (entry.getDaysSinceStart() + 1),
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ dayId: string }>;
}) {
    const { dayId } = await params;
    const entries = await fetchFromStrapi();

    return <MainLayout data={{ entries: entries! }} id={dayId}></MainLayout>;
}
