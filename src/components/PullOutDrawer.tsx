'use client';

import { useState } from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import DaySlider from './DaySlider';
import ControlledMap from './map/Map';

export default function PullOutDrawer() {
    const [hovered, setHovered] = useState<BookPageIndex | null>(null);

    return (
        <>
            <ControlledMap hovered={hovered} />
            <DaySlider hover={setHovered} />
        </>
    );
}
