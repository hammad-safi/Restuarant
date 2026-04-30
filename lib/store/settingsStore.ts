import { create } from 'zustand';
import { getSettings } from '@/lib/api';

interface SettingsState {
  settings: {
    logo_url: string;
    restaurant_name: string;
    hero_image_url: string;
    featured_items_count: number;
    instagram_url: string;
    facebook_url: string;
    tiktok_url: string;
    address: string;
    phone: string;
    email: string;
  };
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateLocalSettings: (newSettings: Partial<SettingsState['settings']>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    logo_url: '',
    restaurant_name: 'Zaiqa Express',
    hero_image_url: '',
    featured_items_count: 6,
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
    address: 'FL-4/15, Main Rashid Minhas Rd, Gulshan-e-Iqbal, Karachi',
    phone: '',
    email: '',
  },
  isLoading: true,
  fetchSettings: async () => {
    try {
      set({ isLoading: true });
      const result = await getSettings();
      if (result.success && result.data) {
        const settingsData = result.data as any;
        // Transform array of {key, value} to object if needed, 
        // or if it's already an object, just set it.
        // Assuming getSettings returns an object based on the API structure seen in other parts.
        set({ settings: { ...settingsData }, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ isLoading: false });
    }
  },
  updateLocalSettings: (newSettings) => 
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));
