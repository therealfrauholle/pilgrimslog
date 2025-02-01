'use client';
import BlogEntry from '@/components/BlogEntry';
import { BookContext } from '@/components/Book';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

export default function Page() {
    const { dayId } = useParams();
    const { entries } = useContext(BookContext)!;

    const theEntry = entries.getDayById(dayId as string)!;

    return <BlogEntry data={theEntry} />;
}
