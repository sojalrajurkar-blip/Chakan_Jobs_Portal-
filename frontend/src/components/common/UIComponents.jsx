import React from 'react';
import { Loader2, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={16} />}
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'sage', className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export const Spinner = ({ size = 28, className = '' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
      <Loader2 size={size} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-brand-ink)' }} className={className} />
    </div>
  );
};

export const AlertBanner = ({ type = 'info', message, details, onClose }) => {
  if (!message && !details) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="var(--color-state-success)" />,
    error: <AlertCircle size={20} color="var(--color-state-error)" />,
    warning: <AlertTriangle size={20} color="var(--color-state-warning)" />,
    info: <Info size={20} color="var(--color-state-info)" />,
  };

  const bgColors = {
    success: 'var(--color-state-success-bg)',
    error: 'var(--color-state-error-bg)',
    warning: 'var(--color-state-warning-bg)',
    info: 'var(--color-state-info-bg)',
  };

  const textColors = {
    success: 'var(--color-state-success)',
    error: 'var(--color-state-error)',
    warning: 'var(--color-state-warning)',
    info: 'var(--color-state-info)',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        backgroundColor: bgColors[type],
        border: `1px solid ${textColors[type]}33`,
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-4)',
      }}
    >
      <div style={{ marginTop: '2px' }}>{icons[type]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: textColors[type], fontSize: '0.9375rem' }}>
          {message}
        </div>
        {details && typeof details === 'object' && (
          <ul style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-4)', color: textColors[type], fontSize: '0.875rem' }}>
            {Object.entries(details).map(([field, errList]) => (
              <li key={field}>
                <strong>{field}:</strong> {Array.isArray(errList) ? errList.join(' ') : String(errList)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: textColors[type],
            fontWeight: 700,
            fontSize: '1rem',
          }}
          aria-label="Close message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export const EmptyState = ({ title, description, actionText, onAction, icon: Icon }) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-12) var(--space-6)',
        backgroundColor: 'var(--color-surface-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border-strong)',
        maxWidth: '540px',
        margin: 'var(--space-8) auto',
      }}
    >
      {Icon && (
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-brand-sage)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-brand-ink)',
          }}
        >
          <Icon size={32} />
        </div>
      )}
      <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--color-brand-ink)' }}>{title}</h3>
      <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-text-secondary)' }}>{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
