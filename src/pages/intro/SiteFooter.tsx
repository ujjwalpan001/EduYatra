// frontend/src/pages/intro/SiteFooter.tsx - Footer shared by the public pages
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, ExternalLink, Mail, Phone } from 'lucide-react';
import { MCQ_URL, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from './site';

const SiteFooter: React.FC = () => (
  <footer className="relative overflow-hidden text-white pt-16 pb-8 mt-6 sm:mt-10 rounded-t-[2rem] sm:rounded-t-[3rem] bg-[#0b1430]">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Deskoros" className="w-10 h-10" />
            <span className="text-2xl font-bold">Deskoros</span>
          </div>
          <p className="text-gray-400 max-w-sm">Empowering education through technology</p>
          <div className="space-y-2 text-sm text-gray-400">
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 hover:text-white transition-colors break-all">
              <Mail className="w-4 h-4 shrink-0 text-cyan-300" /> {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4 shrink-0 text-cyan-300" /> {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
          <a
            href={MCQ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:border-cyan-400/50 hover:bg-white/10 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">Deskoros Offline MCQ</div>
              <div className="text-xs text-gray-400">mcq.deskoros.tech</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 transition-colors" />
          </a>
        </div>
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
            <li><Link to="/tutoring" className="hover:text-white transition-colors">Tutoring</Link></li>
            <li><a href={MCQ_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Offline MCQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact-us" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        <p>&copy; 2026 Deskoros. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
