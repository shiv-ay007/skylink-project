import axios from 'axios';
const client=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',timeout:20000});
client.interceptors.request.use(config=>{const token=localStorage.getItem('skylink_customer_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
client.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&localStorage.getItem('skylink_customer_token')){localStorage.removeItem('skylink_customer_token');localStorage.removeItem('skylink_customer_user');window.dispatchEvent(new Event('skylink-logout'));}return Promise.reject(e);});
export const errorMessage=e=>e.response?.data?.message||e.message||'Something went wrong';
export default client;
