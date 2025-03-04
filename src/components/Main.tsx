'use client';
import { createContext, useState } from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import Book from './Book';
import { StrapiEntries } from '@/util/FetchService';
import { ILogEntries, parse } from '@/util/PageModel';

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
    notFound,
}: {
    data: StrapiData;
    id?: string;
    notFound?: boolean;
}) {
    const entries = parse(data.entries);

    const [current, setCurrent] = useState<BookPageIndex>(
        notFound
            ? BookPageIndex.notFound(entries)
            : id
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
            <div className="flex grid h-dvh w-screen justify-items-center bg-ivory md:p-[20px]">
                <div className="flex flex-col h-full min-h-0 w-full md:w-[700px] shadow-md bg-neutral">
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
