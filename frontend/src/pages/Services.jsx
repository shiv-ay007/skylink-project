import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Headphones } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import PageTitle from '../components/PageTitle';
import EmptyState from '../components/EmptyState';
import ServiceCard from '../components/ServiceCard';

export default function Services() {
  const { slug } = useParams();
  const { site, loading } = useSite();
  const services = site?.services || [];
  const selected = slug ? services.find((service, index) => (service.slug || String(index)) === slug) : null;

  if (slug && !selected && !loading) return <EmptyState title="Service not found" description="This service may have been removed from SkyLink." />;
  if (slug && loading) return <div className="container-main py-20 text-center text-slate-500">Loading service...</div>;

  return (
    <>
      {selected ? (
        <>
          <section className="relative min-h-[370px] overflow-hidden bg-[#102b52] text-white">
            {selected.imageUrl && <img src={selected.imageUrl} alt={selected.title} className="absolute inset-0 h-full w-full object-cover"/>}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061b39]/95 via-[#061b39]/75 to-[#061b39]/25"/>
            <div className="container-main relative z-10 flex min-h-[370px] flex-col items-start justify-center py-16">
              <Link to="/services" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-blue-200 hover:text-white"><ArrowLeft size={17}/> All services</Link>
              <p className="text-xs font-bold uppercase tracking-[.23em] text-blue-200">SKYLINK LOGISTICS</p>
              <h1 className="mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">{selected.title}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">Flexible shipping support tailored to your cargo and destination.</p>
            </div>
          </section>
          <section className="bg-white py-16 md:py-20"><div className="container-main grid gap-12 lg:grid-cols-[1fr_340px]">
            <div><p className="text-xs font-extrabold tracking-[.2em] text-[#317cf5]">ABOUT THIS SERVICE</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900">How we can help</h2><p className="mt-6 whitespace-pre-line text-base leading-9 text-slate-600">{selected.description}</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/quote" state={{service:selected.title}} className="btn-blue">Request a Quote <ArrowRight size={18}/></Link><Link to="/contact" className="btn-outline">Contact our Team</Link></div></div>
            <aside className="h-fit rounded-[24px] border border-blue-100 bg-[#f5f9ff] p-7"><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#347df4] text-white"><Headphones size={23}/></span><h3 className="mt-6 text-xl font-bold text-slate-900">Let's plan your shipment</h3><p className="mt-3 text-sm leading-7 text-slate-500">Share your cargo details, departure and destination and our team will follow up.</p><div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 size={18} className="text-green-500"/> Personalised enquiry</div><Link to="/quote" state={{service:selected.title}} className="btn-blue mt-7 w-full">Get Shipping Quote <ArrowRight size={18}/></Link></aside>
          </div></section>
        </>
      ) : (
        <><PageTitle title="Our Services" subtitle="Global shipping and logistics solutions from SkyLink"/>
        <section className="bg-[#f7f9fd] py-16 md:py-20"><div className="container-main"><div className="mb-10 max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#2877f3]">EXPLORE OUR SOLUTIONS</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Moving your business forward</h2><p className="mt-4 leading-7 text-slate-500">Choose the freight solution that fits your shipping requirements.</p></div>
        {services.length ? <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{services.map((service, index) => <ServiceCard key={service._id || service.slug || index} service={service} index={index}/>)}</div> : <EmptyState title={loading ? 'Loading services...' : 'No services configured'} description="Services are managed in the admin panel." />}</div></section>
        <section className="bg-[#0c2e66] py-14 text-white"><div className="container-main flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><h2 className="text-3xl font-bold">Need help choosing a service?</h2><p className="mt-2 text-blue-200">Talk to SkyLink about your cargo requirements.</p></div><Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-[#245fc4]">Contact Our Team <ArrowRight size={18}/></Link></div></section></>
      )}
    </>
  );
}
