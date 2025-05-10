import * as PageModel from './PageModel';

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

    const result = await fetch(apiUrl, { cache: 'no-store' });
    return await result.json();
}

export async function fetchAndParse(): Promise<PageModel.ILogEntries | null> {
    return fetchFromStrapi().then((response) => PageModel.parse(response));
}
