import { Link } from 'react-router-dom';
import { ArrowRight, Ship, Snowflake, PackageCheck, Warehouse, Truck } from 'lucide-react';

const icons = [
  [/ocean|freight|ship|sea/i, Ship],
  [/reefer|cold|refrig/i, Snowflake],
  [/special|cargo|heavy/i, PackageCheck],
  [/warehous|storage/i, Warehouse],
  [/logistic|transport|road/i, Truck],
];

export default function ServiceCard({ service, index = 0 }) {
  const Icon = icons.find(([pattern]) => pattern.test(`${service.title || ''} ${service.slug || ''}`))?.[1] || Ship;
  const detailUrl = `/services/${encodeURIComponent(service.slug || String(index))}`;

  return (
    <article className="service-card group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200/70 bg-white shadow-[0_12px_38px_-20px_rgba(15,38,83,.2)]">
      <Link to={detailUrl} className="relative block h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200 sm:h-60" aria-label={`Explore ${service.title}`}>
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={`${service.title} logistics service`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        ) : (
          <div className="flex h-full items-center justify-center text-blue-300"><Icon size={78} strokeWidth={1} /></div>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-[#071a37]/65 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#1f64df] shadow-sm backdrop-blur">
          <Icon size={15} /> Global logistics
        </span>
        <span className="absolute bottom-4 right-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-[#2877f3] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowRight size={20}/></span>
      </Link>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
        <h3 className="text-[21px] font-bold tracking-tight text-slate-900 transition-colors group-hover:text-[#2775ef]">{service.title}</h3>
        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">{service.description}</p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <Link to={detailUrl} className="inline-flex items-center gap-2 text-sm font-bold text-[#2877f3] transition-all group-hover:gap-3">Explore Service <ArrowRight size={17}/></Link>
          <Link to="/quote" state={{ service: service.title }} className="rounded-full bg-[#eff6ff] px-3 py-2 text-xs font-semibold text-[#276bda] transition-colors hover:bg-[#2877f3] hover:text-white">Get a Quote</Link>
        </div>
      </div>
    </article>
  );
}
