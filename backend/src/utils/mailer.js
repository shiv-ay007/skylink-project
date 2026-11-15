import nodemailer from 'nodemailer';
export async function notifyNewRequest(subject,html){
 const {SMTP_HOST,SMTP_USER,SMTP_PASS,CONTACT_TO_EMAIL}=process.env;
 if(!SMTP_HOST||!SMTP_USER||!SMTP_PASS||!CONTACT_TO_EMAIL)return;
 const transporter=nodemailer.createTransport({host:SMTP_HOST,port:Number(process.env.SMTP_PORT)||587,secure:process.env.SMTP_SECURE==='true',auth:{user:SMTP_USER,pass:SMTP_PASS}});
 try{await transporter.sendMail({from:process.env.MAIL_FROM||SMTP_USER,to:CONTACT_TO_EMAIL,subject,text:String(html).replace(/<[^>]*>/g,'')});}
 catch(e){console.error('Email delivery error:',e.message);}
}
