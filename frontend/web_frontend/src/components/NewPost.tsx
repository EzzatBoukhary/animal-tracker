import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPopup from './MapPopup'; // Import the MapPopup component
import './NewPost.css';

const NewPost: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [animal, setAnimal] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showMapPopup, setShowMapPopup] = useState(false); // State to control the popup visibility
  const navigate = useNavigate();

  useEffect(() => {
    validateForm();
  }, [photo, description, animal, location]);

  const validateForm = () => {
    if (photo && description.length > 0 && animal && location) {
      setIsFormValid(true);
      setFormError('');
    } else {
      setIsFormValid(false);
      setFormError('All fields must be filled before creating a post.');
    }
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setMessage('Location retrieved successfully');
          setFormError('');
        },
        (error) => {
          console.error('Error getting location:', error);
          setMessage('Error getting location');
          setError('Error getting location');
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setMessage('Geolocation is not supported by this browser');
      setError('Geolocation is not supported by this browser');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    const maxSize = 100 * 1024; // 100KB
    const maxHeight = 2000;
    const maxWidth = 2000;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const aspectRatio = img.width / img.height;
          if (img.width > img.height) {
            canvas.width = maxWidth;
            canvas.height = maxWidth / aspectRatio;
          } else {
            canvas.height = maxHeight;
            canvas.width = maxHeight * aspectRatio;
          }

          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          let quality = 0.7;
          let resizedDataUrl = canvas.toDataURL('image/jpeg', quality);

          while (resizedDataUrl.length > maxSize && quality > 0.1) {
            quality -= 0.1;
            resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          if (resizedDataUrl.length > maxSize) {
            setError('Image cannot be compressed to under 100KB.');
          } else {
            setPhoto(resizedDataUrl);
            setError('');
          }
        };

        img.onerror = () => {
          setError('Invalid image file.');
        };
      };

      reader.onerror = () => {
        setError('Failed to read file.');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!photo || !location || !description || !animal) {
      setFormError('All fields must be filled before creating a post.');
      return;
    }

    console.log('Creating post with the following data:', {
      photo,
      location,
      description,
      animal,
    });

    const userData = localStorage.getItem('user_data');
    const userId = userData ? JSON.parse(userData).id : '';

    try {
      const response = await fetch('http://localhost:5000/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          location,
          photo,
          description,
          animal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();
      console.log('Post created:', result);
      setMessage('Post Created');
      navigate('/home');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 150) {
      setDescription(e.target.value);
    }
  };

  const handleCaptureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      video.addEventListener('canplay', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPhoto(dataUrl);
        video.pause();
        stream.getTracks().forEach((track) => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Error accessing camera');
    }
  };

  const openMapPopup = () => {
    setShowMapPopup(true);
  };

  const closeMapPopup = () => {
    setShowMapPopup(false);
  };

  const handleSelectLocation = (location: { latitude: number; longitude: number }) => {
    setLocation(location);
    setMessage('Location selected from map');
  };

  return (
    <div className="new-post-container">
      <div className="photo-box">
        {photo ? (
          <div className="photo-preview">
            <img src={photo} alt="Preview" />
          </div>
        ) : (
          <div className="photo-placeholder">
            <span>Image Preview</span>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <div className="upload-capture-box">
          <div className="upload-capture-container">
            <div className="upload-section">
              <input type="file" accept="image/*" onChange={handleFileChange} id="file-input" />
              <label className="file-label" htmlFor="file-input"></label>
              <div className="upload-text">Upload Image</div>
            </div>
            <div className="capture-section">
              <button className="file-label camera" onClick={handleCaptureImage}></button>
              <div className="capture-text">Capture Image</div>
            </div>
          </div>
        </div>
      </div>
      <div className="details-box">
        <select
          className="animal-select"
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
        >
          <option value="">Select Animal</option>
          <option value="Cat">Cat</option>
          <option value="Deer">Deer</option>
          <option value="Raccoon">Raccoon</option>
          <option value="Squirrel">Squirrel</option>
          <option value="Bird">Bird</option>
          <option value="Reptile">Reptile</option>
          <option value="Fish">Fish</option>
          <option value="Bug">Bug</option>
          <option value="Other">Other</option>
        </select>
        <div className="description-wrapper">
          <textarea
            className="description-input"
            placeholder="Animal Description..."
            value={description}
            onChange={handleDescriptionChange}
            rows={5}
          />
          <div className="character-count">{description.length}/150</div>
        </div>
        <div className="location-message">
          <span>{message}</span>
        </div>
        <div className="location-button-container">
          <button className="location-button" onClick={getLocation}>Use My Location</button>
          <button className="location-button" onClick={openMapPopup}>Select From Map</button>
        </div>
        <div className="button-container">
          <button onClick={handleCreatePost} disabled={!isFormValid}>Create Post</button>
        </div>
        {!isFormValid && <div className="form-error-message">{formError}</div>}
      </div>
      {showMapPopup && <MapPopup onClose={closeMapPopup} onSelectLocation={handleSelectLocation} />}
    </div>
  );
};

export default NewPost;

