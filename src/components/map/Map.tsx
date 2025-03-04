import { useContext, useEffect, useState } from 'react';
import { BookContext } from './../Main';
import { LocationOn } from '@mui/icons-material';
import { GeolibBounds } from 'geolib/es/types';
import React from 'react';
import { BookPageIndex } from '@/types/BookPageIndex';
import { Map, Marker, TileComponent } from 'pigeon-maps';
import { getBounds } from 'geolib';
import { CachedTile } from './CachedTile';
import { ILogEntries } from '@/util/PageModel';

type Coordinates = {
    lat: number;
    lng: number;
};

const ImgTile: TileComponent = (props) => {
    return <CachedTile {...props} />;
};

function projectMercator(latitude: number) {
    const latRad = (latitude * Math.PI) / 180;

    return Math.log(Math.tan(Math.PI / 4 + latRad / 2)) / (2 * Math.PI);
}

function boundsToCenter(bounds: GeolibBounds, size: Size): MapState {
    const latDiff = bounds.maxLat - bounds.minLat;
    const lngDiff = bounds.maxLng - bounds.minLng;
    const fractionLng = lngDiff / 360;

    const fractionLatMax = projectMercator(bounds.maxLat);
    const fractionLatMin = projectMercator(bounds.minLat);
    const fractionLat = fractionLatMax - fractionLatMin;

    const fractionPerPixelLat = fractionLat / size.height;
    const fractionPerPixelLng = fractionLng / size.width;

    const fractionPerPixel = Math.max(fractionPerPixelLat, fractionPerPixelLng);

    const PIXEL_PER_TILE = 256;
    const fractionPerTile = fractionPerPixel * PIXEL_PER_TILE;
    const numberOfTiles = 1 / fractionPerTile;
    const exactZoomLevel = Math.log2(numberOfTiles);

    const center = {
        lat: bounds.minLat + latDiff / 2,
        lng: bounds.minLng + lngDiff / 2,
    };

    return { center, zoom: exactZoomLevel };
}

function newCenter(
    entries: ILogEntries,
    selected: BookPageIndex,
    size: Size,
): MapState {
    let selectedEntry;
    if ((selectedEntry = selected.getEntry())) {
        return { center: selectedEntry.Where, zoom: 7 };
    } else {
        const locations = entries.data.map((e) => e.Where);
        const bounds = getBounds(locations);
        const mapState = boundsToCenter(bounds, size);

        return mapState;
    }
}

type MapProps = {
    expanded: boolean;
    expand: () => void;
};

type Size = {
    width: number;
    height: number;
};

type MapState = {
    zoom: number;
    center: Coordinates;
};

export default function ControlledMap({ expanded, expand }: MapProps) {
    const { entries, displayed, setDisplayed } = useContext(BookContext)!;
    const [size, setSize] = useState<Size>({ width: 450, height: 350 });
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (container != null) {
            const observer = new ResizeObserver(() => {
                const rect = container.getBoundingClientRect();
                const theSize = { width: rect.width, height: rect.height };
                setSize(theSize);
            });
            observer.observe(container);
            return () => observer.disconnect();
        }
    }, [container]);

    const isHome = displayed.equals(BookPageIndex.homepage(entries));

    const { center, zoom } = newCenter(entries, displayed, size);

    const theEntry = displayed.getEntry();
    const description = theEntry
        ? theEntry.getDaysSinceStart() + 1 + '.Tag | ' + theEntry.km + 'km'
        : '';

    return (
        <>
            <div
                ref={setContainer}
                style={{
                    position: 'absolute',
                    height: 'calc(var(--size-map-large)  - var(--marker-size-large))',
                    visibility: 'hidden',
                    width: 'calc(100% - var(--marker-size))',
                }}
            ></div>
            <div
                style={{
                    position: 'relative',
                    height: expanded
                        ? 'var(--size-map-large)'
                        : 'var(--size-map-small)',
                    paddingBottom:
                        expanded && !isHome ? 'var(--size-tooltip)' : '0px',
                    transition: 'all 1s ease-out',
                }}
                onClick={() => {
                    if (!expanded) {
                        expand();
                    }
                }}
            >
                <div
                    className="absolute left-0"
                    style={{
                        height:
                            expanded && !isHome
                                ? 'var(--size-tooltip)'
                                : 'var(--size-map-small)',
                        zIndex: 999,
                        padding: '5px',
                        width:
                            expanded && !isHome
                                ? '100%'
                                : 'var(--fraction-tooltip)',
                        bottom: expanded && !isHome ? '-15px' : 0,
                        pointerEvents: 'none',
                        transition: 'all 1s ease-out',
                        opacity: isHome ? 0 : 0.8,
                    }}
                >
                    <div className="h-full relative">
                        <span
                            style={{
                                position: 'absolute',
                                transform: 'translate(-50%, -50%)',
                                left: '50%',
                                top: '50%',
                                fontSize: '25px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                transition: 'all 1s ease-out',
                                textShadow: expanded
                                    ? 'none'
                                    : '1px 1px 4px var(--color-plog-neutral)',
                            }}
                        >
                            {description}
                        </span>
                    </div>
                </div>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: '200%',
                            height: 'calc(var(--marker-size-large) * 2 + 100%)',
                            marginTop: isHome
                                ? 'calc((- var(--marker-size-large) - var(--marker-size)) / 2)'
                                : 'calc(- var(marker-size-large))',
                            marginLeft: expanded
                                ? '-50%'
                                : 'calc((var(--fraction-tooltip) - 100%) / 2)',
                            transition: 'all 1s linear',
                        }}
                    >
                        <Map
                            center={[center.lat, center.lng]}
                            zoom={zoom}
                            zoomSnap={false}
                            tileComponent={ImgTile}
                            animateSpeed={1000}
                            animateMaxScreens={999999}
                            mouseEvents={expanded}
                            touchEvents={expanded}
                        >
                            {entries.data.map((entry) => {
                                return (
                                    <Marker
                                        key={entry.km}
                                        style={{
                                            transitionProperty:
                                                'color, opacity, width, height',
                                            transitionTimingFunction:
                                                'ease-out',
                                            transitionDuration: '1s',
                                            transitionDelay: '0s',
                                            color: 'var(--color-plog-normal)',
                                            opacity: 0.5,
                                            height: 'var(--marker-size)',
                                            width: 'var(--marker-size)',
                                            ...(displayed.getEntry() == entry
                                                ? {
                                                      color: 'var(--color-plog-highlight)',
                                                      zIndex: 950,
                                                      opacity: 0.8,
                                                      height: 'var(--marker-size-large)',
                                                      width: 'var(--marker-size-large)',
                                                  }
                                                : {}),
                                        }}
                                        anchor={[
                                            entry.Where.lat,
                                            entry.Where.lng,
                                        ]}
                                        onClick={() => {
                                            setDisplayed(
                                                BookPageIndex.entry(
                                                    entry,
                                                    entries,
                                                ),
                                            );
                                        }}
                                    >
                                        <LocationOn
                                            style={{
                                                pointerEvents: 'auto',
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        />
                                    </Marker>
                                );
                            })}
                        </Map>
                    </div>
                </div>
            </div>
        </>
    );
}
