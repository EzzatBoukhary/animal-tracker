import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Post = {
    _id: string;
    location: { latitude: number; longitude: number };
    photo: string;
    description: string;
    animal: string;
    postedDate: string;
    userName: string; // optional, for displaying the post creator
};

const MapPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getPosts');
                if (!response.ok) throw new Error('Failed to fetch posts');

                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const ucfCoordinates = { lat: 28.6024, lng: -81.2001 }; // Coordinates for UCF

    // Custom icon for map markers
    const customMarker = new L.Icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
        iconSize: [24, 36],
        iconAnchor: [12, 36],
    });

    return (
        <div style={{ height: '100vh' }}>
            <MapContainer center={ucfCoordinates} zoom={15} style={{ height: '50%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {posts.map(post => (
                    <Marker
                        key={post._id}
                        position={[post.location.latitude, post.location.longitude]}
                        icon={customMarker}
                    >
                        <Popup>
                            <div>
                                <img src={post.photo} alt={post.description} style={{ width: '100px', height: 'auto' }} />
                                <p><strong>Animal Type:</strong> {post.animal}</p>
                                <p><strong>Description:</strong> {post.description}</p>
                                <p><strong>Posted by:</strong> {post.userName}</p>
                                <p><strong>Date:</strong> {new Date(post.postedDate).toLocaleDateString()}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPage;