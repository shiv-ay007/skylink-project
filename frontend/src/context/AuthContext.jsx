import {createContext,useContext,useEffect,useState} from 'react';import {authApi} from '../api';
import {signOut} from 'firebase/auth';
import {firebaseAuth} from '../firebase/firebase';
const Context=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('skylink_customer_user')||'null');}catch{return null;}});
 const [loading,setLoading]=useState(!!localStorage.getItem('skylink_customer_token'));
 function logout(){if(firebaseAuth)void signOut(firebaseAuth).catch(()=>{});localStorage.removeItem('skylink_customer_token');localStorage.removeItem('skylink_customer_user');setUser(null);}
 function saveAuth(payload){localStorage.setItem('skylink_customer_token',payload.token);localStorage.setItem('skylink_customer_user',JSON.stringify(payload.user));setUser(payload.user);}
 useEffect(()=>{const onLogout=()=>setUser(null);window.addEventListener('skylink-logout',onLogout);if(localStorage.getItem('skylink_customer_token'))authApi.me().then(r=>{setUser(r.data.data);localStorage.setItem('skylink_customer_user',JSON.stringify(r.data.data));}).catch(()=>logout()).finally(()=>setLoading(false));else setLoading(false);return()=>window.removeEventListener('skylink-logout',onLogout);},[]);
 return <Context.Provider value={{user,loading,logout,saveAuth,setUser}}>{children}</Context.Provider>;
}
export const useAuth=()=>useContext(Context);
