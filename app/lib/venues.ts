import { supabase } from './supabase';
import { Venue } from '@/types/venue';

const formatVenue = (v: any): Venue => ({
  id: v.id,
  name: v.name,
  type: v.type,
  description: v.description,
  address: v.address,
  imageUrl: v.image_url,
  rating: v.rating,
  features: {
    wheelchairAccessible: v.venue_features?.wheelchair_accessible || false,
    accessibleBathroom: v.venue_features?.accessible_bathroom || false,
    stepFreeAccess: v.venue_features?.step_free_access || false,
    brailleSignage: v.venue_features?.braille_signage || false,
    signLanguageStaff: v.venue_features?.sign_language_staff || false,
    quietSpace: v.venue_features?.quiet_space || false,
    parking: v.venue_features?.parking || false,
  },
  specs: {
    doorWidth: v.venue_specs?.door_width || 'N/A',
    rampGradient: v.venue_specs?.ramp_gradient || 'N/A',
    flooring: v.venue_specs?.flooring || 'N/A',
  },
});

export async function getVenues(): Promise<Venue[]> {
  const { data, error } = await supabase
    .from('venues')
    .select(`*, venue_features (*), venue_specs (*)`);

  if (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
  return data.map(formatVenue);
}

export async function getVenueById(id: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from('venues')
    .select(`*, venue_features (*), venue_specs (*)`)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching venue ${id}:`, error);
    return null;
  }
  return formatVenue(data);
}
