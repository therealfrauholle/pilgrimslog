import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { TileComponentProps } from 'pigeon-maps';
import React from 'react';

interface TileStore extends DBSchema {
    tiles: {
        value: {
            key: string;
            data: Blob;
        };
        key: string;
    };
}

export class CachedTiles {
    database?: IDBPDatabase<TileStore>;

    constructor() {}

    private async db(): Promise<IDBPDatabase<TileStore>> {
        if (this.database != null) {
            return this.database;
        }
        this.database = await openDB<TileStore>('leaflet.offline', 1, {
            upgrade(db, old) {
                if (old == 0) {
                    db.createObjectStore('tiles', {
                        keyPath: 'key',
                    });
                }
            },
        });
        return this.database;
    }

    async loadTile(commit: (data: Blob) => void, props: TileComponentProps) {
        let tileStore = await this.db().then((database) =>
            database.get('tiles', props.tile.key),
        );

        if (tileStore == null) {
            console.log('Fetching for the first time', props.tile.url);
            const image = await (await fetch(props.tile.url)).blob();
            const newTileStore = {
                key: props.tile.key,
                data: image,
            };
            await this.db()
                .then((database) => database.put('tiles', newTileStore))
                .catch((error) => console.warn('Could not save', props, error));
            tileStore = newTileStore;
        }

        commit(tileStore.data);
        //    ;

        props.tileLoaded();
    }
}

const CACHE = new CachedTiles();

type CachedTileState = {
    img: string | null;
};
export class CachedTile extends React.Component<
    TileComponentProps,
    CachedTileState
> {
    state: Readonly<CachedTileState> = {
        img: null,
    };

    constructor(props: TileComponentProps) {
        super(props);
    }

    componentDidMount(): void {
        CACHE.loadTile((data: Blob) => {
            this.setState({ img: URL.createObjectURL(data) });
        }, this.props);
    }

    render() {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={
                    this.state.img
                        ? this.state.img
                        : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
                }
                width={this.props.tile.width}
                height={this.props.tile.height}
                style={{
                    position: 'absolute',
                    left: this.props.tile.left,
                    top: this.props.tile.top,
                    willChange: 'transform',
                    transformOrigin: 'top left',
                    opacity: 1,
                }}
                alt="presentation"
            />
        );
    }
}
