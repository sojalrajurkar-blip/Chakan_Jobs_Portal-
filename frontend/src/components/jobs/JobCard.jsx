import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Users, Building, ArrowRight } from 'lucide-react';
import { Badge, Button } from '../common/UIComponents';

export const JobCard = ({ job }) => {
  if (!job) return null;

  const formatSalary = (min, max) => {
    if (min > 0 && max > 0) {
      return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')} / mo`;
    } else if (min > 0) {
      return `From ₹${min.toLocaleString('en-IN')} / mo`;
    }
    return 'Best in industry';
  };

  return (
    <div
      className="card"
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        position: 'relative',
        borderLeft: '4px solid var(--color-brand-ink)',
      }}
    >
      <div>
        {/* Header row: Title & Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
              <Building size={16} />
              <span style={{ fontWeight: 600 }}>{job.company_name || 'Automotive Employer'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Badge variant="sage">{job.shift_display || job.shift || 'Day Shift'}</Badge>
            <Badge variant="lavender">{job.job_type_display || job.job_type || 'Industry'}</Badge>
          </div>
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
