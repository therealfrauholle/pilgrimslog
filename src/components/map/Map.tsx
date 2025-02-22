import * as L from 'leaflet';
import { useContext, useEffect, useRef } from 'react';
import { MapContainer, Marker, Tooltip, useMap } from 'react-leaflet';
import { BookContext } from './../Main';
import { LocationOn } from '@mui/icons-material';
import React from 'react';
import CachedLayer from './CachedLayer';
import { ReactIcon } from './ReactIcon';
import { BookPageIndex } from '@/types/BookPageIndex';

function SelectControl(props: {
    selected: BookPageIndex;
    hovered: BookPageIndex | null;
}) {
    const { entries } = useContext(BookContext)!;
    const map = useMap();
    useEffect(() => {
        let selectedEntry;
        let hoveredEntry;
        if (
            (selectedEntry = props.selected.getEntry()) &&
            (props.hovered == null || props.hovered.equals(props.selected))
        ) {
            map.flyTo(selectedEntry.Where, 10);
        } else if (
            (selectedEntry = props.selected.getEntry()) &&
            (hoveredEntry = props.hovered!.getEntry())
        ) {
            map.flyToBounds(
                new L.LatLngBounds([
                    hoveredEntry.Where,
                    selectedEntry.Where,
                ]).pad(0.5),
            );
        } else {
            map.flyToBounds(
                new L.LatLngBounds(entries.data.map((e) => e.Where)),
            );
        }
    }, [props, entries, map]);
    return <></>;
}

type MapProps = {
    hovered: BookPageIndex | null;
};

export default function Map({ hovered }: MapProps) {
    const { entries, displayed, setDisplayed } = useContext(BookContext)!;
    const mapRef = useRef<L.Map | null>(null);

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: hovered ? '400px' : '200px',
                overflow: 'hidden',
                transition: 'all 1s linear',
            }}
        >
            <MapContainer
                ref={mapRef}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '400px',
                    transform: 'translateY(-50%)',
                    top: '50%',
                }}
                bounds={new L.LatLngBounds(entries.data.map((e) => e.Where))}
                zoomControl={false}
            >
                <CachedLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    keepBuffer={3}
                    edgeBuffer={2}
                    updateWhenZooming={true}
                />
                {entries.data.map((entry) => {
                    const icon = new ReactIcon(
                        {
                            iconSize: [48, 48],
                            iconAnchor: [24, 48],
                            tooltipAnchor: [0, -48],
                        },
                        (
                            <LocationOn
                                style={{
                                    ...(displayed.getEntry() == entry
                                        ? {
                                              color: 'red',
                                              transition: 'all 1s linear',
                                          }
                                        : hovered?.getEntry() == entry
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
                                    setDisplayed(
                                        BookPageIndex.entry(entry, entries),
                                    ),
                            }}
                        >
                            {entry == hovered?.getEntry() ||
                            displayed.getEntry() == entry ? (
                                <Tooltip direction={'top'} permanent={true}>
                                    {entry.km}km |{' '}
                                    {entry.getDaysSinceStart() + 1} Tage
                                </Tooltip>
                            ) : null}
                        </Marker>
                    );
                })}

                <SelectControl selected={displayed} hovered={hovered} />
            </MapContainer>
        </div>
    );
}
