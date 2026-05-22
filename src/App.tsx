/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import FlowArt, { FlowSection } from './components/ui/story-scroll.tsx';
import Marquee from './components/Marquee.tsx';
import { motion, AnimatePresence } from 'motion/react';

// Lazy-load heavy showcase pages so the home page loads instantly
const Showcase = React.lazy(() => import('./components/Showcase.tsx'));
const CinematicIdentityShowcase = React.lazy(() => import('./components/CinematicIdentityShowcase.tsx'));
const TheatricalTrailerShowcase = React.lazy(() => import('./components/TheatricalTrailerShowcase.tsx'));
const Contact = React.lazy(() => import('./components/Contact.tsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Home() {
  const navigate = useNavigate();
  const [isJoinHovered, setIsJoinHovered] = useState(false);

  return (
    <FlowArt aria-label="Présentation Flow Art">
      <FlowSection aria-label="Qui nous sommes" style={{ backgroundColor: '#ff4d00', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] invisible">01 — Who we are</p>
        <hr className="my-[2vw] border-none border-t border-black opacity-100" />
        <div>
          <h1
            className="text-[clamp(1rem,8vw,14rem)] md:text-[clamp(3rem,8vw,8rem)] lg:text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            6Frame
            <br />
            Studio
            <br />
            Rates
          </h1>
        </div>
        <hr className="my-[2vw] border-none border-t border-black opacity-100" />
      </FlowSection>

      <FlowSection aria-label="La mission" style={{ backgroundColor: '#000', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] invisible">02 — The mission</p>
        <hr className="my-[2vw] border-none border-t border-white/60" />
        <div>
          <h2
            className="text-[clamp(1rem,8vw,14rem)] md:text-[clamp(3rem,8vw,8rem)] lg:text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Premium
            <br />
            Motion Logo
            <br />
            $5,000+
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/60" />
        <Link
          to="/showcase"
          className="block mt-auto relative z-50 hover:no-underline"
          style={{ touchAction: 'manipulation' }}
        >
          <Marquee
            speed={30}
            className="text-[#ff4d00] border-white cursor-pointer"
          >
            CLICK HERE
          </Marquee>
        </Link>
      </FlowSection>

      <FlowSection aria-label="Comment ça marche" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] invisible">03 — How it works</p>
        <hr className="my-[2vw] border-none border-t border-black/60" />
        <div>
          <h2
            className="text-[clamp(1rem,8vw,14rem)] md:text-[clamp(3rem,8vw,8rem)] lg:text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Cinematic
            <br />
            Identity Package
            <br />
            $15,000+
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-black/60" />
        <Link
          to="/cinematic-identity"
          className="block mt-auto relative z-50 hover:no-underline"
          style={{ touchAction: 'manipulation' }}
        >
          <Marquee
            speed={30}
            className="text-[#ff4d00] border-black cursor-pointer"
          >
            CLICK HERE
          </Marquee>
        </Link>
      </FlowSection>

      <FlowSection aria-label="La vision" style={{ backgroundColor: '#111', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] invisible">04 — The vision</p>
        <hr className="my-[2vw] border-none border-t border-white/50" />
        <div>
          <h2
            className="text-[clamp(1rem,8vw,14rem)] md:text-[clamp(3rem,8vw,8rem)] lg:text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Studio-Grade
            <br />
            Theatrical Trailer
            <br />
            $25,000+
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/50" />
        <Link
          to="/theatrical-trailer"
          className="block mt-auto relative z-50 hover:no-underline"
          style={{ touchAction: 'manipulation' }}
        >
          <Marquee
            speed={30}
            className="text-[#ff4d00] border-white cursor-pointer"
          >
            CLICK HERE
          </Marquee>
        </Link>
      </FlowSection>

      <FlowSection aria-label="Nous rejoindre" style={{ backgroundColor: '#000', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] invisible">05 — Join us</p>
        <hr className="my-[2vw] border-none border-t border-black/60" />
        <div className="flex items-center py-[2vw]">
          <div
            onMouseEnter={() => setIsJoinHovered(true)}
            onMouseLeave={() => setIsJoinHovered(false)}
            onClick={() => navigate('/contact')}
            className="cursor-pointer relative inline-block group"
            style={{ touchAction: 'manipulation' }}
          >
            {/* Invisible anchor for layout size */}
            <h2 className="text-[clamp(1rem,8vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight opacity-0 pointer-events-none no-select flex flex-col">
              <span>Ready</span>
              <span>To</span>
              <span>Create?</span>
            </h2>

            <AnimatePresence mode="wait">
              {isJoinHovered ? (
                <motion.h2
                  key="click-here"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-[clamp(1rem,8vw,14rem)] md:text-[clamp(3rem,8vw,8rem)] lg:text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight text-[#ff4d00] absolute inset-0 flex flex-col justify-center whitespace-nowrap"
                >
                  <span>CLICK</span>
                  <span>HERE</span>
                </motion.h2>
              ) : (
                <motion.h2
                  key="ready-to-create"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-[clamp(1rem,8vw,14rem)] md:text-[clamp(3rem,8vw,8rem)] lg:text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight text-white absolute inset-0 flex flex-col justify-center whitespace-nowrap"
                >
                  <span className="text-[#ff4d00]">Ready</span>
                  <span>To</span>
                  <span>Create?</span>
                </motion.h2>
              )}
            </AnimatePresence>
          </div>
        </div>
        <hr className="my-[2vw] border-none border-t border-black/60" />
      </FlowSection>
    </FlowArt>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-1 h-1 bg-white animate-ping" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/cinematic-identity" element={<CinematicIdentityShowcase />} />
          <Route path="/theatrical-trailer" element={<TheatricalTrailerShowcase />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </>
  );
}
