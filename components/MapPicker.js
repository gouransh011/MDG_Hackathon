import { useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

export default function MapPicker({ center = { lat: 28.6139, lng: 77.2090 }, onSelect }) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY })
  const [marker, setMarker] = useState(null)

  if (!isLoaded) return <div>Loading map...</div>

  return (
    <div style={{ height: '300px' }}>
      <GoogleMap
        zoom={15}
        center={marker || center}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onClick={(e) => {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          const m = { lat, lng }
          setMarker(m)
          onSelect && onSelect(m)
        }}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  )
}
