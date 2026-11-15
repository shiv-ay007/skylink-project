import {createContext,useContext,useEffect,useState} from 'react';import {siteApi} from '../api';
const Context=createContext(null);
export function SiteProvider({children}){
 const [site,setSite]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const reload=()=>siteApi.settings().then(r=>{setSite(r.data.data);setError('');}).catch(e=>setError(e.response?.data?.message||'Unable to load website settings')).finally(()=>setLoading(false));
 useEffect(()=>{reload();},[]);return <Context.Provider value={{site,loading,error,reload}}>{children}</Context.Provider>;
}
export const useSite=()=>useContext(Context);
