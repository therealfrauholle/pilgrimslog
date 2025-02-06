'use client';
import { fetchFromStrapi, ILogEntries, parse } from '../util/FetchService';
import PullOutDrawer from './PullOutDrawer';
import { createContext, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { BookPageIndex } from '@/types/BookPageIndex';
import { Page } from '@/types/Page';
import Title from './Title';
import BlogEntry from './BlogEntry';
export type BookData = {
    entries: ILogEntries;
    current: BookPageIndex;
    setCurrent: (current: BookPageIndex) => void;
};

export const BookContext = createContext<BookData | null>(null);
export default function Book({ location }: { location: string | null }) {
    const [data, setData] = useState<ILogEntries | null>(null);
    const [current, setCurrent] = useState<BookPageIndex>(
        BookPageIndex.homepage(),
    );

    useEffect(() => {
        (async () => {
            if (data == null) {
                const data = await fetchFromStrapi();
                const parsed = parse(data);
                let current = BookPageIndex.homepage();
                if (location != null) {
                    current = BookPageIndex.entry(parsed.getDayById(location)!);
                }
                setCurrent(current);
                setData(parsed);
            }
        })();
    }, [location, data]);

    if (data == null) {
        return <CircularProgress />;
    }

    let children;

    switch (current.page) {
        case Page.Homepage:
            children = <Title />;
            break;
        case Page.Entry:
            children = <BlogEntry data={current.entry!} />;
            break;
    }

    function update(page: BookPageIndex) {
        window.history.pushState(null, '', page.asUrl());
        setCurrent(page);
    }

    return (
        <>
            <div className="flex grid h-dvh w-screen justify-items-center bg-zinc-200 md:p-[20px]">
                <div className="flex flex-col h-full min-h-0 w-full md:w-[700px] shadow-md">
                    <div className="relative flex flex-col h-full w-full">
                        <BookContext.Provider
                            value={{
                                entries: data,
                                current,
                                setCurrent: update,
                            }}
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
