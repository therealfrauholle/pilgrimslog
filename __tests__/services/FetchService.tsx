import { test, describe, expect } from '@jest/globals';
import rawResponse from './apiresponse.json';
import { ILogEntries, parse } from '@/util/FetchService';

const DATA: ILogEntries = parse(rawResponse);

describe('fetch service', () => {
    test('Can get day with exact match', () => {
        expect(DATA.getClosestEntryByDay(1).getDaysSinceStart()).toBe(1);
        expect(DATA.getClosestEntryByDay(7).Id).toBe(
            'qjpbv7e0qpzskdi53zcx6dw4',
        );
    });
    test('Closest day is earlier', () => {
        expect(DATA.getClosestEntryByDay(16).Id).toBe(
            'aaxbwoy98eo9gsb8jo4k6zs1',
        );
        expect(DATA.getClosestEntryByDay(25).Id).toBe(
            's3pzxc6r1s7cfqwhl61h7pxd',
        );
    });
    test('Closest day is later', () => {
        expect(DATA.getClosestEntryByDay(17).Id).toBe(
            'u43c2pjc5zmlbjwxbvefd1zk',
        );
        expect(DATA.getClosestEntryByDay(28).Id).toBe(
            'oykqdzlw74fskh5i1f9z6ixa',
        );
    });
    test('When same day distance, choose earlier', () => {
        expect(DATA.getClosestEntryByDay(22).Id).toBe(
            'airc6r1a1x3ir0wxmviczgie',
        );
        expect(DATA.getClosestEntryByDay(46).Id).toBe(
            'ho2ptx8x5xhcq99n5ccuxnz6',
        );
    });
    test('Selected day beyond range', () => {
        expect(DATA.getClosestEntryByDay(999).Id).toBe(
            'dl5gymu06ym0y1l1213dzqy4',
        );
    });
});
