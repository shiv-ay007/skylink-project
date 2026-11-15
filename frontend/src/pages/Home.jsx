import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CalendarDays, Building2, FileText, ArrowRight, ShieldCheck, Globe2, Headphones, Ship } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSite } from '../context/SiteContext';
import ServiceCard from '../components/ServiceCard';

const tabs = [['Tracking', MapPin], ['Schedule', CalendarDays], ['Offices', Building2], ['ONE QUOTE', FileText]];

export default function Home() {
  const { site, loading, error } = useSite();
  const [tab, setTab] = useState('Tracking');
  const [numbers, setNumbers] = useState('');
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    if (tab === 'Tracking') {
      if (!numbers.trim()) return toast.error('Enter a tracking number');
      navigate(`/tracking?numbers=${encodeURIComponent(numbers.trim())}`);
    } else {
      navigate(tab === 'Schedule' ? '/schedule' : tab === 'Offices' ? '/offices' : '/quote');
    }
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-[#1c324d]"
        style={{ backgroundImage: `linear-gradient(90deg,rgba(9,28,55,.73),rgba(9,28,55,.10)),url('${site?.heroImage || '/hero-port.png'}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container-main grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(360px,560px)]">
          <div className="relative z-10 text-white">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.15em] backdrop-blur"><Ship size={16}/> Global Freight & Logistics</span>
            <h1 className="max-w-[720px] text-5xl font-extrabold leading-[1.1] tracking-tight drop-shadow-xl md:text-6xl lg:text-[64px]">{site?.heroTitle || (loading ? '' : 'SkyLink Logistics')}</h1>
            {site?.heroSubtitle && <p className="mt-7 max-w-xl text-base leading-8 text-white/90 drop-shadow sm:text-lg">{site.heroSubtitle}</p>}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/quote" className="inline-flex items-center gap-2 rounded-xl bg-[#347df4] px-7 py-4 font-bold text-white shadow-lg shadow-blue-950/20 transition-all hover:-translate-y-1 hover:bg-blue-600">Request a Quote <ArrowRight size={19}/></Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition-all hover:-translate-y-1 hover:bg-white hover:text-blue-800">Our Services <ArrowRight size={19}/></Link>
            </div>
          </div>
          <div className="relative z-10 overflow-hidden rounded-[24px] bg-white shadow-[0_28px_72px_-18px_rgba(0,0,0,.45)]">
            <div className="grid grid-cols-4 border-b border-slate-100">
              {tabs.map(([name, Icon]) => <button key={name} type="button" onClick={() => setTab(name)} className={`flex min-h-24 flex-col items-center justify-center gap-2 border-b-[3px] px-1 py-5 text-xs transition-colors sm:text-sm ${tab === name ? 'border-[#317cf5] bg-[#f3f7ff] font-semibold text-[#317cf5]' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#317cf5]'}`}><Icon size={23}/><span>{name}</span></button>)}
            </div>
            <form onSubmit={submit} className="p-7 md:p-9">
              <label className="mb-3 block text-sm font-semibold text-slate-800">{tab === 'Tracking' ? 'BL, Booking, Container, or Purchase Order No. *' : `Explore ${tab}`}</label>
              {tab === 'Tracking' ? <><input className="input-field text-base" placeholder="Enter a tracking number" value={numbers} onChange={e => setNumbers(e.target.value)} /><p className="mb-7 mt-3 text-sm leading-6 text-slate-400">Separate multiple tracking numbers with a space or comma.</p></> : <p className="mb-7 text-sm leading-6 text-slate-500">Continue to {tab.toLowerCase()} to {tab === 'ONE QUOTE' ? 'request your customized shipping quote' : 'find the latest information'}.</p>}
              <button className="btn-blue w-full py-4 text-base">{tab === 'Tracking' ? 'Track Shipment' : `Open ${tab}`}<ArrowRight size={19}/></button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-8">
        <div className="container-main grid gap-6 md:grid-cols-3">
          {[[Globe2, 'Worldwide Connections', 'Ocean freight and global trade support'], [ShieldCheck, 'Shipment Visibility', 'Track your cargo through our platform'], [Headphones, 'Dedicated Assistance', 'Connect directly with the SkyLink team']].map(([Icon,title,desc]) => <div key={title} className="flex items-center gap-4 rounded-2xl px-3 py-2"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 p-3 text-[#2877f3]"><Icon size={26}/></span><div><p className="font-bold text-slate-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p></div></div>)}
        </div>
      </section>

      <section className="bg-[#f7f9fd] py-20 md:py-24">
        <div className="container-main">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#347df4]">WHAT WE OFFER</p><h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-[42px]">Our Logistics Services</h2><p className="mt-4 text-base leading-7 text-slate-500">Explore our freight and logistics solutions, designed to keep cargo moving with confidence.</p></div>
            <Link to="/services" className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#c7d9fb] bg-white px-5 py-3 text-sm font-bold text-[#286ddd] transition-all hover:border-[#2877f3] hover:bg-[#eff6ff]">View All Services <ArrowRight size={18}/></Link>
          </div>
          {site?.services?.length ? (
            <div className="grid items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3">
              {site.services.map((service, index) => <ServiceCard key={service._id || service.slug || index} service={service} index={index}/>) }
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-slate-500">{loading ? 'Loading services...' : error ? 'Unable to load services right now.' : 'Services will appear once added in the admin panel.'}</div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#0c2e66] to-[#2775f2] py-16 text-white">
        <div className="container-main flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-widest text-blue-200">YOUR NEXT SHIPMENT</p><h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Ready to move cargo with SkyLink?</h2><p className="mt-3 leading-7 text-blue-100">Tell us where your shipment needs to go. Our team can help you plan the next step.</p></div>
          <div className="flex flex-wrap gap-3"><Link to="/quote" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-[#246be2] transition-transform hover:-translate-y-1">Get a Free Quote <ArrowRight size={18}/></Link><Link to="/bookings/new" className="inline-flex items-center gap-2 rounded-xl border border-white/60 px-6 py-4 font-bold text-white transition-colors hover:bg-white/10">Book Shipment</Link></div>
        </div>
      </section>
    </>
  );
}
