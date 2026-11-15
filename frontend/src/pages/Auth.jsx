import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ArrowRight, LockKeyhole, ShieldCheck, Ship } from 'lucide-react';
import { authApi } from '../api';
import { errorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { firebaseAuth, firebaseEnabled, googleProvider } from '../firebase/firebase';
import FormField from '../components/FormField';

export default function Auth({ mode = 'login' }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [busy, setBusy] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const register = mode === 'register';

  const onSuccess = (payload, message) => {
    saveAuth(payload);
    toast.success(message);
    navigate(location.state?.from || '/account', { replace: true });
  };

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await (register ? authApi.register(form) : authApi.login({ email: form.email, password: form.password }));
      onSuccess(response.data, register ? 'Your account has been created' : 'Logged in successfully');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function googleLogin() {
    if (!firebaseAuth) return toast.error('Configure Firebase in frontend/.env first.');
    setBusy(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await authApi.google({ idToken });
      onSuccess(response.data, 'Signed in with Google');
    } catch (error) {
      await signOut(firebaseAuth).catch(() => {});
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') return;
      toast.error(error?.code === 'auth/unauthorized-domain' ? 'Add this website domain to Firebase authorized domains.' : errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[660px] bg-[#f6f8fc] py-12 md:py-20">
      <div className="container-main grid max-w-[1160px] overflow-hidden rounded-[26px] bg-white shadow-[0_20px_70px_-30px_rgba(10,40,90,.35)] lg:grid-cols-[.9fr_1fr] lg:p-0">
        <div className="relative hidden min-h-[640px] overflow-hidden bg-[#103774] p-12 text-white lg:flex lg:flex-col lg:justify-between" style={{backgroundImage:"linear-gradient(180deg,rgba(8,34,80,.52),rgba(4,29,70,.95)),url('/hero-port.png')",backgroundPosition:'center',backgroundSize:'cover'}}>
          <div><span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest"><Ship size={17}/> SkyLink Logistics</span></div>
          <div><h2 className="text-4xl font-extrabold leading-tight">Your cargo journey starts here.</h2><p className="mt-5 max-w-sm text-sm leading-8 text-blue-100">Sign in to manage your bookings, track your shipping requests and connect with SkyLink.</p><div className="mt-8 flex items-center gap-2 text-sm text-blue-100"><ShieldCheck size={19}/> Secure customer account</div></div>
        </div>
        <div className="px-6 py-10 sm:px-12 md:py-14 lg:px-14">
          <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2975ec]"><LockKeyhole size={24}/></span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{register ? 'Create Your Account' : 'Welcome Back'}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{register ? 'Join SkyLink to request and manage your shipments.' : 'Sign in to access your SkyLink account.'}</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {register && <><FormField label="Full Name" name="name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required/><div className="grid gap-4 sm:grid-cols-2"><FormField label="Company" name="company" value={form.company} onChange={e => setForm({...form,company:e.target.value})}/><FormField label="Phone" name="phone" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}/></div></>}
            <FormField label="Email Address" name="email" type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
            <FormField label="Password" name="password" type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})}/>
            <button className="btn-blue w-full py-3.5" disabled={busy}>{busy ? 'Please wait...' : register ? 'Create Account' : 'Login to Account'}<ArrowRight size={18}/></button>
          </form>
          <div className="my-7 flex items-center gap-4"><div className="h-px flex-1 bg-slate-200"/><span className="text-xs font-semibold uppercase tracking-widest text-slate-400">or continue with</span><div className="h-px flex-1 bg-slate-200"/></div>
          <button type="button" onClick={googleLogin} disabled={busy || !firebaseEnabled} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:border-[#a4bff5] hover:bg-blue-50 disabled:opacity-50">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.35 12.26c0-.73-.06-1.4-.2-2.05H12v3.88h5.24a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.83-1.69 2.91-4.18 2.91-7.19Z"/><path fill="#34A853" d="M12 21.75c2.62 0 4.81-.87 6.41-2.3l-3.14-2.43c-.87.58-1.98.93-3.27.93-2.53 0-4.67-1.71-5.44-4.01H3.32v2.51A9.75 9.75 0 0 0 12 21.75Z"/><path fill="#FBBC05" d="M6.56 13.94A5.9 5.9 0 0 1 6.25 12c0-.67.11-1.32.31-1.94V7.55H3.32A9.75 9.75 0 0 0 2.25 12c0 1.58.38 3.07 1.07 4.45l3.24-2.51Z"/><path fill="#EA4335" d="M12 6.05c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.14 14.62 2.25 12 2.25a9.75 9.75 0 0 0-8.68 5.3l3.24 2.51C7.33 7.76 9.47 6.05 12 6.05Z"/></svg>
            Continue with Google
          </button>
          {!firebaseEnabled && <p className="mt-3 text-center text-xs leading-5 text-amber-700">Google sign-in will be enabled after Firebase configuration is added to the frontend.</p>}
          <p className="mt-8 text-center text-sm text-slate-600">{register ? 'Already have an account?' : 'New to SkyLink?'} <Link to={register ? '/login' : '/register'} className="font-bold text-[#317cf5] hover:underline">{register ? 'Login' : 'Create an account'}</Link></p>
        </div>
      </div>
    </section>
  );
}
