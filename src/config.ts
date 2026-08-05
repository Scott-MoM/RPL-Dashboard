// Centralised Environment & Integration Config
// In React / Vite, public environment variables must be prefixed with VITE_

export const CONFIG = {
  beacon: {
    apiKey: import.meta.env.VITE_BEACON_API_KEY || '',
    accountId: import.meta.env.VITE_BEACON_ACCOUNT_ID || '',
    baseUrl: import.meta.env.VITE_BEACON_BASE_URL || 'https://api.beaconcrm.org/v1/account/{account_id}',
    eventAttendeesEndpoint: import.meta.env.VITE_BEACON_EVENT_ATTENDEES_ENDPOINT || 'event_attendee',
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  openRouteService: {
    apiKey: import.meta.env.VITE_OPENROUTESERVICE_API_KEY || '',
  },
};

export const getBeaconApiUrl = () => {
  const accountId = CONFIG.beacon.accountId || 'demo_account';
  return CONFIG.beacon.baseUrl.replace('{account_id}', accountId);
};
