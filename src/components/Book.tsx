import { ILogEntry } from '../services/FetchService';
import PullOutDrawer from './PullOutDrawer';
import { JSX } from 'react/jsx-runtime';
import Head from 'next/head';
import { BookPageIndex } from '@/types/BookPageIndex';

export default function Book({
    children,
    previous,
    next,
    currentlySelectedDay,
}: {
    children: JSX.Element;
    previous: BookPageIndex | null;
    next: BookPageIndex | null;
    currentlySelectedDay: ILogEntry | null;
}) {
    return (
        <>
            <Head>
                <title>Logbuch eines Pilgers</title>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="theme-color" content="#000000" />
                <meta name="description" content="Logbuch eines Pilgers" />
                <link
                    rel="icon"
                    type="image/png"
                    href="/favicon-96x96.png"
                    sizes="96x96"
                />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <div className="flex grid h-dvh w-screen justify-items-center bg-zinc-200 md:p-[20px]">
                <div className="flex flex-col h-full min-h-0 w-full md:w-[700px] shadow-md">
                    <div className="relative flex flex-col h-full w-full">
                        <div className="flex-grow min-h-0">{children}</div>
                        <div className="flex-none">
                            <PullOutDrawer
                                previous={previous}
                                next={next}
                                currentlySelectedDay={currentlySelectedDay}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
