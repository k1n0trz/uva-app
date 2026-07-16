import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-bold text-ink">{title}</h1>
        {subtitle ? <p className="mt-1 text-[13px] text-ink-secondary">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>{children}</div>;
}

type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

const BADGE_TONES: Record<BadgeTone, string> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-border text-ink-secondary',
  primary: 'bg-primary-soft text-primary-dark',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE_TONES[tone]}`}>
      {children}
    </span>
  );
}

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  outline: 'border border-border bg-white text-ink hover:bg-surface',
  ghost: 'text-primary-dark hover:bg-primary-soft',
  danger: 'border border-danger-border bg-white text-danger hover:bg-danger-soft',
};

export function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'min-h-[38px] cursor-pointer rounded-full px-4 text-[13px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        BUTTON_VARIANTS[variant],
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-ink-secondary">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] leading-4 text-ink-faint">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  'w-full min-h-[38px] rounded-xl border border-border bg-white px-3 text-[13px] text-ink outline-none focus:border-primary';

/** Explains a rule the panel enforces, so the team knows it isn't a bug. */
export function RuleNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-primary-border bg-primary-xsoft px-4 py-3">
      <p className="text-[12px] leading-5 text-ink">{children}</p>
    </div>
  );
}
