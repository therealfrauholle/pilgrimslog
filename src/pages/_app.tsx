import type { AppProps } from 'next/app';
import './globals.css';
import { useEffect, useState } from 'react';
import {
    fetchFromStrapi,
    ILogEntries,
    ILogEntry,
    parse,
} from '@/services/FetchService';
import { CircularProgress } from '@mui/material';
import Book from '@/components/Book';
import { BookPageIndex } from '@/types/BookPageIndex';

export type PageProps = { entries: ILogEntries; layout: BookLayout };
export interface BookLayout {
    setPrevious(previous: BookPageIndex | null): void;
    setNext(next: BookPageIndex | null): void;
    setCurrentEntry(enable: ILogEntry | null): void;
}

export default function MyApp({ Component, pageProps }: AppProps) {
    const [data, setData] = useState<ILogEntries | null>(null);
    const [previous, setPrevious] = useState<BookPageIndex | null>(null);
    const [next, setNext] = useState<BookPageIndex | null>(null);
    const [currentEntry, setCurrentEntry] = useState<ILogEntry | null>(null);

    useEffect(() => {
        (async () => {
            const data = await fetchFromStrapi();
            const parsed = parse(data);
            setData(parsed);
        })();
    }, []);

    if (data == null) {
        return <CircularProgress />;
    }

    const ref: BookLayout = new (class Test implements BookLayout {
        setPrevious(p: BookPageIndex | null): void {
            if (p ? !p.equals(previous) : previous != null) {
                setPrevious(p);
            }
        }
        setNext(n: BookPageIndex | null): void {
            if (n ? !n.equals(next) : next != null) {
                setNext(n);
            }
        }
        setCurrentEntry(e: ILogEntry | null): void {
            if (e != currentEntry) {
                setCurrentEntry(e);
            }
        }
    })();

    return (
        <Book
            previous={previous}
            next={next}
            currentlySelectedDay={currentEntry}
        >
            <Component {...pageProps} entries={data} layout={ref} />
        </Book>
    );
}
