import React, { useState } from 'react';
//import CameraComponent from './Camera';

const NewPost: React.FC = () => {
    const [photo, setPhoto] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [animal, setAnimal] = useState('');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [message,setMessage] = useState('');

    const getLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => console.error('Error getting location:', error),
                { enableHighAccuracy: true }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setMessage('Geolocation is not supported by this browser');
        }
    };

    /*const handleCapturePhoto = async (capturedPhoto: string) => {
        setPhoto(capturedPhoto);
        await getLocation(); 
    };*/

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string); // Save the image as base64 string
            };
            await getLocation();
            reader.readAsDataURL(file); // Convert the file to base64
        }
    };

    const handleCreatePost = async () => {
        if (!photo || !location) {
            console.log('Photo or location not available');
            setMessage('Photo or location not available');
            return;
        }

        var _ud = localStorage.getItem('user_data');
        var ud = JSON.parse(_ud);
        var userId = ud.id;

        const response = await fetch('http://localhost:5000/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId, 
                location,
                photo,
                description,
                animal
            })
        });

        const result = await response.json();
        console.log('Post created:', result);
        setMessage('Post Created');
    };

    function returnHome( e: any ) : void
    {
        window.location.href = '/home';
    }

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="Animal"
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
            />
            <button onClick={handleCreatePost}>Create Post</button>
            <button onClick={returnHome}>Return Home</button>
            <span id="loginResult">{message}</span>

        </div>
    );
};

export default NewPost;