import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Location = {
  latitude: number
  longitude: number
}

interface MapViewProps {
  location: Location
}

// This is used to show a specific location marker on a map. Used in PostModal
const MapView: React.FC<MapViewProps> = ({ location }) => {
  const customMarker = new L.Icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
  })

  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      <Marker position={[location.latitude, location.longitude]} icon={customMarker}>
        <Popup>
          Spotted here
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default MapView
