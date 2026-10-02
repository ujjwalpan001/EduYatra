// frontend/src/pages/intro/PageShell.tsx - Navbar, page header and footer for public content pages
import React, { useEffect } from 'react';
import Navbar from './navbar';
import SiteFooter from './SiteFooter';

interface PageShellProps {
  badge: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

const PageShell: React.FC<PageShellProps> = ({ badge, title, subtitle, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar overHero />

      <header className="relative overflow-hidden pt-16 bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-600 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-xl shadow-blue-900/10">
        <div className="absolute inset-0 page-grid opacity-40"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-24 w-[420px] h-[420px] bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-100 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-300"></span>
            {badge}
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="mt-4 text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">{children}</main>

      <SiteFooter />

      <style>{`
        .page-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }
      `}</style>
    </div>
  );
};

export default PageShell;
