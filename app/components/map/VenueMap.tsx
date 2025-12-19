"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// --- 1. CREATE CUSTOM "LUXURY" MARKER ---
// We render a Lucide React Icon into an HTML string to use as a Leaflet Marker
const createCustomIcon = () => {
  const iconHtml = renderToStaticMarkup(
    <div className="relative flex items-center justify-center w-10 h-10">
      <div className="absolute inset-0 bg-hotel-bronze opacity-20 rounded-full animate-ping"></div>
      <div className="relative z-10 w-8 h-8 bg-hotel-black border-2 border-white shadow-xl rounded-full flex items-center justify-center text-white">
        <MapPin size={16} />
      </div>
      <div className="absolute -bottom-1 w-2 h-2 bg-hotel-black rotate-45"></div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-icon', // We will add a tiny CSS fix for this
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Center bottom tip
    popupAnchor: [0, -40]
  });
};

const customIcon = createCustomIcon();

export default function VenueMap({ venues }: { venues: any[] }) {
  // Center roughly on Bulawayo
  const position: [number, number] = [-20.1569, 28.5802]; 

  return (
    <div className="h-[600px] w-full rounded-sm overflow-hidden border border-hotel-sand/30 shadow-2xl relative z-0">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={true} // ENABLE ZOOM SCROLLING (Google Maps feel)
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* 2. HIGH QUALITY TILES (CartoDB Voyager) - Free & Beautiful */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {venues.map((venue) => (
          venue.lat && venue.lng ? (
            <Marker 
              key={venue.id} 
              position={[venue.lat, venue.lng]} 
              icon={customIcon}
            >
              <Popup className="custom-popup">
                <div className="font-sans min-w-[200px] p-1">
                  <div className="relative h-24 w-full mb-3 rounded-sm overflow-hidden bg-gray-100">
                    <img src={venue.image} className="object-cover w-full h-full" alt={venue.name} />
                  </div>
                  <h3 className="font-serif font-bold text-hotel-black text-lg leading-tight mb-1">{venue.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <MapPin size={10} /> {venue.location}
                  </p>
                  <Link 
                    href={`/explore/${venue.id}`} 
                    className="block w-full text-center bg-hotel-bronze text-white text-[10px] font-bold uppercase tracking-widest py-2 hover:bg-hotel-black transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
      
      {/* 3. Global Styles for the Leaflet Marker to remove default square box */}
      <style jsx global>{`
        .custom-marker-icon {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 2px;
          overflow: hidden;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
      `}</style>
    </div>
  );
}
