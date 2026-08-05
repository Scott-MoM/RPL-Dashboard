/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly VITE_BEACON_API_KEY?: string;
  readonly VITE_BEACON_ACCOUNT_ID?: string;
  readonly VITE_BEACON_BASE_URL?: string;
  readonly VITE_BEACON_EVENT_ATTENDEES_ENDPOINT?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_OPENROUTESERVICE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
