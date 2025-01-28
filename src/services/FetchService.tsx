import haversine from 'haversine-distance';

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
        const startDate = new Date('2024-05-07'); // Start date: 8 May 2024
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
/**
 * A set of log entries, as provided by strapi
 * .
 * Naming of fielda needa to match the strapi format!
 */
export interface StrapiEntries {
    data: StrapiEntry[];
}

/**
 * A log entry, as provided by strapi.
 *
 * Naming of fielda needa to match the strapi format!
 */
export interface StrapiEntry {
    documentId: string;
    When: string;
    Where: {
        lat: number;
        lng: number;
    };
    Location: string;
    Content: string;
}

export async function fetchFromStrapi(): Promise<StrapiEntries> {
    const apiUrl =
        'https://api.todaycounts.de/api/log-entries?populate=*&sort=When:asc&pagination[pageSize]=10000';

    return (await fetch(apiUrl)).json();
}
/**
 * Validate and populate the entries with additional information.
 */
export function parse(entries: StrapiEntries): ILogEntries {
    return new LogEntries(entries);
}

export async function fetchAndParse(): Promise<ILogEntries | null> {
    return fetchFromStrapi().then((response) => {
        return new LogEntries(response);
    });
}
