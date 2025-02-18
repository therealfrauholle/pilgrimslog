import { ILogEntries, ILogEntry } from '@/util/FetchService';
import { Page } from './Page';

export class BookPageIndex {
    page: Page;
    entry: ILogEntry | null;
    entries: ILogEntries;

    constructor(page: Page, entry: ILogEntry | null, entries: ILogEntries) {
        this.page = page;
        this.entry = entry;
        this.entries = entries;
    }

    static entry(entry: ILogEntry, entries: ILogEntries): BookPageIndex {
        return new BookPageIndex(Page.Entry, entry, entries);
    }

    static homepage(entries: ILogEntries): BookPageIndex {
        return new BookPageIndex(Page.Homepage, null, entries);
    }

    equals(other: BookPageIndex | null): boolean {
        return other
            ? this.page == other.page && this.entry == other.entry
            : false;
    }

    asUrl(): string {
        switch (this.page) {
            case Page.Homepage:
                return '/';
            case Page.Entry:
                return '/tag/' + this.entry!.Id;
        }
    }

    getEntry(): ILogEntry | null {
        return this.entry;
    }

    navNext(): BookPageIndex | null {
        switch (this.page) {
            case Page.Entry:
                const nextEntry = this.entry!.getNext();
                if (nextEntry == null) {
                    return null;
                }
                return BookPageIndex.entry(nextEntry, this.entries);
            case Page.Homepage:
                return BookPageIndex.entry(this.entries.data[0], this.entries);
        }
    }

    navPrev(): BookPageIndex | null {
        switch (this.page) {
            case Page.Entry:
                const previousEntry = this.entry!.getPrevious();
                if (previousEntry == null) {
                    return BookPageIndex.homepage(this.entries);
                }
                return BookPageIndex.entry(previousEntry, this.entries);
            case Page.Homepage:
                return null;
        }
    }

    toString(): string {
        switch (this.page) {
            case Page.Entry:
                return '[entry ' + this.entry + ']';
            case Page.Homepage:
                return '[homepage]';
        }
    }
}
