import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPopup.css';

interface MapPopupProps {
  onClose: () => void;
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
}

const MapPopup: React.FC<MapPopupProps> = ({ onClose, onSelectLocation }) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.invalidateSize();
    }
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onSelectLocation({ latitude: lat, longitude: lng });
        onClose();
      },
    });
    return null;
  };

  return (
    <div className="map-popup-overlay">
      <div className="map-popup-content">
        <MapContainer
          center={[28.6024, -81.2001]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MapPopup;
