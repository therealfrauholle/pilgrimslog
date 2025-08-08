'use client';

import { useContext, useState } from 'react';
import { BookPageIndex } from '@/util/BookPageIndex';
import DaySlider from './DaySlider';
import ControlledMap from './map/Map';
import { BookContext } from './Main';
import { ChevronLeftSharp } from '@mui/icons-material';

export default function PullOutDrawer() {
    const { setDisplayed, displayed, entries } = useContext(BookContext)!;
    const [isHovering, setHovering] = useState(false);
    const [extended, setExtended] = useState(false);

    const isHome = displayed.equals(BookPageIndex.homepage(entries));
    const isOpen = isHovering || isHome || extended;

    const setHover = (entry: BookPageIndex | null) => {
        if (entry === null) {
            setHovering(false);
        } else {
            setDisplayed(entry);
            setHovering(true);
            setExtended(false);
        }
    };

    return (
        <div
            className={
                'drawer ' + (isOpen ? 'open' : '') + (isHome ? ' home' : '')
            }
            style={{
                zIndex: 1100,
            }}
        >
            <div
                className={
                    'opener ' + (isHome ? 'home ' : '') + (isOpen ? 'open' : '')
                }
                style={{
                    zIndex: 1500,
                }}
                onClick={() => setExtended(!extended)}
            >
                <ChevronLeftSharp
                    style={{
                        transform:
                            'rotate(90deg) ' +
                            (extended ? 'scale(-1,1)' : 'scale(1,1)'),
                        transition: 'all 1s ease-out',
                        height: '100%',
                        width: '100%',
                    }}
                />
            </div>
            <ControlledMap expanded={isOpen} expand={() => setExtended(true)} />
            <DaySlider activeValue={setHover} />
        </div>
    );
}
