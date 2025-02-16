import * as L from 'leaflet';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { MapContainer, Marker, Tooltip, useMap } from 'react-leaflet';
import { BookContext } from './../Book';
import { LocationOn } from '@mui/icons-material';
import React from 'react';
import CachedLayer from './CachedLayer';
import { ReactIcon } from './ReactIcon';
import { BookPageIndex } from '@/types/BookPageIndex';
import { Page } from '@/types/Page';
import { useResizeDetector } from 'react-resize-detector';

function SelectControl(props: {
    selected: BookPageIndex;
    hovered: BookPageIndex | null;
}) {
    const bookData = useContext(BookContext)!;
    const map = useMap();
    useEffect(() => {
        if (
            props.selected.page == Page.Entry &&
            (props.hovered == null || props.hovered.equals(props.selected))
        ) {
            map.flyTo(props.selected.getEntry()!.Where, 10);
        } else if (
            props.selected.page == Page.Entry &&
            props.hovered!.page == Page.Entry
        ) {
            map.flyToBounds(
                new L.LatLngBounds([
                    props.hovered!.getEntry()!.Where,
                    props.selected.getEntry()!.Where,
                ]).pad(0.5),
            );
        } else {
            map.flyToBounds(
                new L.LatLngBounds(bookData.entries.data.map((e) => e.Where)),
            );
        }
    }, [props, bookData.entries, map]);
    return <></>;
}

type MapProps = {
    hovered: BookPageIndex | null;
};

export default function Map(props: MapProps) {
    const bookData = useContext(BookContext)!;
    const mapRef = useRef<L.Map | null>(null);

    const onResize = useCallback(() => {
        mapRef.current!.invalidateSize({
            animate: true,
            pan: true,
            duration: 0.1,
        });
    }, []);

    const { ref } = useResizeDetector({
        refreshMode: 'throttle',
        refreshRate: 100,
        onResize,
    });
    return (
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
            <MapContainer
                ref={mapRef}
                style={{ height: '100%' }}
                bounds={
                    new L.LatLngBounds(
                        bookData.entries.data.map((e) => e.Where),
                    )
                }
            >
                <CachedLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    keepBuffer={3}
                    edgeBuffer={2}
                    updateWhenZooming={true}
                />
                {bookData.entries.data.map((entry) => {
                    const icon = new ReactIcon(
                        {
                            iconSize: [48, 48],
                            iconAnchor: [24, 48],
                            tooltipAnchor: [0, -48],
                        },
                        (
                            <LocationOn
                                style={{
                                    ...(bookData.displayed.getEntry() == entry
                                        ? {
                                              color: 'red',
                                              transition: 'all 1s linear',
                                          }
                                        : props.hovered?.getEntry() == entry
                                          ? {
                                                color: 'blue',
                                                transition: 'all 0.2s linear',
                                            }
                                          : {
                                                color: 'black',
                                                transition: 'all 0.2s linear',
                                            }),
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        ),
                    );
                    return (
                        <Marker
                            key={entry.km}
                            icon={icon}
                            position={entry.Where}
                            eventHandlers={{
                                click: () =>
                                    bookData.setDisplayed(
                                        BookPageIndex.entry(entry),
                                    ),
                            }}
                        >
                            {entry == props.hovered?.getEntry() ||
                            bookData.displayed.getEntry() == entry ? (
                                <Tooltip direction={'top'} permanent={true}>
                                    {entry.km}km |{' '}
                                    {entry.getDaysSinceStart() + 1} Tage
                                </Tooltip>
                            ) : null}
                        </Marker>
                    );
                })}

                <SelectControl
                    selected={bookData.displayed}
                    hovered={props.hovered}
                />
            </MapContainer>
        </div>
    );
}
