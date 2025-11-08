'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ConsultPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Add form submission logic
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Contact Form */}
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img
              src="/logos/ba-logo-trans-white.png"
              alt="Bad Alien Logo"
              className="h-32 w-auto"
            />
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-3 text-center">
          Transmit to Bad Alien
        </h1>
          <p className="text-gray-400 text-center mb-8">
            Business, Creative, Networking - Bad Alien receives all frequencies.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#007878]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#007878]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#007878] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#007878] hover:bg-[#006666] text-white rounded-lg font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
      </div>
    </div>
  );
}
