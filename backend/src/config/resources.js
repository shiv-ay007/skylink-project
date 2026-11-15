import Shipment from '../models/Shipment.js';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Port from '../models/Port.js';
import Vessel from '../models/Vessel.js';
import Vehicle from '../models/Vehicle.js';
import News from '../models/News.js';
import Service from '../models/Service.js';
import Office from '../models/Office.js';
import Quote from '../models/Quote.js';
import Contact from '../models/Contact.js';
// Explicit allowlists prevent arbitrary collection / field modification.
export const resources = {
  shipments: { model: Shipment, search: ['trackingNo','containerNo','blNo','origin','destination','bookingNo'], fields: ['trackingNo','containerNo','blNo','purchaseOrderNo','bookingNo','customer','origin','destination','vessel','etd','eta','status','description'], filters: ['status'] },
  bookings: { model: Booking, search: ['bookingNo','customerName','email','origin','destination'], fields: ['bookingNo','customer','customerName','email','origin','destination','cargoType','containerType','cargoWeight','preferredDate','notes','status'], filters: ['status'] },
  schedules: { model: Schedule, search: ['vessel','voyage','origin','destination'], fields: ['vessel','voyage','origin','destination','departure','arrival','status'], filters: ['status'] },
  ports: { model: Port, search: ['name','code','country','region'], fields: ['name','code','country','region'], filters: ['country'] },
  vessels: { model: Vessel, search: ['name','imo','flag'], fields: ['name','imo','flag','capacity','status'], filters: ['status'] },
  vehicles: { model: Vehicle, search: ['registrationNo','driverName','type'], fields: ['registrationNo','driverName','driverPhone','type','location','status'], filters: ['status'] },
  news: { model: News, search: ['title','category','slug'], fields: ['title','slug','category','summary','content','imageUrl','status','publishedAt'], filters: ['status'] },
  services: { model: Service, search: ['title','slug'], fields: ['title','slug','description','imageUrl','isActive','order'], filters: ['isActive'] },
  offices: { model: Office, search: ['name','city','country'], fields: ['name','address','city','country','phone','email','isActive'], filters: ['isActive'] },
  quotes: { model: Quote, search: ['name','email','origin','destination'], fields: ['name','email','phone','company','origin','destination','cargoType','message','status'], filters: ['status'] },
  contacts: { model: Contact, search: ['name','email','subject'], fields: ['name','email','subject','message','status'], filters: ['status'] }
};
