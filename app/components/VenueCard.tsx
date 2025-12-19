import { Venue } from '@/types/venue';
import { MapPin, CheckCircle, XCircle, Ruler, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <article 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full focus-within:ring-4 ring-blue-400"
      tabIndex={0} 
      aria-label={`View details for ${venue.name}`}
    >
      <div className="relative h-48 w-full bg-gray-200">
        <Image 
          src={venue.imageUrl} 
          alt={`Photo of ${venue.name}`}
          fill
          className="object-cover"
        />
        <span className="absolute top-3 right-3 bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full">
          {venue.type}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{venue.name}</h2>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin size={16} className="mr-1" />
          {venue.address}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50 p-3 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            {venue.features.wheelchairAccessible ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
            <span className="text-gray-700">Wheelchair</span>
          </div>
          <div className="flex items-center gap-2">
            {venue.features.accessibleBathroom ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
            <span className="text-gray-700">Toilet</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
          {venue.description}
        </p>

        <Link 
          href={`/venue/${venue.id}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Info size={18} />
          View Full Access Details
        </Link>
      </div>
    </article>
  );
}
