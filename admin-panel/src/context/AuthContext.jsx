import {createContext,useContext,useEffect,useState} from 'react';import {authApi} from '../api/client';
const C=createContext(null);export const useAuth=()=>useContext(C);
export function AuthProvider({children}){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('skylink_admin_user')||'null');}catch{return null;}}),[loading,setLoading]=useState(true);
 function logout(){localStorage.removeItem('skylink_admin_token');localStorage.removeItem('skylink_admin_user');setUser(null);}
 function signIn(data){if(!['admin','employee'].includes(data.user.role))throw new Error('This account does not have admin panel access');localStorage.setItem('skylink_admin_token',data.token);localStorage.setItem('skylink_admin_user',JSON.stringify(data.user));setUser(data.user);}
 useEffect(()=>{const onLogout=()=>setUser(null);window.addEventListener('skylink-admin-logout',onLogout);if(localStorage.getItem('skylink_admin_token'))authApi.me().then(r=>{if(!['admin','employee'].includes(r.data.data.role))throw new Error('No access');setUser(r.data.data);localStorage.setItem('skylink_admin_user',JSON.stringify(r.data.data));}).catch(logout).finally(()=>setLoading(false));else setLoading(false);return()=>window.removeEventListener('skylink-admin-logout',onLogout);},[]);
 return <C.Provider value={{user,loading,logout,signIn}}>{children}</C.Provider>;
}
