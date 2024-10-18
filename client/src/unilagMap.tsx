import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup,Tooltip } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import SetMapView from './setMap';


// Interface for Neighbor
interface Neighbor {
    name: string;
    distance: number;
}

// Interface for Landmark
interface Landmark {
    name: string;
    latitude: number; // Latitude
    longitude: number; // Longitude
    neighbours: Neighbor[];
}


const MapComponent: React.FC = () => {
    const [landmarks, setLandmarks] = useState<Landmark[]>([]);
    const [startLandmark, setStartLandmark] = useState<string | null>(null);
    const [endLandmark, setEndLandmark] = useState<string | null>(null);
    const [shortestPath, setShortestPath] = useState<[number, number][]>([]);
    const mapRef = useRef<any>(null); // Reference to the map instance

    useEffect(() => {
        // Fetch landmarks data from the backend
        axios.get('http://localhost:3000/Landmark')
            .then(response => {
                console.log("Fetched Landmarks:", response.data); 
                setLandmarks(response.data);
            })
            .catch(error => {
                console.error('Error fetching landmarks:', error);
            });
    }, []);

    const handleCalculatePath = () => {
        console.log("Start Landmark:", startLandmark);
        console.log("End Landmark:", endLandmark);

        if (startLandmark && endLandmark) {
            axios.post('http://localhost:3000/calculate-path', { start: startLandmark, end: endLandmark })
                .then(response => {
                    console.log("Path Response:", response.data);
                    const path = response.data.shortestPath.map((landmarkName: string) => {
                        const landmark = landmarks.find(l => l.name === landmarkName);
                        return landmark ? [landmark.latitude, landmark.longitude] : null;
                    }).filter(Boolean) as [number, number][];

                    setShortestPath(path);
                    console.log("Shortest Path Coordinates:", path); 
                })
                .catch(error => {
                    console.error('Error calculating path:', error);
                });
        } else {
            console.warn("Please select both start and end landmarks.");
        }
    };

    const defaultCenter: [number, number] = [6.51771, 3.38423]; 
    const defaultZoom = 17;

    return (
        <div className="flex h-screen">
            
            <div className="w-1/3 p-4 bg-gray-100">
                <h1  className="text-lg font-semibold mb-4">UniLag Map Preview</h1>

                <label className="block mb-2">Where are you now?</label>
                <select 
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    onChange={(e) => setStartLandmark(e.target.value)} 
                    value={startLandmark || ''}>
                    <option value="" disabled>Select Location</option>
                    {landmarks.map(landmark => (
                        <option key={landmark.name} value={landmark.name}>{landmark.name}</option>
                    ))}
                </select>

                <label className="block mb-2">Where are you going to?</label>
                <select 
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    onChange={(e) => setEndLandmark(e.target.value)} 
                    value={endLandmark || ''}>
                    <option value="" disabled>Select Location</option>
                    {landmarks.map(landmark => (
                        <option key={landmark.name} value={landmark.name}>{landmark.name}</option>
                    ))}
                </select>

                <button 
                    onClick={handleCalculatePath} 
                    className="w-full bg-blue-500 text-white p-2 rounded">
                    Calculate Path
                </button>
            </div>

            
            <div className="w-2/3 h-full p-4 border-l border-gray-300">
                <MapContainer 
                    center={defaultCenter} 
                    zoom={defaultZoom} 
                    className="h-full w-full" 
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />

                    
                    {landmarks.map(landmark => {
                        const position: [number, number] = [landmark.latitude, landmark.longitude];
                        return (
                            <Marker 
                                key={landmark.name} 
                                position={position} 
                                icon={new L.Icon({
                                    iconUrl: markerIconUrl,
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41],
                                })}>
                                <Tooltip direction="bottom" offset={[0, 10]} permanent>
                                    <span>{landmark.name}</span>
                                </Tooltip>
                                <Popup>{landmark.name}</Popup>
                            </Marker>
                        );
                    })}

                    
                    {shortestPath.length > 0 && (
                        <Polyline positions={shortestPath} pathOptions={{ color: 'red' }} />
                    )}

                    
                    <SetMapView center={defaultCenter} zoom={defaultZoom} />
                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent;
