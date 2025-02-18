import { ILogEntries, ILogEntry } from '@/util/FetchService';

enum IndexType {
    Homepage,
    Entry,
}

export class BookPageIndex {
    private page: IndexType;
    private entry: ILogEntry | null;
    private entries: ILogEntries;

    private constructor(
        page: IndexType,
        entry: ILogEntry | null,
        entries: ILogEntries,
    ) {
        this.page = page;
        this.entry = entry;
        this.entries = entries;
    }

    static entry(entry: ILogEntry, entries: ILogEntries): BookPageIndex {
        return new BookPageIndex(IndexType.Entry, entry, entries);
    }

    static homepage(entries: ILogEntries): BookPageIndex {
        return new BookPageIndex(IndexType.Homepage, null, entries);
    }

    equals(other: BookPageIndex | null): boolean {
        return other
            ? this.page == other.page && this.entry == other.entry
            : false;
    }

    asUrl(): string {
        switch (this.page) {
            case IndexType.Homepage:
                return '/';
            case IndexType.Entry:
                return '/tag/' + this.entry!.Id;
        }
    }

    getEntry(): ILogEntry | null {
        return this.entry;
    }

    navNext(): BookPageIndex | null {
        switch (this.page) {
            case IndexType.Entry:
                const nextEntry = this.entry!.getNext();
                if (nextEntry == null) {
                    return null;
                }
                return BookPageIndex.entry(nextEntry, this.entries);
            case IndexType.Homepage:
                return BookPageIndex.entry(this.entries.data[0], this.entries);
        }
    }

    navPrev(): BookPageIndex | null {
        switch (this.page) {
            case IndexType.Entry:
                const previousEntry = this.entry!.getPrevious();
                if (previousEntry == null) {
                    return BookPageIndex.homepage(this.entries);
                }
                return BookPageIndex.entry(previousEntry, this.entries);
            case IndexType.Homepage:
                return null;
        }
    }

    toString(): string {
        switch (this.page) {
            case IndexType.Entry:
                return '[entry ' + this.entry + ']';
            case IndexType.Homepage:
                return '[homepage]';
        }
    }
}
