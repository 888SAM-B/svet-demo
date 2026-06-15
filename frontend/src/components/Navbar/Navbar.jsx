import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Common/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const timeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  // const showTransparent = isHomePage && !scrolled && !isOpen;
  const showTransparent = false;

  // Reset auto-hide timer helper
  const resetAutoHideTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Hide after 3 seconds of inactivity
  };

  // 1. Scroll listener and initial visibility timer
  useEffect(() => {
    resetAutoHideTimer();

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      // Reveal navbar on scroll movement and restart timer
      resetAutoHideTimer();
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 2. Hover listener triggers
  useEffect(() => {
    if (isHovered) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(true);
    } else {
      resetAutoHideTimer();
    }
  }, [isHovered]);

  // 3. Prevent auto-hide when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(true);
    } else {
      resetAutoHideTimer();
    }
  }, [isOpen]);

  const menuItems = [
    { name: 'Home', hash: '#home' },
    { name: 'Countries', hash: '#countries' },
    { name: 'Why Choose', hash: '#why-choose' },
    { name: 'Journey', hash: '#journey' },
    { name: 'Contact', hash: '#contact' }
  ];

  const handleNavClick = (hash) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Invisible Top Hover Trigger: active only when navbar is hidden */}
      {!isVisible && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          className="fixed top-0 left-0 w-full h-5 z-50 bg-transparent pointer-events-auto"
        />
      )}

      <nav
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          } ${showTransparent
            ? 'py-5 bg-transparent border-b border-transparent'
            : 'py-3 bg-white border-b border-border-color shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-200 ${showTransparent
                ? 'bg-white/10 border-white/20'
                : 'bg-secondary-blue/10 border-secondary-blue/20 group-hover:bg-secondary-blue/20'
              }`}>
              <GraduationCap className={`w-5 h-5 transition-colors ${showTransparent ? 'text-white' : 'text-secondary-blue'}`} />
            </div>
            <div>
              <span className={`font-display font-extrabold text-xl tracking-tight block leading-tight transition-colors ${showTransparent ? 'text-white' : 'text-primary-blue'
                }`}>SVET</span>
              <span className={`text-[10px] font-sans block max-md:hidden tracking-wider font-light uppercase transition-colors ${showTransparent ? 'text-[#DBE2EF]/80' : 'text-secondary-text'
                }`}>Sri Venkateshwara Educational Trust</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <div className={`flex items-center transition-all duration-300 ${showTransparent ? 'gap-3' : 'gap-8'}`}>
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.hash)}
                  className={`font-sans font-semibold cursor-pointer transition-all duration-200 relative ${showTransparent
                      ? 'px-4 py-1.5 bg-white/[0.05] backdrop-blur-[6px] border border-white/[0.08] rounded-full text-xs text-[#DBE2EF] hover:text-white hover:bg-white/[0.12] shadow-sm'
                      : 'px-0 py-1 bg-transparent border-transparent text-sm text-secondary-text hover:text-primary-blue'
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <Link to="/apply">
              <Button variant="primary" className="px-5 py-2 text-xs">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors cursor-pointer ${showTransparent ? 'text-white hover:text-[#DBE2EF]' : 'text-primary-blue hover:text-secondary-blue'
              }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-border-color bg-white overflow-hidden shadow-md"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.hash)}
                    className="text-left text-sm text-secondary-text hover:text-primary-blue transition-colors py-1 font-semibold cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
                <hr className="border-border-color my-1" />
                <Link to="/apply" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full py-2.5">
                    Apply Now
                  </Button>
                </Link>
                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-center text-xs font-semibold text-secondary-text hover:text-primary-blue hover:underline mt-2">
                  Admin Portal Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
