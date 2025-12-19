import { getVenueById } from '../../lib/venues';  // <--- CHANGED THIS LINE (Fixed Path)
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, CheckCircle, XCircle, Ruler, Info } from 'lucide-react';

export default async function VenuePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const venue = await getVenueById(id);

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Venue Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="relative h-[40vh] w-full bg-gray-900">
        <Image 
          src={venue.imageUrl} 
          alt={venue.name} 
          fill 
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        
        <Link 
          href="/" 
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-colors text-white"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="absolute bottom-8 left-6 right-6 text-white max-w-4xl mx-auto">
          <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-lg">
            {venue.type}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 shadow-sm">{venue.name}</h1>
          <p className="flex items-center text-gray-200 text-lg">
            <MapPin size={20} className="mr-2 text-yellow-400" /> {venue.address}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">About this Place</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{venue.description}</p>
          </section>

          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Ruler className="text-blue-600" /> Technical Specs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Door Width</p>
                <p className="text-lg font-bold text-gray-800">{venue.specs.doorWidth}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Ramp Gradient</p>
                <p className="text-lg font-bold text-gray-800">{venue.specs.rampGradient}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Flooring</p>
                <p className="text-lg font-bold text-gray-800">{venue.specs.flooring}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="md:col-span-1">
          <div className="bg-blue-50 p-6 rounded-2xl sticky top-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
              <Info className="text-blue-600" /> Features
            </h3>
            <ul className="space-y-3">
              {Object.entries(venue.features).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <span className="capitalize text-gray-700 text-sm font-medium">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {value ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-300" size={20} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
