import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Mail, Phone } from 'lucide-react';

export const SiteFooter = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-brand-ink)',
        color: '#E0E0EC',
        marginTop: 'auto',
        borderTop: '1px solid var(--color-brand-ink-soft)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-8)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {/* Col 1: Brand & Purpose */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.375rem',
                color: 'var(--color-text-inverse)',
                marginBottom: 'var(--space-3)',
              }}
            >
              CHAKAN<span style={{ color: 'var(--color-brand-gold)' }}>JOBS</span>
            </div>
            <p style={{ color: '#BBBBCF', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              Dedicated hyperlocal recruitment platform connecting job seekers with manufacturing units, automobile OEMs, engineering vendors, and factories in the Chakan Industrial Belt.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-brand-gold)', fontSize: '0.8125rem' }}>
              <ShieldCheck size={18} />
              <span>Verified Employers & Direct Contact</span>
            </div>
          </div>

          {/* Col 2: Industrial Hubs Covered */}
          <div>
            <h4 style={{ color: 'var(--color-text-inverse)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>
              Industrial Zones
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.875rem' }}>
              <li style={{ color: '#BBBBCF' }}>• Chakan MIDC Phase 1 & 2</li>
              <li style={{ color: '#BBBBCF' }}>• Chakan MIDC Phase 3 & 4</li>
              <li style={{ color: '#BBBBCF' }}>• Nanekarwadi & Kuruli Industrial Area</li>
              <li style={{ color: '#BBBBCF' }}>• Mahalunge & Kharabwadi Hub</li>
              <li style={{ color: '#BBBBCF' }}>• Talegaon MIDC Corridor</li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-text-inverse)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.875rem' }}>
              <li>
                <Link to="/jobs" style={{ color: '#BBBBCF' }}>
                  Browse All Vacancies
                </Link>
              </li>
              <li>
                <Link to="/recruiter/signup" style={{ color: '#BBBBCF' }}>
                  Post a Job Opening (HR)
                </Link>
              </li>
              <li>
                <Link to="/recruiter/login" style={{ color: '#BBBBCF' }}>
                  Recruiter Sign In
                </Link>
              </li>
              <li>
                <Link to="/jobs?job_type=INDUSTRY" style={{ color: '#BBBBCF' }}>
                  Factory & Machine Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Contact */}
          <div>
            <h4 style={{ color: 'var(--color-text-inverse)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>
              Portal Support
            </h4>
            <p style={{ color: '#BBBBCF', fontSize: '0.875rem', marginBottom: 'var(--space-3)' }}>
              Are you an employer in Chakan needing urgent plant staffing?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.875rem', color: '#BBBBCF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={16} color="var(--color-brand-gold)" />
                <span>Chakan MIDC, Khed, Pune 410501</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Mail size={16} color="var(--color-brand-gold)" />
                <span>support@chakanjobs.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            fontSize: '0.8125rem',
            color: '#8E90A0',
          }}
        >
          <div>
            © {new Date().getFullYear()} Chakan Job Portal. All rights reserved. Strictly no candidate application fees.
          </div>
        </div>
      </div>
    </footer>
  );
};
