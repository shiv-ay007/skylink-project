import User from '../models/User.js';
import Shipment from '../models/Shipment.js';
import Booking from '../models/Booking.js';
import Vessel from '../models/Vessel.js';
import Quote from '../models/Quote.js';
import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
export default asyncHandler(async(_req,res)=>{
 const [users,shipments,bookings,vessels,quotes,messages,recentShipments]=await Promise.all([
  User.countDocuments(),Shipment.countDocuments(),Booking.countDocuments(),Vessel.countDocuments(),Quote.countDocuments({status:'NEW'}),Message.countDocuments({status:'NEW'}),Shipment.find().sort({createdAt:-1}).limit(5).select('trackingNumber containerNumber origin destination status createdAt').lean()
 ]);
 res.json({success:true,data:{users,shipments,bookings,vessels,quotes,messages,recentShipments}});
});
