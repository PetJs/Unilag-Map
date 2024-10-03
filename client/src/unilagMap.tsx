import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Interface for Neighbor
interface Neighbor {
    name: string;
    distance: number;
}

// Interface for Landmark
interface Landmark {
    name: string;
    top: number; // Latitude
    left: number; // Longitude
    neighbours: Neighbor[];
}

// Convert top and left coordinates to latitude and longitude for Leaflet
const convertToLatLng = (top: number, left: number): [number, number] => {
    console.log(`Converting coordinates: top=${top}, left=${left}`); // Log the coordinates
    return [top, left]; // Ensure valid latitude and longitude
};

// Custom component to interact with the map instance using useMap
const MapInteraction: React.FC<{ setMapRef: React.Dispatch<any> }> = ({ setMapRef }) => {
    const map = useMap();
    useEffect(() => {
        setMapRef(map); // Set the map instance reference
    }, [map, setMapRef]);
    return null;
};

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
                console.log("Fetched Landmarks:", response.data); // Log fetched data
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
                        if (landmark) {
                            return convertToLatLng(landmark.top, landmark.left);
                        }
                        return null;
                    }).filter(Boolean) as [number, number][]; // Filter out nulls and ensure type

                    setShortestPath(path);
                    console.log("Shortest Path Coordinates:", path); // Log shortest path coordinates
                })
                .catch(error => {
                    console.error('Error calculating path:', error);
                });
        } else {
            console.warn("Please select both start and end landmarks.");
        }
    };

    const defaultCenter: [number, number] = [6.5244, 3.3792]; // Example center (Lagos, Nigeria)
    const defaultZoom = 15;

    return (
        <div>
            {/* Start and End Landmark Selection */}
            <div style={{ padding: '10px' }}>
                <label>Start Landmark: </label>
                <select onChange={(e) => setStartLandmark(e.target.value)} value={startLandmark || ''}>
                    <option value="" disabled>Select start</option>
                    {landmarks.map(landmark => (
                        <option key={landmark.name} value={landmark.name}>{landmark.name}</option>
                    ))}
                </select>

                <label>End Landmark: </label>
                <select onChange={(e) => setEndLandmark(e.target.value)} value={endLandmark || ''}>
                    <option value="" disabled>Select end</option>
                    {landmarks.map(landmark => (
                        <option key={landmark.name} value={landmark.name}>{landmark.name}</option>
                    ))}
                </select>

                <button onClick={handleCalculatePath}>Calculate Path</button>
            </div>

            {/* Leaflet Map */}
            <MapContainer 
                center={defaultCenter} 
                zoom={defaultZoom} 
                style={{ height: "100vh", width: "100%" }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* MapInteraction component to capture map instance */}
                <MapInteraction setMapRef={(map: any) => mapRef.current = map} />

                {/* Render Markers for each Landmark */}
                {landmarks.map(landmark => {
                    const position = convertToLatLng(landmark.top, landmark.left);
                    console.log("Rendering marker at:", position); // Log position of each marker
                    return (
                        <Marker key={landmark.name} position={position}>
                            <Popup>{landmark.name}</Popup>
                        </Marker>
                    );
                })}

                {/* Draw Shortest Path */}
                {shortestPath.length > 0 && (
                    <Polyline positions={shortestPath} pathOptions={{ color: 'red' }} />
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
