'use client';
import { ILogEntries, parse, StrapiEntries } from '../util/FetchService';
import { createContext, useState } from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import Book from './Book';

export type BookData = {
    entries: ILogEntries;
    /**
     * The page currently shown at the screen.
     */
    displayed: BookPageIndex;
    /**
     * Display this page in the main window.
     */
    setDisplayed: (current: BookPageIndex) => void;
};

export type StrapiData = {
    entries: StrapiEntries;
};

export const BookContext = createContext<BookData | null>(null);

export default function MainLayout({
    data,
    id,
}: {
    data: StrapiData;
    id?: string;
}) {
    const entries = parse(data.entries);

    const [current, setCurrent] = useState<BookPageIndex>(
        id
            ? BookPageIndex.entry(entries.getDayById(id)!, entries)
            : BookPageIndex.homepage(entries),
    );

    function update(page: BookPageIndex) {
        setCurrent((oldPage) => {
            if (oldPage.equals(page)) {
                return oldPage;
            }
            window.history.pushState(null, '', page.asUrl());
            return page;
        });
    }

    return (
        <>
            <div className="flex grid h-dvh w-screen justify-items-center bg-zinc-200 md:p-[20px]">
                <div className="flex flex-col h-full min-h-0 w-full md:w-[700px] shadow-md">
                    <div className="relative flex flex-col h-full w-full">
                        <BookContext.Provider
                            value={{
                                entries,
                                displayed: current,
                                setDisplayed: update,
                            }}
                        >
                            <Book />
                        </BookContext.Provider>
                    </div>
                </div>
            </div>
        </>
    );
}
