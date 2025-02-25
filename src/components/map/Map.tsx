import { useContext, useEffect, useRef, useState } from 'react';
import { BookContext } from './../Main';
import { LocationOn } from '@mui/icons-material';
import { GeolibBounds } from 'geolib/es/types';
import React from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import { Map, Marker, TileComponent } from 'pigeon-maps';
import { getBounds } from 'geolib';
import { ILogEntries } from '@/util/FetchService';
import { CachedTile } from './CachedTile';

type Coordinates = {
    lat: number;
    lng: number;
};

const ImgTile: TileComponent = (props) => {
    return <CachedTile {...props} />;
};

function boundsToCenter(bounds: GeolibBounds, size: Size): MapState {
    const latDiff = bounds.maxLat - bounds.minLat;
    const lngDiff = bounds.maxLng - bounds.minLng;

    const degreePerPixelLat = latDiff / size.width;
    const degreePerPixelLng = lngDiff / size.height;

    const degreePerPixel = Math.max(degreePerPixelLat, degreePerPixelLng);

    const fractionPerPixel = degreePerPixel / 360;

    const PIXEL_PER_TILE = 256;
    const fractionPerTile = fractionPerPixel * PIXEL_PER_TILE;
    const exactZoomLevel = Math.log2(1 / fractionPerTile) * 0.9;

    const center = {
        lat: bounds.minLat + latDiff / 2,
        lng: bounds.minLng + lngDiff / 2,
    };
    return { center, zoom: exactZoomLevel };
}

function newCenter(
    entries: ILogEntries,
    selected: BookPageIndex,
    hovered: BookPageIndex | null,
    size: Size,
): MapState {
    let selectedEntry;
    let hoveredEntry;
    if (
        (selectedEntry = selected.getEntry()) &&
        (hovered == null || hovered.equals(selected))
    ) {
        return { center: selectedEntry.Where, zoom: 11 };
    } else if (
        (selectedEntry = selected.getEntry()) &&
        (hoveredEntry = hovered!.getEntry())
    ) {
        return boundsToCenter(
            getBounds([hoveredEntry.Where, selectedEntry.Where]),
            size,
        );
    } else {
        return boundsToCenter(
            getBounds(entries.data.map((e) => e.Where)),
            size,
        );
    }
}

type MapProps = {
    hovered: BookPageIndex | null;
};

type Size = {
    width: number;
    height: number;
};

type MapState = {
    zoom: number;
    center: Coordinates;
};

export default function ControlledMap({ hovered }: MapProps) {
    const { entries, displayed, setDisplayed } = useContext(BookContext)!;
    const [size, setSize] = useState<Size | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current !== null) {
            const observer = new ResizeObserver(() => {
                if (containerRef.current !== null) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setSize({ width: rect.width, height: rect.height });
                }
            });
            observer.observe(containerRef.current);
            return () => {
                observer.disconnect();
            };
        }
    }, [containerRef]);

    const { center, zoom } = newCenter(
        entries,
        displayed,
        hovered,
        size ?? { width: 400, height: 200 },
    );

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: hovered ? '400px' : '200px',
                transition: 'all 1s linear',
            }}
        >
            <Map
                center={[center.lat, center.lng]}
                zoom={zoom}
                zoomSnap={false}
                tileComponent={ImgTile}
                animateMaxScreens={999999}
            >
                {entries.data.map((entry) => {
                    return (
                        <Marker
                            key={entry.km}
                            width={48}
                            height={48}
                            style={{
                                ...(displayed.getEntry() == entry
                                    ? {
                                          color: 'red',
                                          transition: 'color 1s linear',
                                      }
                                    : hovered?.getEntry() == entry
                                      ? {
                                            color: 'blue',
                                            transition: 'color 0.2s linear',
                                        }
                                      : {
                                            color: 'black',
                                            transition: 'color 0.2s linear',
                                        }),
                            }}
                            anchor={[entry.Where.lat, entry.Where.lng]}
                            onClick={() =>
                                setDisplayed(
                                    BookPageIndex.entry(entry, entries),
                                )
                            }
                        >
                            <div style={{ width: 48, height: 48 }}>
                                <LocationOn
                                    style={{
                                        pointerEvents: 'auto',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </div>
                        </Marker>
                    );
                })}
            </Map>
        </div>
    );
}
