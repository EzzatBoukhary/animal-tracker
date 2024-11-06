
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS here
import markerIconPng from 'leaflet/dist/images/marker-icon.png';


interface Post {
    username: string;
    location: { latitude: number; longitude: number };
    photo: string;
    description: string;
    animal: string;
    postedDate: string;

    _id: string;
    /*userId: number;
    photo: string;
    location: string;
    description: string;
    animal: string;
    coordinates: { latitude: number; longitude: number }; // Adjust if you’re using a different structure
*/
    }

const Map: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getPosts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const ucfCoordinates = { latitude: 28.6024, longitude: -81.2001 }; // UCF’s approximate coordinates

    const markerIcon = new L.Icon({
        iconUrl: markerIconPng,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    return (
        <MapContainer center={ucfCoordinates} zoom={15} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {posts.map(post => (
                <Marker 
                    key={post._id} 
                    position={[post.location.latitude, post.location.longitude]} 
                    icon={markerIcon}
                >
                    <Popup>
                        <div>
                            <img src={post.photo} alt={post.description} style={{ width: "100px", height: "100px" }} />
                            <p><strong>{post.description}</strong></p>
                            <p><em>{post.animal}</em></p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;