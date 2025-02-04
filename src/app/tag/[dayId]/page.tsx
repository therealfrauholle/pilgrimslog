'use client';
import Book from '@/components/Book';
import { useParams } from 'next/navigation';

export default function Page() {
    const { dayId } = useParams();

    return <Book location={dayId as string}></Book>;
}
