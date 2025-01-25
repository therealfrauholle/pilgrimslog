import haversine from 'haversine-distance';

export interface ILogEntries {
    data: ILogEntry[];

    readonly getEntryByDay: (day: number) => ILogEntry;
}

class LogEntries {
    data: LogEntry[] = null;

    constructor(fetched: ILogEntries) {
        this.data = fetched.data.map((entry) => new LogEntry(entry));

        let previous = null;
        this.data.forEach((entry: LogEntry) => {
            entry.previous = previous;
            previous = entry;
        });

        let next = null;
        this.data
            .slice()
            .reverse()
            .forEach((entry: LogEntry) => {
                entry.next = next;
                next = entry;
            });
    }

    getEntryByDay(day: number): ILogEntry {
        return this.data.find((entry) => {
            return entry.getDaysSinceStart() === day;
        });
    }
}
export interface ILogEntry {
    When: string;
    Where: {
        lat: number;
        lng: number;
    };
    Location: string;
    Content: string;
    km: number;

    readonly getDaysSinceStart: () => number;

    readonly getPrevious: () => ILogEntry;
    readonly getNext: () => ILogEntry;
}

class LogEntry {
    When: string = null;
    Where: {
        lat: number;
        lng: number;
    } = null;
    Location: string = null;
    Content: string = null;
    km: number = null;

    next: ILogEntry = null;
    previous: ILogEntry = null;

    constructor(fetched: ILogEntry) {
        this.When = fetched.When;
        this.Where = fetched.Where;
        this.Content = fetched.Content;
        this.Location = fetched.Location;
        this.km = fetched.km;
    }

    getDaysSinceStart(): number {
        const startDate = new Date('2024-05-07'); // Start date: 8 May 2024
        const givenDate = new Date(this.When); // Convert the given date string to a Date object

        return (
            (givenDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
    }

    getPrevious(): ILogEntry {
        return this.previous;
    }

    getNext(): ILogEntry {
        return this.next;
    }
}

export async function fetchAll(): Promise<ILogEntries> {
    const apiUrl =
        'https://api.todaycounts.de/api/log-entries?populate=*&sort=When:asc&pagination[pageSize]=10000';

    return fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // TODO do sanity check of json
            return response.json();
        })
        .then((json) => {
            console.log('Full API Response:', json); // Log the full response

            // Check the structure of the data
            if (json) {
                const data = new LogEntries(json);

                const startgps = { lat: 52.5522859, lon: 13.3789186 };

                let total = 0.0;
                let lastgps = startgps;

                data.data.forEach(function (entry: LogEntry) {
                    const thisgps = {
                        lat: entry.Where.lat,
                        lon: entry.Where.lng,
                    };
                    const newdistance = haversine(lastgps, thisgps);

                    total += newdistance * 1.25;

                    lastgps = thisgps;

                    entry.km = Math.round(total / 1000);
                });
                return data;
            } else {
                console.warn('Unexpected data structure:', json);
                return null;
            }
        });
}
