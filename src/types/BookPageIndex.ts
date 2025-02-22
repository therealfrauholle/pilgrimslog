import { ILogEntries, ILogEntry } from '@/util/FetchService';

enum IndexType {
    Homepage,
    Entry,
    NotFound,
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

    static notFound(entries: ILogEntries): BookPageIndex {
        return new BookPageIndex(IndexType.NotFound, null, entries);
    }

    is404() {
        return this.page == IndexType.NotFound;
    }

    equals(other: BookPageIndex | null): boolean {
        return other
            ? this.page == other.page && this.entry == other.entry
            : false;
    }

    isBefore(index: BookPageIndex): boolean {
        if (index.entries != this.entries) {
            throw new Error('Cannot conpare indexes with different entries');
        }
        if (this.equals(index)) {
            return false;
        }
        if (
            this.page == IndexType.NotFound ||
            index.page == IndexType.NotFound
        ) {
            return false;
        }
        if (this.page == IndexType.Homepage && index.page == IndexType.Entry) {
            return true;
        }
        if (this.page == IndexType.Entry && index.page == IndexType.Homepage) {
            return false;
        }
        return (
            this.entries.data.indexOf(this.entry!) <
            this.entries.data.indexOf(index.entry!)
        );
    }

    isAfter(index: BookPageIndex): boolean {
        if (this.equals(index)) {
            return false;
        }
        if (
            this.page == IndexType.NotFound ||
            index.page == IndexType.NotFound
        ) {
            return false;
        }
        return index.isBefore(this);
    }

    asUrl(): string {
        switch (this.page) {
            case IndexType.Homepage:
                return '/';
            case IndexType.Entry:
                return '/tag/' + this.entry!.Id;
            case IndexType.NotFound:
                throw new Error('404 has no url');
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
            case IndexType.NotFound:
                return null;
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
            case IndexType.NotFound:
                return null;
        }
    }

    toString(): string {
        switch (this.page) {
            case IndexType.Entry:
                return '[entry ' + this.entry + ']';
            case IndexType.Homepage:
                return '[homepage]';
            case IndexType.NotFound:
                return '[404]';
        }
    }
}
