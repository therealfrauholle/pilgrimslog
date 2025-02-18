/* eslint-disable @typescript-eslint/no-namespace */
import rawResponse from './services/apiresponse.json';
import { ILogEntries, parse } from '@/util/FetchService';
import { BookPageIndex } from '@/types/BookPageIndex';

const DATA: ILogEntries = parse(rawResponse);

expect.extend({
    toMatchIndex(received: BookPageIndex, expected: BookPageIndex) {
        if (received.equals(expected)) {
            return {
                message: () => `Expected "${expected}", got "${received}"`,
                pass: true,
            };
        }
        return {
            message: () => `Expected "${expected}", got "${received}"`,
            pass: false,
        };
    },
});

declare global {
    namespace jest {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Matchers<R, T> {
            toMatchIndex(expected: BookPageIndex): T;
        }
    }
}

describe('BookPageIndex', () => {
    describe('homepage', () => {
        const homepage = BookPageIndex.homepage(DATA);
        test('has no previous index', () => {
            expect(homepage.navPrev()).toBeNull();
        });
        test('is followed by first entry', () => {
            expect(homepage.navNext()).toMatchIndex(
                BookPageIndex.entry(DATA.data[0], DATA),
            );
        });
        test('has no entry', () => {
            expect(homepage.getEntry()).toBeNull();
        });
    });
    describe('first index', () => {
        const entry = BookPageIndex.entry(DATA.data[0], DATA);
        test('has the homepage as previous index', () => {
            expect(entry.navPrev()!).toMatchIndex(BookPageIndex.homepage(DATA));
        });
        test('has the second entry as next index', () => {
            expect(entry.navNext()).toMatchIndex(
                BookPageIndex.entry(DATA.data[1], DATA),
            );
        });
    });
    describe('last index', () => {
        const entry = BookPageIndex.entry(
            DATA.data[DATA.data.length - 1],
            DATA,
        );
        test('has no following index', () => {
            expect(entry.navNext()).toBeNull();
        });
        test('has second last entry as previous index', () => {
            expect(entry.navPrev()).toMatchIndex(
                BookPageIndex.entry(DATA.data[DATA.data.length - 2], DATA),
            );
        });
    });
    describe('equals', () => {
        describe('when equal', () => {
            test('homepage', () => {
                expect(
                    BookPageIndex.homepage(DATA).equals(
                        BookPageIndex.homepage(DATA),
                    ),
                ).toBeTruthy();
            });
            test('entry', () => {
                expect(
                    BookPageIndex.entry(DATA.data[0], DATA).equals(
                        BookPageIndex.entry(DATA.data[0], DATA),
                    ),
                ).toBeTruthy();
            });
        });
        describe('when not equal', () => {
            test('homepage and entry', () => {
                expect(
                    BookPageIndex.homepage(DATA).equals(
                        BookPageIndex.entry(DATA.data[0], DATA),
                    ),
                ).toBeFalsy();
            });
            test('entries', () => {
                expect(
                    BookPageIndex.entry(DATA.data[0], DATA).equals(
                        BookPageIndex.entry(DATA.data[1], DATA),
                    ),
                ).toBeFalsy();
            });
        });
    });
});
