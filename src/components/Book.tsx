'use client';
import {
    fetchFromStrapi,
    ILogEntries,
    ILogEntry,
    parse,
} from '../services/FetchService';
import PullOutDrawer from './PullOutDrawer';
import { createContext, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useParams } from 'next/navigation';
export type BookData = {
    entries: ILogEntries;
    current: ILogEntry | null;
};

export const BookContext = createContext<BookData | null>(null);
export default function Book({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<ILogEntries | null>(null);
    const { dayId } = useParams();

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

    let current = null;
    if (dayId != null) {
        current = data.getDayById(dayId as string);
    }

    return (
        <>
            <div className="flex grid h-dvh w-screen justify-items-center bg-zinc-200 md:p-[20px]">
                <div className="flex flex-col h-full min-h-0 w-full md:w-[700px] shadow-md">
                    <div className="relative flex flex-col h-full w-full">
                        <BookContext.Provider
                            value={{ entries: data, current }}
                        >
                            <div className="flex-grow min-h-0">{children}</div>
                            <div className="flex-none">
                                <PullOutDrawer />
                            </div>
                        </BookContext.Provider>
                    </div>
                </div>
            </div>
        </>
    );
}
