'use client';

import { useState } from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import DaySlider from './DaySlider';
import Map from './Map';

export default function PullOutDrawer() {
    const [hovered, setHovered] = useState<BookPageIndex | null>(null);

    return (
        <>
            <Map hovered={hovered} />
            <DaySlider hover={setHovered} />
        </>
    );
}
