"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Upload, Save, Loader2, Check, AlertCircle } from 'lucide-react';

export default function EditVenuePage() {
    const params = useParams();
    const router = useRouter();
    const venueId = params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Form state — basic info
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [capacity, setCapacity] = useState(1);

    // Accessibility features
    const [features, setFeatures] = useState({
        wheelchair_accessible: false,
        accessible_bathroom: false,
        step_free_access: false,
        braille_signage: false,
        sign_language_staff: false,
        quiet_space: false,
        parking: false,
    });

    // Specs
    const [specs, setSpecs] = useState({
        door_width: '',
        ramp_gradient: '',
        flooring: '',
    });

    useEffect(() => {
        fetchVenue();
    }, [venueId]);

    const fetchVenue = async () => {
        try {
            // Auth guard — must be owner
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { router.push('/login'); return; }

            const { data, error } = await supabase
                .from('venues')
                .select(`*, venue_features (*), venue_specs (*)`)
                .eq('id', venueId)
                .eq('owner_id', session.user.id)
                .single();

            if (error || !data) {
                // Either doesn't exist or user doesn't own it
                router.push('/dashboard');
                return;
            }

            setName(data.name || '');
            setDescription(data.description || '');
            setAddress(data.address || data.location || '');
            setPrice(data.price || '');
            setImageUrl(data.image_url || '');
            setCapacity(data.capacity || 1);

            const f = Array.isArray(data.venue_features) ? data.venue_features[0] : data.venue_features;
            if (f) {
                setFeatures({
                    wheelchair_accessible: f.wheelchair_accessible || false,
                    accessible_bathroom: f.accessible_bathroom || false,
                    step_free_access: f.step_free_access || false,
                    braille_signage: f.braille_signage || false,
                    sign_language_staff: f.sign_language_staff || false,
                    quiet_space: f.quiet_space || false,
                    parking: f.parking || false,
                });
            }

            const s = Array.isArray(data.venue_specs) ? data.venue_specs[0] : data.venue_specs;
            if (s) {
                setSpecs({
                    door_width: s.door_width || '',
                    ramp_gradient: s.ramp_gradient || '',
                    flooring: s.flooring || '',
                });
            }
        } catch (err) {
            console.error(err);
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const ext = file.name.split('.').pop();
            const filePath = `venue-images/${venueId}-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('venues')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('venues')
                .getPublicUrl(filePath);

            setImageUrl(urlData.publicUrl);
        } catch (err) {
            console.error('Image upload failed:', err);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaveStatus('idle');
        try {
            // 1. Update venues table
            const { error: venueError } = await supabase
                .from('venues')
                .update({
                    name,
                    description,
                    address,
                    location: address,
                    price,
                    image_url: imageUrl,
                    capacity,
                })
                .eq('id', venueId);

            if (venueError) throw venueError;

            // 2. Upsert venue_features
            const { error: featError } = await supabase
                .from('venue_features')
                .upsert({ venue_id: venueId, ...features }, { onConflict: 'venue_id' });

            if (featError) throw featError;

            // 3. Upsert venue_specs
            const { error: specError } = await supabase
                .from('venue_specs')
                .upsert({ venue_id: venueId, ...specs }, { onConflict: 'venue_id' });

            if (specError) throw specError;

            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            console.error('Save failed:', err);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze font-serif text-xl">
            Loading Venue Editor...
        </div>
    );

    return (
        <div className="min-h-screen bg-hotel-cream font-sans text-stone-800 pb-24">
            {/* Header */}
            <header className="bg-hotel-black text-white h-20 flex items-center shadow-md sticky top-0 z-30">
                <div className="w-full px-6 flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1 className="font-serif text-xl tracking-tight hidden md:block">
                        Edit <span className="text-hotel-bronze">Venue</span>
                    </h1>
                    <div className="w-32" />
                </div>
            </header>

            <form onSubmit={handleSave} className="max-w-4xl mx-auto px-6 py-12 space-y-10">

                {/* Save status banner */}
                {saveStatus === 'success' && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-sm text-sm font-bold">
                        <Check size={18} /> Venue updated successfully!
                    </div>
                )}
                {saveStatus === 'error' && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-sm text-sm font-bold">
                        <AlertCircle size={18} /> Save failed. Please check your connection and try again.
                    </div>
                )}

                {/* Section: Basic Info */}
                <section className="bg-white p-8 shadow-sm border border-hotel-sand/50 rounded-sm">
                    <h2 className="font-serif text-2xl text-hotel-black mb-6 border-b border-hotel-sand pb-3">Basic Information</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Venue Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} required
                                className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                                className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm resize-none" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Address / Location</label>
                                <input value={address} onChange={e => setAddress(e.target.value)}
                                    className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Price / Rate Display</label>
                                <input value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. From $80/night"
                                    className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Max Concurrent Booking Slots (Capacity)</label>
                            <input type="number" min={1} value={capacity} onChange={e => setCapacity(Number(e.target.value))}
                                className="w-32 border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                        </div>
                    </div>
                </section>

                {/* Section: Image */}
                <section className="bg-white p-8 shadow-sm border border-hotel-sand/50 rounded-sm">
                    <h2 className="font-serif text-2xl text-hotel-black mb-6 border-b border-hotel-sand pb-3">Venue Image</h2>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {imageUrl && (
                            <div className="w-full md:w-48 h-36 rounded-sm overflow-hidden border border-hotel-sand shrink-0">
                                <img src={imageUrl} alt="Venue" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 space-y-3">
                            <input
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                placeholder="Paste image URL, or upload below"
                                className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm"
                            />
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                                className="flex items-center gap-2 bg-hotel-black text-white px-5 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm disabled:opacity-50">
                                {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                {uploadingImage ? 'Uploading...' : 'Upload New Image'}
                            </button>
                            <p className="text-[10px] text-gray-400">Upload to Supabase Storage, or paste a direct image URL above.</p>
                        </div>
                    </div>
                </section>

                {/* Section: Accessibility Features */}
                <section className="bg-white p-8 shadow-sm border border-hotel-sand/50 rounded-sm">
                    <h2 className="font-serif text-2xl text-hotel-black mb-6 border-b border-hotel-sand pb-3">Accessibility Features</h2>
                    <p className="text-sm text-gray-400 mb-6">Toggle on every feature that this venue genuinely offers. This information is publicly verified.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {(Object.keys(features) as (keyof typeof features)[]).map(key => (
                            <label key={key} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${features[key] ? 'border-hotel-bronze bg-hotel-bronze/5' : 'border-gray-200 hover:border-hotel-bronze/40'}`}>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${features[key] ? 'bg-hotel-bronze border-hotel-bronze' : 'border-gray-300'}`}>
                                    {features[key] && <Check size={12} className="text-white" strokeWidth={3} />}
                                </div>
                                <input type="checkbox" checked={features[key]} onChange={e => setFeatures(prev => ({ ...prev, [key]: e.target.checked }))} className="sr-only" />
                                <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Section: Technical Specs */}
                <section className="bg-white p-8 shadow-sm border border-hotel-sand/50 rounded-sm">
                    <h2 className="font-serif text-2xl text-hotel-black mb-6 border-b border-hotel-sand pb-3">Technical Specifications</h2>
                    <p className="text-sm text-gray-400 mb-6">Provide measurable details that guests with specific needs rely on before visiting.</p>
                    <div className="grid md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Door Width</label>
                            <input value={specs.door_width} onChange={e => setSpecs(prev => ({ ...prev, door_width: e.target.value }))}
                                placeholder="e.g. 900mm"
                                className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Ramp Gradient</label>
                            <input value={specs.ramp_gradient} onChange={e => setSpecs(prev => ({ ...prev, ramp_gradient: e.target.value }))}
                                placeholder="e.g. 1:12 (8.3%)"
                                className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Flooring Type</label>
                            <input value={specs.flooring} onChange={e => setSpecs(prev => ({ ...prev, flooring: e.target.value }))}
                                placeholder="e.g. Non-slip tiles"
                                className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                        </div>
                    </div>
                </section>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link href="/dashboard" className="px-8 py-4 border border-gray-300 text-gray-500 text-xs uppercase tracking-widest font-bold hover:border-hotel-black hover:text-hotel-black transition-colors rounded-sm">
                        Cancel
                    </Link>
                    <button type="submit" disabled={saving}
                        className="flex items-center gap-3 bg-hotel-black text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm disabled:opacity-50">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
