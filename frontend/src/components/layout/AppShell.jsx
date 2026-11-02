import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export const AppShell = () => {
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteHeader />
      <main ref={mainRef} style={{ flex: 1 }}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};

