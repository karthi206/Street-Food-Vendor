import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

interface VendorMapProps {
  coordinates: [number, number];
  vendorName: string;
  queueLength?: number;
}

export default function VendorMap({ coordinates, vendorName, queueLength }: VendorMapProps) {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border mt-4">
      <MapContainer center={coordinates} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <strong>{vendorName}</strong><br />
            {queueLength ? `People in Queue: ${queueLength}` : 'No live queue'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}