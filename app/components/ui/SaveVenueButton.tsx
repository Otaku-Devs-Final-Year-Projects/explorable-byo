"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function SaveVenueButton({ venueId }: { venueId: string }) {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSavedStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                const { data } = await supabase
                    .from('saved_venues')
                    .select('id')
                    .eq('user_id', session.user.id)
                    .eq('venue_id', venueId)
                    .single();

                if (data) setIsSaved(true);
            }
        };
        checkSavedStatus();
    }, [venueId]);

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent next/link navigation if wrapped in a link
        
        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            if (isSaved) {
                await supabase
                    .from('saved_venues')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('venue_id', venueId);
                setIsSaved(false);
            } else {
                await supabase
                    .from('saved_venues')
                    .insert({ user_id: user.id, venue_id: venueId });
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error toggling saved venue:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleToggleSave}
            disabled={loading}
            className={`p-2 rounded-full shadow-sm backdrop-blur-md transition-all ${isSaved ? 'bg-hotel-bronze text-white' : 'bg-white/90 text-hotel-black hover:bg-hotel-bronze hover:text-white'}`}
            aria-label="Save Venue"
        >
            <Heart size={16} fill={isSaved ? "currentColor" : "none"} className={loading ? 'animate-pulse' : ''} />
        </button>
    );
}
