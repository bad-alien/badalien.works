'use client';

import { useState } from 'react';

interface ReachOutFormProps {
  sessionId: string;
  onSuccess: () => void;
}

interface FormValues {
  email: string;
  best_time: string;
  phone: string;
}

interface FormErrors {
  email?: string;
  best_time?: string;
  form?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Enter a valid email';
  }
  if (!values.best_time.trim()) {
    errors.best_time = 'Tell me when works for you';
  }
  return errors;
}

export default function ReachOutForm({ sessionId, onSuccess }: ReachOutFormProps) {
  const [values, setValues] = useState<FormValues>({ email: '', best_time: '', phone: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([key]) => touched[key as keyof FormValues] || key === 'form')
  ) as FormErrors;

  const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...values, [field]: e.target.value };
    setValues(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (field: keyof FormValues) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { email: true, best_time: true, phone: true };
    setTouched(allTouched);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setErrors({});

    try {
      const body: Record<string, string> = {
        session_id: sessionId,
        email: values.email.trim(),
        best_time: values.best_time.trim(),
      };
      if (values.phone.trim()) {
        body.phone = values.phone.trim();
      }

      const res = await fetch('/api/audit/reachout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        const msg = json?.error?.message || 'Something went wrong. Please try again.';
        setErrors({ form: msg });
        return;
      }

      onSuccess();
    } catch {
      setErrors({ form: 'Network error. Please check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    'w-full rounded-lg px-4 py-3 text-sm bg-[#1E1E1E] border text-[#C5C5C5] placeholder-[#3A3A3A] transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]';
  const inputNormal = `${inputBase} border-[#2A2A2A] focus:border-[#FF6B35]`;
  const inputError = `${inputBase} border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]`;

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
      {visibleErrors.form && (
        <p className="text-[#EF4444] text-xs font-mono" role="alert">
          {visibleErrors.form}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="reachout-email"
          className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest"
        >
          Email <span className="text-[#FF6B35]" aria-hidden="true">*</span>
        </label>
        <input
          id="reachout-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          aria-invalid={!!visibleErrors.email}
          aria-describedby={visibleErrors.email ? 'email-error' : undefined}
          className={visibleErrors.email ? inputError : inputNormal}
        />
        {visibleErrors.email && (
          <p id="email-error" className="text-[#EF4444] text-xs" role="alert">
            {visibleErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="reachout-best-time"
          className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest"
        >
          Best time to reach you <span className="text-[#FF6B35]" aria-hidden="true">*</span>
        </label>
        <input
          id="reachout-best-time"
          type="text"
          placeholder="e.g. Weekday mornings, after 5pm EST…"
          value={values.best_time}
          onChange={handleChange('best_time')}
          onBlur={handleBlur('best_time')}
          aria-invalid={!!visibleErrors.best_time}
          aria-describedby={visibleErrors.best_time ? 'best-time-error' : undefined}
          className={visibleErrors.best_time ? inputError : inputNormal}
        />
        {visibleErrors.best_time && (
          <p id="best-time-error" className="text-[#EF4444] text-xs" role="alert">
            {visibleErrors.best_time}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="reachout-phone"
          className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest"
        >
          Phone{' '}
          <span className="text-xs normal-case tracking-normal text-[#3A3A3A]">(optional)</span>
        </label>
        <input
          id="reachout-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 555 000 0000"
          value={values.phone}
          onChange={handleChange('phone')}
          onBlur={handleBlur('phone')}
          className={inputNormal}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all duration-150 bg-[#FF6B35] text-white hover:bg-[#FF8C5A] active:bg-[#E05A2A] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35]"
        aria-label={submitting ? 'Sending…' : 'Send to Rauf'}
      >
        {submitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Send to Rauf <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  );
}
