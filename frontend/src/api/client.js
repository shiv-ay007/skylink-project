import axios from 'axios';
const defaultApiUrl = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'https://skylink-project.onrender.com/api'
  : 'http://localhost:5000/api';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
  timeout: 60000
});
client.interceptors.request.use(config=>{const token=localStorage.getItem('skylink_customer_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
client.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&localStorage.getItem('skylink_customer_token')){localStorage.removeItem('skylink_customer_token');localStorage.removeItem('skylink_customer_user');window.dispatchEvent(new Event('skylink-logout'));}return Promise.reject(e);});
export const errorMessage=e=>e.response?.data?.message||e.message||'Something went wrong';
export default client;
