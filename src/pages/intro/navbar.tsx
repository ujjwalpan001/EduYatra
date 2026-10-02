// frontend/src/pages/intro/navbar.tsx - Deskoros Branding
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Sparkles, BookOpen, GraduationCap, School, LogIn } from 'lucide-react';

const SOLUTIONS = [
  { to: '/courses', label: 'Courses', description: 'Structured learning paths', icon: BookOpen },
  { to: '/tutoring', label: 'Tutoring', description: 'Guidance from educators', icon: GraduationCap },
  { to: '/schools', label: 'Schools', description: 'Tools for institutes', icon: School },
];

const LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/about', label: 'About' },
  { to: '/contact-us', label: 'Contact' },
];

interface NavbarProps {
  /** Page starts with a dark hero: stay transparent over it until the user scrolls */
  overHero?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ overHero = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = !overHero || scrolled || showMobileMenu;
  const isActive = (to: string) => pathname.toLowerCase() === to;
  const solutionsActive = SOLUTIONS.some((item) => isActive(item.to));

  const linkClass = (active: boolean) =>
    `nav-link relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? 'text-white nav-link-active' : 'text-blue-100/85 hover:text-white'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        solid
          ? 'bg-[#0b1640]/90 backdrop-blur-xl border-white/10 shadow-lg shadow-blue-950/20'
          : 'bg-transparent border-white/10'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md shadow-blue-950/30 ring-1 ring-white/40 group-hover:scale-105 group-hover:rotate-[-4deg] transition-transform">
              <img src="/logo.svg" alt="" className="w-6 h-6" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">Deskoros</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/features" className={linkClass(isActive('/features'))}>Features</Link>

            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button
                type="button"
                aria-expanded={showDropdown}
                onClick={() => setShowDropdown((open) => !open)}
                className={`${linkClass(solutionsActive)} flex items-center`}
              >
                Solutions
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              {/* pt-2 bridges the gap so the menu doesn't close while moving the cursor onto it */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 ${
                  showDropdown ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'
                }`}
              >
                <div className="w-64 rounded-2xl border border-white/10 bg-[#0b1640]/95 backdrop-blur-xl p-2 shadow-2xl shadow-blue-950/40">
                  {SOLUTIONS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors group/item"
                    >
                      <span className="w-9 h-9 shrink-0 rounded-lg bg-white/10 flex items-center justify-center group-hover/item:bg-white group-hover/item:text-blue-700 text-cyan-200 transition-colors">
                        <item.icon className="w-4 h-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-white">{item.label}</span>
                        <span className="block text-xs text-blue-200/70">{item.description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {LINKS.slice(1).map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(isActive(link.to))}>{link.label}</Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link to="/signin">
              <Button variant="ghost" className="h-10 px-4 rounded-xl text-white hover:text-white hover:bg-white/10 border border-white/20">
                <LogIn className="w-4 h-4 mr-1.5" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="h-10 px-5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg shadow-blue-950/30 hover:-translate-y-0.5 transition-all">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
            aria-expanded={showMobileMenu}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          showMobileMenu ? 'max-h-[34rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 pb-5 pt-1 space-y-1 border-t border-white/10">
          <Link
            to="/features"
            onClick={() => setShowMobileMenu(false)}
            className={`block px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/features') ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
          >
            Features
          </Link>

          <div className="px-4 pt-3 pb-1 text-[11px] font-bold text-blue-300/80 uppercase tracking-wider">Solutions</div>
          {SOLUTIONS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${isActive(item.to) ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
            >
              <item.icon className="w-4 h-4 text-cyan-200" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {LINKS.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-3 rounded-xl font-medium transition-colors ${isActive(link.to) ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="grid grid-cols-2 gap-2 pt-4">
            <Link to="/signin" onClick={() => setShowMobileMenu(false)}>
              <Button variant="ghost" className="w-full h-11 rounded-xl text-white hover:text-white hover:bg-white/10 border border-white/20">
                <LogIn className="w-4 h-4 mr-1.5" />
                Login
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setShowMobileMenu(false)}>
              <Button className="w-full h-11 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0.875rem;
          right: 0.875rem;
          bottom: 0.25rem;
          height: 2px;
          border-radius: 2px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.25s ease;
          opacity: 0.85;
        }
        .nav-link:hover::after,
        .nav-link-active::after { transform: scaleX(1); }
      `}</style>
    </nav>
  );
};

export default Navbar;
