import axios from 'axios';
const defaultApiUrl = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'https://skylink-project.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
  timeout: 60000
});
api.interceptors.request.use(config=>{const token=localStorage.getItem('skylink_admin_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&localStorage.getItem('skylink_admin_token')){localStorage.removeItem('skylink_admin_token');localStorage.removeItem('skylink_admin_user');window.dispatchEvent(new Event('skylink-admin-logout'));}return Promise.reject(e);});
export const getError=e=>e.response?.data?.message||e.message||'An unexpected error occurred';
export const authApi={login:payload=>api.post('/auth/login',payload),adminRegister:payload=>api.post('/auth/admin-register',payload),me:()=>api.get('/auth/me')};
export const adminApi={dashboard:()=>api.get('/admin/dashboard'),list:(resource,params)=>api.get(`/admin/${resource}`,{params}),get:(resource,id)=>api.get(`/admin/${resource}/${id}`),create:(resource,payload)=>api.post(`/admin/${resource}`,payload),update:(resource,id,payload)=>api.patch(`/admin/${resource}/${id}`,payload),remove:(resource,id)=>api.delete(`/admin/${resource}/${id}`),settings:()=>api.get('/admin/settings'),updateSettings:payload=>api.put('/admin/settings',payload),upload:file=>{const data=new FormData();data.append('image',file);return api.post('/admin/upload',data);}};
export default api;
