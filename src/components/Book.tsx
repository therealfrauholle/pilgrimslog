'use client';
import { ILogEntries, parse, StrapiEntries } from '../util/FetchService';
import PullOutDrawer from './PullOutDrawer';
import { createContext, useState } from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import { useParams } from 'next/navigation';
import { BookPage } from './BookPage';

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

export default function Book({ data }: { data: StrapiData }) {
    const entries = parse(data.entries);
    const params = useParams();

    const [current, setCurrent] = useState<BookPageIndex>(
        'dayId' in params
            ? BookPageIndex.entry(
                  entries.getDayById(params.dayId as string)!,
                  entries,
              )
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
                            <div className="flex-grow min-h-0">
                                <BookPage current={current} />
                            </div>
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
