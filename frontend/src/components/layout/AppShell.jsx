import React from 'react';
import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export const AppShell = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};
