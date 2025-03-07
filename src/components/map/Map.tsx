import { useContext, useEffect, useState } from 'react';
import { BookContext } from './../Main';
import { LocationOn } from '@mui/icons-material';
import { GeolibBounds } from 'geolib/es/types';
import React from 'react';
import { BookPageIndex } from '@/util/BookPageIndex';
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
            <div ref={setContainer} className="mapreference"></div>
            <div
                className={
                    'drawer ' +
                    (expanded ? 'expanded ' : '') +
                    (isHome ? 'home ' : '')
                }
                onClick={() => {
                    if (!expanded) {
                        expand();
                    }
                }}
            >
                <div
                    className="description"
                    style={{
                        zIndex: 999,
                    }}
                >
                    <div className="h-full relative">
                        <span className="innerdescription">{description}</span>
                    </div>
                </div>
                <div className="mapframe">
                    <div className="map">
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
                                        className={
                                            'marker ' +
                                            (displayed.getEntry() == entry
                                                ? 'selected'
                                                : '')
                                        }
                                        style={{
                                            zIndex:
                                                displayed.getEntry() == entry
                                                    ? 950
                                                    : 900,
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
                                        <LocationOn className="icon"
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
