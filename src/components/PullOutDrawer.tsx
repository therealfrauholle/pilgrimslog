'use client';

import { useContext, useState } from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
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
            style={{
                overflow: 'hidden',
                paddingTop: '5px',
                boxShadow: isHome
                    ? 'none'
                    : '0px -10px 10px 0px var(--color-plog-accent)',
                borderTop: isHome
                    ? 'none'
                    : '1px solid var(--color-plog-accent)',
                transition: 'all 1s ease-out',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    height: isOpen
                        ? 'var(--size-map-large)'
                        : 'var(--size-map-small)',
                    paddingBottom:
                        isOpen && !isHome ? 'var(--size-tooltip)' : '0px',
                    transition: 'all 1s ease-out',
                }}
                onClick={() => {
                    if (!isOpen) {
                        setExtended(true);
                    }
                }}
            >
                <div
                    className="absolute"
                    style={{
                        zIndex: 1500,
                        transform: 'translate(-50%, 0%)',
                        top: '-5px',
                        left: '50%',
                        background: 'var(--color-plog-neutral)',
                        borderRadius: '3px',
                        paddingTop: '5px',
                        width: isOpen ? '40px' : '30px',
                        height: isOpen ? '40px' : '30px',
                        transition: 'all 1s ease-out',
                        opacity: isHome ? 0 : 1,
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
                <ControlledMap expanded={isOpen} />
            </div>
            <DaySlider activeValue={setHover} />
        </div>
    );
}
