'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ChangeEvent } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  message: string;
}

type SubmitStatus = 'idle' | 'success' | 'error';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    serviceInterest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
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
        setFormData({ name: '', email: '', company: '', serviceInterest: '', message: '' });
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-text-heading mb-4">
              Let&apos;s Connect
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Have a project in mind? Let&apos;s discuss how AI can work for your business.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-elevated border border-border rounded-xl p-8 md:p-10 mb-16"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-white text-black rounded-lg font-medium transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

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
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
