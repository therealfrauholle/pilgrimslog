import * as L from 'leaflet';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import React, { useEffect } from 'react';
import { useLeafletContext } from '@react-leaflet/core';

interface TileStore extends DBSchema {
    tiles: {
        value: {
            x: number;
            y: number;
            z: number;
            data: Blob;
        };
        key: number;
        indexes: { coords: [number, number, number] };
    };
}

class CachedLayerImpl extends L.GridLayer {
    database?: IDBPDatabase<TileStore>;
    template: string;
    edgeBuffer: number;

    constructor(
        template: string,
        edgeBuffer: number,
        options?: L.TileLayerOptions,
    ) {
        super(options);
        this.template = template;
        this.edgeBuffer = edgeBuffer;
    }

    private async db(): Promise<IDBPDatabase<TileStore>> {
        if (this.database != null) {
            return this.database;
        }
        this.database = await openDB<TileStore>('leaflet.offline', 1, {
            upgrade(db) {
                const tileStore = db.createObjectStore('tiles', {
                    autoIncrement: true,
                });
                tileStore.createIndex('coords', ['x', 'y', 'z'], {
                    unique: true,
                });
            },
        });
        return this.database;
    }

    protected getKey(coords: L.Coords): [number, number, number] {
        return [coords.x, coords.y, coords.z];
    }

    private async _loadTile(
        done: L.DoneCallback,
        tile: HTMLDivElement,
        coords: L.Coords,
    ) {
        let tileStore = await this.db().then((database) =>
            database.getFromIndex('tiles', 'coords', this.getKey(coords)),
        );

        if (tileStore == null) {
            const url = this.getTileUrl(coords);
            console.log('Fetching for the first time', coords);
            const image = await (await fetch(url)).blob();
            const newTileStore = {
                x: coords.x,
                y: coords.y,
                z: coords.z,
                data: image,
            };
            await this.db()
                .then((database) => database.put('tiles', newTileStore))
                .catch((error) =>
                    console.warn('Could not save', coords, error),
                );
            tileStore = newTileStore;
        }

        tile.style.background =
            'url(' + URL.createObjectURL(tileStore.data) + ')';

        done();
    }

    getTileUrl(coords: L.Coords): string {
        const subdomains = ['a', 'b', 'c'];
        const subdomain =
            subdomains[Math.round(Math.random() * (subdomains.length - 1))];
        return L.Util.template(this.template, { s: subdomain, ...coords });
    }

    protected createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
        const tile = document.createElement('div');

        this._loadTile(done, tile, coords);
        tile.setAttribute('role', 'presentation');

        return tile;
    }

    old_getTiledPixelBounds(center: L.LatLngExpression): L.Bounds {
        const map = this._map,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mapZoom = (map as any)._animatingZoom
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  Math.max((map as any)._animateToZoom, map.getZoom())
                : map.getZoom(),
            scale = map.getZoomScale(mapZoom, this._tileZoom),
            pixelCenter = map.project(center, this._tileZoom).floor(),
            halfSize = map.getSize().divideBy(scale * 2);

        const pixelEdgeBuffer = super.getTileSize
            .call(this)
            .multiplyBy(this.edgeBuffer);

        const b = new L.Bounds(
            pixelCenter.subtract(halfSize).subtract(pixelEdgeBuffer),
            pixelCenter.add(halfSize).add(pixelEdgeBuffer),
        );
        console.log(b, pixelCenter, halfSize, pixelEdgeBuffer);
        return b;
    }
}

type CachedLayerProps = {
    url: string;
    edgeBuffer: number;
} & L.GridLayerOptions;

const CachedLayer = React.memo(function CachedLayer(props: CachedLayerProps) {
    const map = useLeafletContext();
    useEffect(() => {
        const theLayer = new CachedLayerImpl(
            props.url,
            props.edgeBuffer,
            props,
        );
        const container = map.layerContainer || map.map;

        container.addLayer(theLayer);

        return function cleanup() {
            container.removeLayer(theLayer);
        };
    }, [map.layerContainer, map.map, props]);

    return <></>;
});

export default CachedLayer;
