'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const Map = dynamic(() => import('./map/Map'), { ssr: false });

export default Map;
