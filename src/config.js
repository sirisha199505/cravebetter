// In development: VITE_API_URL is not set, so API calls go to /api (proxied by Vite to localhost:9292)
// In production on Render: VITE_API_URL = https://your-backend.onrender.com
export const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api`;
