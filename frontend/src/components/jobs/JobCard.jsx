import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Users, Building, ArrowRight, ShieldCheck, Bus, Utensils, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { Badge, Button } from '../common/UIComponents';

export const JobCard = ({ job }) => {
  const cardRef = useRef(null);

  if (!job) return null;

  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -5,
        boxShadow: '0 14px 30px rgba(10, 7, 51, 0.12)',
        borderLeftColor: '#EFB817',
        duration: 0.25,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: 'var(--shadow-card)',
        borderLeftColor: 'var(--color-brand-ink)',
        duration: 0.25,
        ease: 'power2.out',
      });
    }
  };

  const formatSalary = (min, max) => {
    if (min > 0 && max > 0) {
      return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')} / mo`;
    } else if (min > 0) {
      return `From ₹${min.toLocaleString('en-IN')} / mo`;
    }
    return 'Best in industry + OT';
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="card gsap-job-card"
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        position: 'relative',
        borderLeft: '4px solid var(--color-brand-ink)',
        transition: 'border-color 0.2s ease',
      }}
    >

      <div>
        {/* Header row: Title & Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
            {job.company_logo_url ? (
              <img
                src={job.company_logo_url}
                alt={job.company_name || 'Company'}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  objectFit: 'contain',
                  background: '#FFFFFF',
                  padding: '4px',
                  border: '1px solid var(--color-border-default)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--color-brand-ink), #1d1768)',
                  color: 'var(--color-brand-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(10, 7, 51, 0.12)',
                }}
              >
                {(job.company_name || 'CJ').substring(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <Link
                to={`/jobs/${job.id}`}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-ink)',
                  lineHeight: 1.3,
                  display: 'block',
                }}
              >
                {job.title}
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '4px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Building size={15} />
                  <span style={{ fontWeight: 600, color: 'var(--color-brand-ink)' }}>{job.company_name || 'Automotive OEM / Vendor'}</span>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 600 }}>
                  <CheckCircle size={12} /> Verified Factory HR
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Badge variant="sage">{job.shift_display || job.shift || 'Day Shift'}</Badge>
            <Badge variant="lavender">{job.job_type_display || job.job_type || 'Factory Unit'}</Badge>
          </div>
        </div>

        {/* Industrial Facilities & Perks Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
          {job.bus_route && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 600 }}>
              <Bus size={12} /> Bus Route: {job.bus_route.length > 22 ? job.bus_route.substring(0, 22) + '...' : job.bus_route}
            </span>
          )}
          {job.facilities && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: 600 }}>
              <Utensils size={12} /> Canteen Provided
            </span>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f0fdf4', color: '#15803d', fontSize: '0.75rem', fontWeight: 600 }}>
            <ShieldCheck size={12} /> Direct Interview • 0% Commission
          </span>
        </div>

        {/* Key specifications pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--space-4)',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
            marginTop: 'var(--space-3)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--color-surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="var(--color-brand-purple)" />
            <span>{job.area}{job.village ? `, ${job.village}` : ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--color-state-success)' }}>
            <IndianRupee size={15} />
            <span>{formatSalary(job.min_salary, job.max_salary)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={15} color="var(--color-brand-purple)" />
            <span>{job.openings} {job.openings === 1 ? 'Opening' : 'Openings'}</span>
          </div>
        </div>
      </div>

      {/* Footer row: Education/Exp and Action button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-2)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-border-default)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          <span>Edu: <strong>{job.min_education_display || job.min_education}</strong></span>
          <span>•</span>
          <span>Exp: <strong>{job.experience_required_display || job.experience_required}</strong></span>
        </div>

        <Link to={`/jobs/${job.id}`}>
          <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>View & Apply</span>
            <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </div>
  );
};
