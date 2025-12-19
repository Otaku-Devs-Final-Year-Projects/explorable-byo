export type VenueType = 'Hotel' | 'Museum' | 'Restaurant' | 'Park' | 'Transport';

export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  accessibleBathroom: boolean;
  stepFreeAccess: boolean;
  brailleSignage: boolean;
  signLanguageStaff: boolean;
  quietSpace: boolean;
  parking: boolean;
}

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  description: string;
  address: string;
  imageUrl: string;
  rating: number;
  features: AccessibilityFeatures;
  specs: {
    doorWidth: string;
    rampGradient: string;
    flooring: string;
  };
}
