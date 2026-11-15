import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowRight, CalendarDays, CircleHelp, ClipboardList, LogOut, Mail, Save, ShieldCheck, Ship, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi, siteApi } from '../api';
import { errorMessage } from '../api/client';
import FormField from '../components/FormField';

export default function Account() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', company: user?.company || '' });
  const [busy, setBusy] = useState(false);
  const [bookingCount, setBookingCount] = useState(null);
  const initials = (user?.name || 'S').split(' ').filter(Boolean).slice(0, 2).map(s => s[0].toUpperCase()).join('');

  useEffect(() => {
    setForm({ name: user?.name || '', phone: user?.phone || '', company: user?.company || '' });
  }, [user?.name, user?.phone, user?.company]);

  useEffect(() => {
    let cancelled = false;
    siteApi.bookings({ page: 1, limit: 1 }).then(({ data }) => {
      if (!cancelled) setBookingCount(data.pagination?.total ?? null);
    }).catch(() => { if (!cancelled) setBookingCount(null); });
    return () => { cancelled = true; };
  }, []);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await authApi.update(form);
      setUser(response.data.data);
      localStorage.setItem('skylink_customer_user', JSON.stringify(response.data.data));
      toast.success(response.data.message || 'Profile updated');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    logout();
    toast.info('You have been logged out');
    navigate('/', { replace: true });
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0b2857] via-[#154886] to-[#347df4] py-14 text-white md:py-20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10"/>
        <div className="pointer-events-none absolute -right-0 top-16 h-80 w-80 rounded-full border border-white/10"/>
        <div className="container-main relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-2xl font-bold shadow-lg backdrop-blur md:h-20 md:w-20">{initials}</div>
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200">CUSTOMER ACCOUNT</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-[42px]">Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!</h1><p className="mt-3 text-sm text-blue-100 md:text-base">Manage your account and keep your shipping plans moving.</p></div>
          </div>
          <Link to="/bookings/new" className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-[#286cdb] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">Create Booking <ArrowRight size={18}/></Link>
        </div>
      </section>

      <section className="bg-[#f6f8fc] py-10 md:py-14">
        <div className="container-main">
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><span className="rounded-xl bg-blue-50 p-3 text-[#347df4]"><ClipboardList size={25}/></span><div><p className="text-2xl font-extrabold text-slate-900">{bookingCount === null ? '—' : bookingCount}</p><p className="text-xs font-semibold text-slate-500">My Bookings</p></div></div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><span className="rounded-xl bg-cyan-50 p-3 text-cyan-600"><ShieldCheck size={25}/></span><div><p className="text-base font-bold capitalize text-slate-900">{user?.role || '—'}</p><p className="mt-1 text-xs font-semibold text-slate-500">Account Role</p></div></div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><span className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><Mail size={25}/></span><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{user?.email}</p><p className="mt-1 text-xs font-semibold text-slate-500">Registered Email</p></div></div>
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-[285px_minmax(0,1fr)]">
            <aside className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="border-b border-slate-100 px-3 pb-5"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">MY SPACE</p><h2 className="mt-2 text-lg font-extrabold text-slate-800">Account Menu</h2></div>
              <div className="mt-4 space-y-1">
                <span className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-[#2a71dc]"><UserRound size={19}/> Personal Information</span>
                <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2a71dc]" to="/my-bookings"><ClipboardList size={19}/> My Bookings</Link>
                <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2a71dc]" to="/bookings/new"><Ship size={19}/> New Booking</Link>
                <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2a71dc]" to="/tracking"><CalendarDays size={19}/> Track a Shipment</Link>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4"><button type="button" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50" onClick={signOut}><LogOut size={19}/> Logout</button></div>
            </aside>

            <div className="space-y-7">
              <form onSubmit={save} className="overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-6 md:px-8"><span className="rounded-xl bg-blue-50 p-3 text-[#347df4]"><UserRound size={22}/></span><div><h2 className="text-xl font-extrabold text-slate-900">Personal Information</h2><p className="mt-1 text-sm text-slate-500">Keep your contact details up to date.</p></div></div>
                <div className="grid gap-6 px-6 py-7 md:grid-cols-2 md:px-8">
                  <div className="md:col-span-2"><FormField label="Full Name" value={form.name} required onChange={e => setForm(f => ({...f, name:e.target.value}))}/></div>
                  <div className="md:col-span-2"><FormField label="Email Address" value={user?.email || ''} disabled/></div>
                  <div><FormField label="Phone Number" value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))}/></div>
                  <div><FormField label="Company" value={form.company} onChange={e => setForm(f => ({...f, company:e.target.value}))}/></div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/65 px-6 py-5 md:px-8"><p className="text-xs text-slate-400">Your email address is linked to your account.</p><button className="btn-blue" disabled={busy}><Save size={17}/>{busy ? 'Saving...' : 'Save Changes'}</button></div>
              </form>
              <div className="grid gap-5 md:grid-cols-2">
                <Link to="/my-bookings" className="group flex items-start justify-between rounded-[22px] border border-blue-100 bg-[#eff6ff] p-6 transition-shadow hover:shadow-lg"><div><ClipboardList className="text-[#2877f3]" size={26}/><h3 className="mt-4 font-bold text-slate-900">Shipment Bookings</h3><p className="mt-2 max-w-[230px] text-sm leading-6 text-slate-500">View your requests and booking updates.</p></div><ArrowRight className="text-[#347df4] transition-transform group-hover:translate-x-1" size={21}/></Link>
                <Link to="/contact" className="group flex items-start justify-between rounded-[22px] border border-slate-100 bg-white p-6 transition-shadow hover:shadow-lg"><div><CircleHelp className="text-[#2877f3]" size={26}/><h3 className="mt-4 font-bold text-slate-900">Need Assistance?</h3><p className="mt-2 max-w-[230px] text-sm leading-6 text-slate-500">Get help from the SkyLink support team.</p></div><ArrowRight className="text-[#347df4] transition-transform group-hover:translate-x-1" size={21}/></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
