'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties, ChangeEvent } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CalEmbed from '@/components/contact/CalEmbed';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  serviceInterest: string;
  message: string;
  smsConsent: boolean;
}

type SubmitStatus = 'idle' | 'success' | 'error';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceInterest: '',
    message: '',
    smsConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const formCardRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState<number | null>(null);

  useIsoLayoutEffect(() => {
    const node = formCardRef.current;
    if (!node) return;
    const update = () => setFormHeight(node.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (formData.smsConsent && !formData.phone.trim()) {
      setSubmitStatus('error');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          serviceInterest: '',
          message: '',
          smsConsent: false,
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData({
        ...formData,
        [target.name]: target.checked,
      });
      return;
    }
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const serviceOptions = [
    { value: '', label: 'Select a service...' },
    { value: 'ai-adoption', label: 'AI Adoption & Enablement' },
    { value: 'custom-software', label: 'Custom Software & Automation' },
    { value: 'design-growth', label: 'Design & Growth' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'other', label: 'Other / Not Sure' }
  ];

  return (
    <div className="min-h-screen w-full bg-base relative grain-texture">
      <Header />

      <main id="main-content" className="pt-36 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-text-heading mb-4">
              Here to Help
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Pick a time that works for you, or send a note.
            </p>
          </motion.div>

          {/* Two-column layout: book on the left, note form on the right */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-10 items-start"
            style={
              formHeight
                ? ({ '--form-h': `${formHeight}px` } as CSSProperties)
                : undefined
            }
          >
            {/* Calendar Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col min-w-0"
            >
              <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary block mb-6">
                01 / Book a Call
              </span>
              <div className="bg-elevated border border-border rounded-xl overflow-hidden lg:max-h-[var(--form-h,900px)] lg:overflow-y-auto">
                <CalEmbed />
              </div>
            </motion.section>

            {/* Form Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col min-w-0"
            >
              <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary block mb-6">
                02 / Or Send a Note
              </span>

              <div
                ref={formCardRef}
                className="bg-elevated border border-border rounded-xl p-8 md:p-10"
              >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-body mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-base border border-border rounded-lg text-text-heading placeholder-muted focus:outline-none focus:border-primary/30 transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-body mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-base border border-border rounded-lg text-text-heading placeholder-muted focus:outline-none focus:border-primary/30 transition-colors"
                  placeholder="your.email@company.com"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-text-body mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-base border border-border rounded-lg text-text-heading placeholder-muted focus:outline-none focus:border-primary/30 transition-colors"
                  placeholder="Your company name"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-body mb-2">
                  Mobile Phone <span className="text-text-secondary text-xs font-normal">(optional, only required if you opt in to SMS)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  inputMode="tel"
                  className="w-full px-4 py-3 bg-base border border-border rounded-lg text-text-heading placeholder-muted focus:outline-none focus:border-primary/30 transition-colors"
                  placeholder="(555) 555-5555"
                />
              </div>

              {/* Service Interest */}
              <div>
                <label htmlFor="serviceInterest" className="block text-sm font-medium text-text-body mb-2">
                  Service Interest
                </label>
                <select
                  id="serviceInterest"
                  name="serviceInterest"
                  value={formData.serviceInterest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-base border border-border rounded-lg text-text-heading focus:outline-none focus:border-primary/30 transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                  }}
                >
                  {serviceOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-black text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-body mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-base border border-border rounded-lg text-text-heading placeholder-muted focus:outline-none focus:border-primary/30 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* SMS Consent */}
              <div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="smsConsent"
                    name="smsConsent"
                    checked={formData.smsConsent}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer accent-primary"
                  />
                  <label htmlFor="smsConsent" className="text-sm text-text-body leading-relaxed cursor-pointer">
                    I agree to receive text messages from Bad Alien LLC.
                  </label>
                </div>
                <p className="mt-2 ml-7 text-xs text-text-secondary leading-relaxed">
                  Follow-ups, reminders &amp; service updates. Reply STOP to opt out, HELP for
                  help.{' '}
                  <Link href="/privacy-policy" className="underline hover:text-text-body">
                    Privacy
                  </Link>{' '}
                  &middot;{' '}
                  <Link href="/terms-and-conditions#sms-terms" className="underline hover:text-text-body">
                    SMS Terms
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-white text-black rounded-lg font-medium transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              <p className="text-xs text-text-secondary text-center leading-relaxed">
                By submitting, you agree to our{' '}
                <Link href="/privacy-policy" className="underline hover:text-text-body">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/terms-and-conditions" className="underline hover:text-text-body">
                  Terms &amp; Conditions
                </Link>
                .
              </p>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-300 text-center"
                >
                  Message sent! I&apos;ll get back to you within 24 hours.
                </motion.div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-center"
                >
                  Something went wrong. Please try again or email directly at{' '}
                  <a href="mailto:contact@badalien.works" className="underline hover:text-red-200">
                    contact@badalien.works
                  </a>
                </motion.div>
              )}
            </form>
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
