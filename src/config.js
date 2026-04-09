// In development: set VITE_API_URL in .env (cravebetter/.env)
// In production on Render: add VITE_API_URL in Render dashboard → Environment
export const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api`;
