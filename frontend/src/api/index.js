
import api from './client.js';

export const authApi={register:data=>api.post('/auth/register',data),login:data=>api.post('/auth/login',data),google:data=>api.post('/auth/google',data),me:()=>api.get('/auth/me'),update:data=>api.patch('/auth/me',data)};
export const siteApi={settings:()=>api.get('/public/settings'),track:numbers=>api.get('/public/track',{params:{numbers}}),schedules:params=>api.get('/public/schedules',{params}),ports:params=>api.get('/public/ports',{params}),news:params=>api.get('/public/news',{params}),article:slug=>api.get(`/public/news/${slug}`),quote:data=>api.post('/public/quotes',data),contact:data=>api.post('/public/messages',data),bookings:params=>api.get('/public/my-bookings',{params}),book:data=>api.post('/public/bookings',data),cancel:id=>api.patch(`/public/bookings/${id}/cancel`)};
