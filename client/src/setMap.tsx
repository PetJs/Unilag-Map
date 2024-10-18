import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const SetMapView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    return null;
};

export default SetMapView;
