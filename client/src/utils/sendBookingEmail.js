import emailjs from 'emailjs-com';
import {useState} from 'react'
import React from 'react';



const EMAILJS_SERVICE_ID = 'service_4lc11kc';
const EMAILJS_PUBLIC_KEY = 'zgH_aKjK58x-ztVZ4';


// Send approval email to user/farmer
export const sendApprovalEmail = async ({ booking, meetingLink, expertName }) => {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      'template_nmv38eb', // reusing existing template
      {
        name: booking.user_details.name,
        email: booking.user_email,
        title: '✅ Session Approved - Apna Bazar',
        message: `
Your consultation session has been APPROVED!

📋 Booking Details:
━━━━━━━━━━━━━━━━━━━━━━
👨‍🌾 Expert: ${expertName}
📅 Date: ${new Date(booking.session_date).toLocaleDateString('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})}
⏰ Time: ${booking.session_time}
📹 Meeting Type: ${booking.meeting_type}
🔗 Meeting Link: ${meetingLink}
━━━━━━━━━━━━━━━━━━━━━━

Please join the meeting on time. 
For any queries, contact us at support@apnabazar.com

Best Regards,
Apna Bazar Team 🌾
        `
      },
      EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};

// Send rejection email
export const sendRejectionEmail = async ({ booking, reason, expertName }) => {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      'template_nmv38eb',
      {
        name: booking.user_details.name,
        email: booking.user_email,
        title: '❌ Session Update - Apna Bazar',
        message: `
We regret to inform you that your consultation session has been declined.

📋 Booking Reference: ${booking.id}
👨‍🌾 Expert: ${expertName}
📅 Requested Date: ${new Date(booking.session_date).toLocaleDateString('en-IN')}
❌ Reason: ${reason || 'Expert unavailable at this time'}

You can book a new session with another available expert.
Visit: ${window.location.origin}/Expert

Best Regards,
Apna Bazar Team 🌾
        `
      },
      EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};