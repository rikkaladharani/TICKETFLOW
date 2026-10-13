
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ticketflow-production-06d2.up.railway.app/api';

export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');
