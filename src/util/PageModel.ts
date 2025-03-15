import haversine from 'haversine-distance';
import { StrapiEntries, StrapiEntry } from './FetchService';

/**
 * Just like {@link StrapiEntries}, but validated, a stable interface
 * and provides additional methods to operate on the data.
 */
export interface ILogEntries {
    /**
     * All entries in this set, sorted ascending by log date.
     */
    data: ILogEntry[];

    readonly getEntryByDay: (day: number) => ILogEntry | null;

    /**
     * Obtain the entry which is closest to the given day.
     *
     * When the next and previous entry after and before the day are
     * the same amount of time apart, will return the earlirr day.
     */
    readonly getClosestEntryByDay: (day: number) => ILogEntry;
    readonly getDayById: (id: string) => ILogEntry | null;
}

class LogEntries implements ILogEntries {
    data: LogEntry[];

    constructor(fetched: StrapiEntries) {
        const startgps = { lat: 52.5522859, lon: 13.3789186 };

        let total = 0.0;
        let lastgps = startgps;

        this.data = fetched.data.map((entry: StrapiEntry) => {
            const thisgps = {
                lat: entry.Where.lat,
                lon: entry.Where.lng,
            };
            const newdistance = haversine(lastgps, thisgps);

            total += newdistance * 1.25;

            lastgps = thisgps;

            const km = Math.round(total / 1000);

            return new LogEntry(entry, km);
        });

        let previous: LogEntry | null = null;
        this.data.forEach((entry: LogEntry) => {
            entry.previous = previous;
            previous = entry;
        });

        let next: LogEntry | null = null;
        this.data
            .slice() // copy because reverse mutates the array
            .reverse()
            .forEach((entry: LogEntry) => {
                entry.next = next;
                next = entry;
            });
    }
    getClosestEntryByDay(day: number): ILogEntry {
        const nextDay = this.data.find(
            (entry) => entry.getDaysSinceStart() > day,
        );
        if (nextDay == null) {
            return this.data[this.data.length - 1];
        }
        const previousDay = nextDay.getPrevious();
        if (previousDay == null) {
            return nextDay;
        }
        if (
            day - previousDay.getDaysSinceStart() >
            nextDay.getDaysSinceStart() - day
        ) {
            return nextDay;
        } else {
            return previousDay;
        }
    }

    getEntryByDay(day: number): ILogEntry | null {
        return (
            this.data.find((entry) => {
                return entry.getDaysSinceStart() === day;
            }) ?? null
        );
    }

    getDayById(id: string): ILogEntry | null {
        return (
            this.data.find((entry) => {
                return entry.Id === id;
            }) ?? null
        );
    }
}

export interface ILogEntry {
    Id: string;
    When: string;
    Where: {
        lat: number;
        lng: number;
    };
    Location: string;
    Content: string;
    km: number;

    /**
     * Days passed since the first day
     *
     * For the first day, will return 0.
     */
    readonly getDaysSinceStart: () => number;

    readonly getPrevious: () => ILogEntry | null;
    readonly getNext: () => ILogEntry | null;
}

class LogEntry implements ILogEntry {
    Id: string;
    When: string;
    Where: {
        lat: number;
        lng: number;
    };
    Location: string;
    Content: string;
    km: number;

    next: ILogEntry | null = null;
    previous: ILogEntry | null = null;

    constructor(fetched: StrapiEntry, km: number) {
        this.Id = fetched.documentId;
        this.When = fetched.When;
        this.Where = fetched.Where;
        this.Content = fetched.Content;
        this.Location = fetched.Location;
        this.km = km;
    }

    getDaysSinceStart(): number {
        const startDate = new Date('2024-05-08'); // Start date: 8 May 2024
        const givenDate = new Date(this.When); // Convert the given date string to a Date object

        return (
            (givenDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
    }

    getPrevious(): ILogEntry | null {
        return this.previous;
    }

    getNext(): ILogEntry | null {
        return this.next;
    }
}

// Store parsed entries. This will make the result conparable to data
// returned by other calls, i.e. when using react strict mode
const PARSED: Map<string, ILogEntries> = new Map();
/**
 * Validate and populate the entries with additional information.
 */
export function parse(entries: StrapiEntries): ILogEntries {
    const asString = JSON.stringify(entries);
    return (
        PARSED.get(asString) ||
        PARSED.set(asString, new LogEntries(entries)).get(asString)!
    );
}
