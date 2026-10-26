import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/common/UIComponents';

export const NotFoundPage = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
      <div style={{ display: 'inline-flex', padding: 'var(--space-4)', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-brand-sage)', marginBottom: 'var(--space-4)' }}>
        <AlertCircle size={48} color="var(--color-brand-ink)" />
      </div>
      <h1 style={{ marginBottom: 'var(--space-3)' }}>Page Not Found</h1>
      <p style={{ maxWidth: '480px', margin: '0 auto var(--space-6)' }}>
        The page you are looking for does not exist or may have been moved. Return to the homepage to explore active Chakan jobs.
      </p>
      <Link to="/">
        <Button variant="primary">Back to Homepage</Button>
      </Link>
    </div>
  );
};
