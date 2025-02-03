import { SliderModel } from '@/util/SliderDataModel';
import { test, describe, expect } from '@jest/globals';

const normalSize = 200;
const expandedSize = 1000;
describe(
    'slider parameters(' + +normalSize + ' -> ' + expandedSize + ')',
    () => {
        describe('generate center', () => {
            {
                const hover = 50;
                test('with hover(' + hover + ') in center', () => {
                    const generated = SliderModel.generateCenter(
                        hover,
                        101,
                        normalSize,
                        expandedSize,
                    );
                    expect(generated.newCenter()).toBe(50);
                });
            }
            {
                const hover = 40;
                test('with hover(' + hover + ') left', () => {
                    const generated = SliderModel.generateCenter(
                        hover,
                        101,
                        normalSize,
                        expandedSize,
                    );
                    expect(generated.newCenter()).toBe(42);
                });
            }
            {
                const hover = 0;
                test('with hover(' + hover + ') left edge', () => {
                    const generated = SliderModel.generateCenter(
                        hover,
                        101,
                        normalSize,
                        expandedSize,
                    );
                    expect(generated.newCenter()).toBe(10);
                });
            }
            {
                const hover = 100;
                test('with hover(' + hover + ') right edge', () => {
                    const generated = SliderModel.generateCenter(
                        hover,
                        101,
                        normalSize,
                        expandedSize,
                    );
                    expect(generated.newCenter()).toBe(90);
                });
            }
        });
        {
            const center = 50;
            describe('center in middle(' + center + ')', () => {
                {
                    const hover = 50;
                    describe('hovered (' + hover + ') in center', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(0);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(50);
                        });
                    });
                }
                {
                    const hover = 40;
                    describe('hovered (' + hover + ') before edge', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(0);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(50);
                        });
                    });
                }
                {
                    const hover = 30;
                    describe('hovered (' + hover + ') over left edge', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(100);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(40);
                        });
                    });
                }
                {
                    const hover = 70;
                    describe('hovered (' + hover + ') over right edge', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(-100);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(60);
                        });
                    });
                }
            });
        }
        {
            const center = 30;
            describe('center left (' + center + ')', () => {
                {
                    const hover = 30;
                    describe('hovered (' + hover + ') in center', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(200);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(30);
                        });
                    });
                }
                {
                    const hover = 20;
                    describe('hovered (' + hover + ') before edge', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(200);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(30);
                        });
                    });
                }
                {
                    const hover = 10;
                    describe('hovered (' + hover + ') over left edge', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(300);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(20);
                        });
                    });
                }
                {
                    const hover = 50;
                    describe('hovered (' + hover + ') over right edge', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(100);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(40);
                        });
                    });
                }
            });
        }
        {
            const center = 10;
            describe('center far left (' + center + ')', () => {
                {
                    const hover = 10;
                    describe('hovered (' + hover + ') in center', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(400);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(10);
                        });
                    });
                }
                {
                    const hover = 0;
                    describe('hovered (' + hover + ') at left end', () => {
                        const dummy = new SliderModel(
                            hover,
                            101,
                            center,
                            normalSize,
                            expandedSize,
                        );
                        test('left', () => {
                            expect(dummy.left()).toBe(400);
                        });
                        test('center', () => {
                            expect(dummy.newCenter()).toBe(10);
                        });
                    });
                }
            });
        }
    },
);
