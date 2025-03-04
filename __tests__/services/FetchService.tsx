import { test, describe, expect } from '@jest/globals';
import rawResponse from './apiresponse.json';
import { ILogEntries, parse } from '@/util/PageModel';

const DATA: ILogEntries = parse(rawResponse);

describe('fetch service', () => {
    test('Can get day with exact match', () => {
        expect(DATA.getClosestEntryByDay(0).getDaysSinceStart()).toBe(0);
        expect(DATA.getClosestEntryByDay(6).Id).toBe('documentId-2');
    });
    test('Closest day is earlier', () => {
        expect(DATA.getClosestEntryByDay(15).Id).toBe('documentId-4');
        expect(DATA.getClosestEntryByDay(24).Id).toBe('documentId-8');
    });
    test('Closest day is later', () => {
        expect(DATA.getClosestEntryByDay(16).Id).toBe('documentId-5');
        expect(DATA.getClosestEntryByDay(27).Id).toBe('documentId-9');
    });
    test('When same day distance, choose earlier', () => {
        expect(DATA.getClosestEntryByDay(21).Id).toBe('documentId-7');
        expect(DATA.getClosestEntryByDay(45).Id).toBe('documentId-12');
    });
    test('Selected day beyond range', () => {
        expect(DATA.getClosestEntryByDay(999).Id).toBe('documentId-24');
    });
});
