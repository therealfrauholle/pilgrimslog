import { ILogEntry } from '@/services/FetchService';
import { Page } from './Page';

export class BookPageIndex {
    page: Page;
    entry: ILogEntry | null;

    constructor(page: Page, entry: ILogEntry | null) {
        this.page = page;
        this.entry = entry;
    }

    static entry(entry: ILogEntry): BookPageIndex {
        return new BookPageIndex(Page.Entry, entry);
    }

    static homepage(): BookPageIndex {
        return new BookPageIndex(Page.Homepage, null);
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
}
