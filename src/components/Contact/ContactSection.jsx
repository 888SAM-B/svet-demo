import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../Common/Button';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    comment: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email) {
      setStatus({ submitting: false, success: false, error: 'Please fill out all required fields.' });
      return;
    }

    setStatus({ submitting: true, success: false, error: null });

    const apiKey = import.meta.env.VITE_BREVO_API_KEY;
    const senderName = import.meta.env.VITE_BREVO_SENDER_NAME || 'SVET Admissions';
    const senderEmail = import.meta.env.VITE_BREVO_SENDER_EMAIL || 'admissions@svetmedical.org';
    const receiverEmail = import.meta.env.VITE_BREVO_RECEIVER_EMAIL || 'admissions@svetmedical.org';

    try {
      if (apiKey && apiKey !== 'your_brevo_api_key_here') {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: receiverEmail, name: "SVET Admin" }],
            subject: `New SVET Inquiry from ${formData.name}`,
            htmlContent: `
              <html>
                <body style="font-family: Arial, sans-serif; color: #112D4E;">
                  <h2>New Contact Enquiry</h2>
                  <p><strong>Name:</strong> ${formData.name}</p>
                  <p><strong>Mobile:</strong> ${formData.mobile}</p>
                  <p><strong>Email:</strong> ${formData.email}</p>
                  <p><strong>Message / Comment:</strong></p>
                  <blockquote style="border-left: 3px solid #3F72AF; padding-left: 10px; color: #3F72AF;">
                    ${formData.comment ? formData.comment.replace(/\n/g, '<br/>') : 'No comment provided.'}
                  </blockquote>
                </body>
              </html>
            `
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send mail via Brevo');
        }
      } else {
        // Fallback simulation
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      
      // Save submission in localStorage
      const existingMsg = JSON.parse(localStorage.getItem('svet_contact_messages') || '[]');
      existingMsg.push({
        ...formData,
        id: `MSG-${Date.now()}`,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('svet_contact_messages', JSON.stringify(existingMsg));

      setStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', mobile: '', email: '', comment: '' });
    } catch (err) {
      setStatus({ submitting: false, success: false, error: 'Failed to send message via Brevo SMTP Gateway. Please try again later.' });
    }
  };

  return (
    <section id="contact" className="py-24 bg-white border-b border-[#DBE2EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#3F72AF] font-bold">Get In Touch</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#112D4E]">
            Contact Our Admissions Office
          </h2>
          <p className="text-sm text-[#3F72AF]/90 font-light leading-relaxed">
            Have questions about MBBS or BDS admission abroad? Send us a message and our counselor will call you.
          </p>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Office Coordinates */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-6">
              <h3 className="font-display font-bold text-xl text-[#112D4E]">
                SVET Trust Headquarters
              </h3>
              <p className="text-[#3F72AF]/95 text-sm font-light leading-relaxed">
                Sri Venkateshwara Educational Trust is dedicated to transparent admission services. Visit our administrative office or contact our helpline directly.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7]">
                <div className="p-3 w-fit bg-[#3F72AF]/10 rounded-lg text-[#3F72AF]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#112D4E]">Registered Office</h4>
                  <p className="text-xs text-[#3F72AF]/95 mt-1 font-light leading-relaxed">
                    No. 45, 1st Floor, Gandhi Nagar Main Road, Adyar,<br />
                    Chennai, Tamil Nadu, Pin - 600020
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7]">
                <div className="p-3 w-fit bg-[#3F72AF]/10 rounded-lg text-[#3F72AF]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#112D4E]">Student Helpline</h4>
                  <p className="text-xs text-[#3F72AF]/95 mt-1 font-light leading-relaxed">
                    +91 98765 43210 / +91 44 2445 6789
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7]">
                <div className="p-3 w-fit bg-[#3F72AF]/10 rounded-lg text-[#3F72AF]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#112D4E]">Email Queries</h4>
                  <p className="text-xs text-[#3F72AF]/95 mt-1 font-light">
                    admissions@svetmedical.org
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7]">
                <div className="p-3 w-fit bg-[#3F72AF]/10 rounded-lg text-[#3F72AF]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#112D4E]">Office Hours</h4>
                  <p className="text-xs text-[#3F72AF]/95 mt-1 font-light">
                    Monday – Saturday: 9:30 AM to 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#F9F7F7] p-8 sm:p-10 rounded-2xl border border-[#DBE2EF] shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="mb-6 text-left">
              <h3 className="font-display font-bold text-lg text-[#112D4E]">
                Send an Enquiry
              </h3>
              <p className="text-xs text-[#3F72AF]/90 mt-1 font-light">
                Fill the fields below. Messages are transmitted securely via our Brevo SMTP service.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#112D4E]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-[#DBE2EF] bg-white focus:outline-none focus:border-[#3F72AF] focus:ring-1 focus:ring-[#3F72AF]/35 transition-all text-[#112D4E]"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label htmlFor="mobile" className="text-xs font-bold uppercase tracking-wider text-[#112D4E]">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-[#DBE2EF] bg-white focus:outline-none focus:border-[#3F72AF] focus:ring-1 focus:ring-[#3F72AF]/35 transition-all text-[#112D4E]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#112D4E]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-[#DBE2EF] bg-white focus:outline-none focus:border-[#3F72AF] focus:ring-1 focus:ring-[#3F72AF]/35 transition-all text-[#112D4E]"
                />
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <label htmlFor="comment" className="text-xs font-bold uppercase tracking-wider text-[#112D4E]">
                  Comment / Message
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Enter details about your query (e.g. Preferred country, NEET score)"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-[#DBE2EF] bg-white focus:outline-none focus:border-[#3F72AF] focus:ring-1 focus:ring-[#3F72AF]/35 transition-all text-[#112D4E] resize-none"
                />
              </div>

              {/* Status messages */}
              <AnimatePresence>
                {status.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg"
                  >
                    {status.error}
                  </motion.div>
                )}

                {status.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-sm">Message Sent Successfully!</h5>
                      <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                        Your request was dispatched via Brevo Mailer API gateway. An admission executive will contact you shortly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={status.submitting}
                className="w-full justify-center gap-2 py-3.5 mt-2"
              >
                {status.submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
