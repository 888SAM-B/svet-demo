import React from 'react';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-primary-blue text-white pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">SVET</span>
            </div>
            <p className="text-xs text-blue-100/70 font-light leading-relaxed max-w-sm">
              Sri Venkateshwara Educational Trust is committed to assisting aspiring medical students in achieving their global education goals. We provide expert counselling, admission assistance, and visa processing for top overseas universities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Useful Links</h4>
            <ul className="space-y-2 text-xs text-blue-100/70">
              <li>
                <a href="#home" className="hover:text-white transition-colors duration-200">Home</a>
              </li>
              <li>
                <a href="#countries" className="hover:text-white transition-colors duration-200">Countries Offered</a>
              </li>
              <li>
                <a href="#why-choose" className="hover:text-white transition-colors duration-200">Why Choose Us</a>
              </li>
              <li>
                <a href="#journey" className="hover:text-white transition-colors duration-200">Admissions Timeline</a>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-3 text-xs text-blue-100/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/85 shrink-0 mt-0.5" />
                <span>Vaalapadi, Salem,<br />Tamil Nadu - 636115</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/85" />
                <div className="flex flex-col">
                  <a href="tel:9842731171" className="hover:text-white transition-colors">98427 31171</a>
                  <a href="tel:9443252171" className="hover:text-white transition-colors">94432 52171</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/85" />
                <a href="mailto:info@svetedu.org" className="hover:text-white transition-colors">info@svetedu.org</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-blue-100/60">
          <p>© {currentYear} SVET. All rights reserved. Sri Venkateshwara Educational Trust.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={handleScrollTop}>
              Back to Top
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
