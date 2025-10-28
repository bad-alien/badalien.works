'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Lottie from 'lottie-react';

export default function ConsultPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [demoAnimationData, setDemoAnimationData] = useState(null);

  useEffect(() => {
    // Load demo animation
    fetch('/animations/demo-animation.json')
      .then(response => response.json())
      .then(data => setDemoAnimationData(data))
      .catch(err => console.error('Failed to load demo animation:', err));

    // Add Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Apply font to body
    document.body.style.fontFamily = "'Inter', sans-serif";

    // Handle scroll for header transparency
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    // Fade in subheadline
    const subheadline = document.querySelector('.fade-in-subheadline');
    if (subheadline) {
      setTimeout(() => {
        subheadline.classList.add('opacity-100');
      }, 500);
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      .fade-in-subheadline {
        transition: opacity 1s ease-in-out;
      }
      
      .hover-lift {
        transition: all 0.3s ease;
      }
      
      .hover-lift:hover {
        transform: translateY(-4px);
        border-color: rgba(127, 0, 255, 0.5);
        box-shadow: 0 0 30px rgba(127, 0, 255, 0.2);
      }
      
      .glassmorphism-hover {
        transition: all 0.3s ease;
      }
      
      .glassmorphism-hover:hover {
        border-color: rgba(127, 0, 255, 0.6);
        box-shadow: 0 0 40px rgba(127, 0, 255, 0.3), inset 0 0 20px rgba(127, 0, 255, 0.1);
      }
      
      .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
      
      .purple-gradient-text {
        background: linear-gradient(135deg, #7F00FF 0%, #E100FF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup
      window.removeEventListener('scroll', handleScroll);
      if (link.parentNode) link.parentNode.removeChild(link);
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Full Screen Lottie Animation Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <DotLottieReact
          src="/animations/background-animation.lottie"
          loop
          autoplay
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100vw',
            minHeight: '100vh',
            width: 'auto',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            opacity: 0.15,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 ease-out"
           style={{
             backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0)',
             backdropFilter: isScrolled ? 'blur(8px)' : 'blur(0px)',
           }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/logos/ba-logo-trans-white.png" 
                alt="Bad Alien Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <div>
              <button className="text-white hover:text-purple-400 transition-colors text-sm px-4 py-2 border border-white/30 hover:border-purple-400 rounded-lg">
                Free Strategy Consult
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative z-10 pt-20">        
        {/* Content */}
        <div className="max-w-4xl w-full">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            Amplify Your Business
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-8">
            We build and deploy custom AI agents that make your business <span className="purple-gradient-text font-semibold">extraordinarily</span> more efficient and effective.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
              Let&apos;s Talk
            </button>
            <button className="px-6 py-3 border border-white/30 hover:border-purple-400 text-white hover:text-purple-400 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* The Protocol Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6">
              The Protocol
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Every solution we deploy is guided by three core principles. This is what makes our approach different—and more effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Speed is the Strategy */}
            <div className="hover-lift bg-gray-900/30 rounded-xl p-8 border border-gray-800 text-center">
              <div className="mb-6 flex justify-center">
                <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Speed is the Strategy
              </h2>
              <p className="text-gray-400">
                We believe speed is a competitive advantage. Our entire process is engineered for rapid execution, moving from audit to deployment in a fraction of the time of traditional consultants. We deliver tangible value in days and weeks, not months.
              </p>
            </div>

            {/* Seamless Integration */}
            <div className="hover-lift bg-gray-900/30 rounded-xl p-8 border border-gray-800 text-center">
              <div className="mb-6 flex justify-center">
                <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Seamless Integration
              </h2>
              <p className="text-gray-400">
                We deploy our solutions with zero operational downtime. Our agents are designed to plug directly into your existing tools and workflows, amplifying your team&apos;s capabilities without interrupting the day-to-day rhythm of your business.
              </p>
            </div>

            {/* Clear Targets */}
            <div className="hover-lift bg-gray-900/30 rounded-xl p-8 border border-gray-800 text-center">
              <div className="mb-6 flex justify-center">
                <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Clear Targets
              </h2>
              <p className="text-gray-400">
                We don&apos;t do vague. Every engagement starts with defining clear, measurable goals—like increasing lead conversion by 20% or cutting down repetitive tasks by 15 hours per week. We define the target, hit it, and prove the ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Deployments Section */}
      <section className="py-32 px-6 bg-gray-900/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column - List */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-12">
                Popular Deployments
              </h2>
              
              <div className="space-y-8">
                {/* The Omni Support Agent */}
                <div className="py-6 border-b border-gray-800/50 hover:bg-gray-900/20 transition-colors rounded-lg px-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
                    01. The Omni Support Agent
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    24/7 customer service front line that resolves up to 80% of repetitive inquiries instantly and accurately.
                  </p>
                </div>

                {/* The Lead Qualifier */}
                <div className="py-6 border-b border-gray-800/50 hover:bg-gray-900/20 transition-colors rounded-lg px-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
                    02. The Lead Qualifier
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Engages prospects instantly, qualifying leads and automatically booking meetings with high-intent buyers.
                  </p>
                </div>

                {/* The Marketing Catalyst */}
                <div className="py-6 border-b border-gray-800/50 hover:bg-gray-900/20 transition-colors rounded-lg px-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
                    03. The Marketing Catalyst
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    AI creative partner that generates campaigns, social posts, and content in seconds with automated publishing.
                  </p>
                </div>

                {/* The Business Brain */}
                <div className="py-6 border-b border-gray-800/50 hover:bg-gray-900/20 transition-colors rounded-lg px-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
                    04. The Business Brain
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Centralized knowledge base that instantly answers team questions with accurate information and source links.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Demo Animation */}
            <div className="h-96 md:h-full min-h-[500px] flex items-center justify-center">
              {demoAnimationData ? (
                <Lottie 
                  animationData={demoAnimationData}
                  loop={true}
                  autoplay={true}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid meet'
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">Loading animation...</p>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-lg text-gray-400 text-center mt-16">
            This protocol ensures we deliver the right solution, quickly and effectively.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Amplify Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let&apos;s explore how AI agents can transform your business operations.
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Bad Alien. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}