import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, faqJsonLd, jsonLdScript, type FaqItem } from '@/lib/site';
import { services } from '@/data/services';
import LocalHero from '@/components/local/LocalHero';
import Reveal from '@/components/shared/Reveal';
import ProofSection from '@/components/consulting/ProofSection';
import ConsultCta from '@/components/consulting/ConsultCta';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = pageMetadata({
  path: '/ai-consultant-pasadena',
  title: 'AI Consultant in Pasadena, CA | Bad Alien',
  description:
    'Independent AI consultant in Pasadena, CA. Bad Alien helps small and mid-sized businesses in Pasadena, Los Angeles and remotely adopt AI: team enablement, tool and model strategy, and custom automations and agents. Free 15-minute intro call.',
});

// Every card maps to a real engagement shown on /consult. Keep it that way.
const clientTypes = [
  {
    title: 'Medical and professional practices',
    body: 'Helped a new primary care practice choose its patient platform on what HIPAA-compliant AI it could support, so front-desk work and patient outreach could be automated from the start. Built its website too.',
  },
  {
    title: 'Real estate and property groups',
    body: 'Ongoing AI advisor to a commercial real estate group: regular training for partners and staff, Power Automate flows that scrub sensitive financials from documents before Claude sees them, and a web app that scores prospective properties on power availability.',
  },
  {
    title: 'Wholesale, B2B and sales teams',
    body: 'An AI back office for a B2B wholesaler: agents that find and email leads, log every touch in the CRM, handle purchase orders and invoices with follow-ups, and answer customer questions by text and email. 10 to 20 qualified leads a week.',
  },
  {
    title: 'Agencies and creative teams',
    body: 'Coached a 40-person social ad agency to build its own AI tools, then consolidated everyone onto one shared Claude setup with a knowledge base for each client account.',
  },
  {
    title: 'Inspection, field and document-heavy work',
    body: 'Multimodal AI that reads inspection reports and photos end-to-end and surfaces what matters. Processing time cut by two-thirds.',
  },
  {
    title: 'Film, media and mission-driven projects',
    body: 'An agent that coordinates screenings for an independent documentary, from first inquiry to booked date, plus training the crew to use AI for outreach and marketing.',
  },
];

const whyLocal = [
  {
    title: 'In the room, not on a call',
    body: "I'm based in Pasadena and meet clients in person across the San Gabriel Valley and greater Los Angeles: Old Pasadena, South Pasadena, Altadena, Arcadia, Alhambra, Glendale, Burbank, and downtown LA. Discovery works better at your desk, watching how the work actually happens, than over video.",
  },
  {
    title: 'Sensitive data stays put',
    body: 'Law firms, medical practices, accountants and anyone handling client files should not be pasting them into public chatbots. When the data is sensitive, I deploy open-source or local LLMs on your own infrastructure, so nothing leaves your environment.',
  },
  {
    title: 'You own the result',
    body: 'I build with you, not for you. Every engagement ends with a handoff, documentation and 30 days of support, and your team able to run and adapt the system without me. I succeed when you stop needing me.',
  },
];

const faqs: FaqItem[] = [
  {
    question: 'Do you only work with businesses in Pasadena?',
    answer:
      'No. I meet clients in person in Pasadena and across Los Angeles, and I work remotely with businesses anywhere in the US. After discovery, most of the work is remote-friendly either way.',
  },
  {
    question: 'What does AI consulting cost?',
    answer:
      'It depends on the scope, so I do not quote numbers before understanding the problem. Every engagement starts with a free 15-minute intro call. Then you get a fixed scope and a capped budget, agreed before work starts, and I stay inside it.',
  },
  {
    question: 'How long does an engagement take?',
    answer:
      'Typical engagements run four to eight weeks, with weekly check-ins. Some proofs-of-concept are done in under two weeks, and enablement sprints for a team can be shorter still.',
  },
  {
    question: 'Do we need technical staff?',
    answer:
      'No. Most of my clients have none. Enablement work is designed for non-technical teams, and anything I build ships with documentation and a handoff so your people can run it.',
  },
  {
    question: 'Can our data stay private?',
    answer:
      'Yes. For sensitive data such as client files, patient records or internal financials, I deploy open-source or local LLMs on your infrastructure. No data goes to public AI endpoints.',
  },
  {
    question: 'What happens after the project ends?',
    answer:
      'You get a handoff with 30 days of support, and your team operates independently. If you need me again later, for a new challenge or a second opinion, I am a call away.',
  },
];

const sectionHeading = 'text-3xl md:text-5xl font-display font-bold tracking-tight text-text-heading';
const marker = 'font-mono text-[11px] tracking-[0.08em] uppercase text-secondary block mb-4';
const card = 'p-8 rounded-xl bg-surface border border-border';

export default function PasadenaPage() {
  return (
    <div className="min-h-screen bg-base relative grain-texture">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(faqs)) }} />

      <LocalHero />

      <main id="main-content">
        {/* Services */}
        <section aria-labelledby="services-heading" className="py-16 md:py-24 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <span className={marker}>01 / services</span>
              <h2 id="services-heading" className={`${sectionHeading} mb-4`}>
                What I do for Pasadena businesses
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mb-12">
                Three ways to work together, from a few sessions of coaching to a full custom build.
                Hire me for one or all three; most clients start with enablement and grow from there.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Reveal key={service.id} delay={index * 0.1} className={card}>
                  <span className="font-mono text-xs text-secondary block mb-3">{service.number} /</span>
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-text-heading mb-3">
                    {service.shortTitle}
                  </h3>
                  <p className="text-text-body leading-relaxed">{service.description}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8">
              <Link
                href="/services"
                className="text-text-heading hover:text-primary underline underline-offset-4 transition-colors duration-200"
              >
                All services and tooling →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Client types */}
        <section aria-labelledby="fit-heading" className="py-16 md:py-24 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <span className={marker}>02 / who this is for</span>
              <h2 id="fit-heading" className={`${sectionHeading} mb-4`}>
                Owner-run businesses with a process that eats hours every week
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mb-12">
                Most of my clients have 5 to 50 people, no in-house engineers, and one or two
                workflows that everyone knows are broken. These are the kinds of businesses I have
                built for.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientTypes.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08} className={card}>
                  <h3 className="text-lg font-display font-semibold text-text-heading mb-3">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.body}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8">
              <Link
                href="/consult"
                className="text-text-heading hover:text-primary underline underline-offset-4 transition-colors duration-200"
              >
                See the work →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Why local */}
        <section aria-labelledby="local-heading" className="py-16 md:py-24 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <span className={marker}>03 / why local</span>
              <h2 id="local-heading" className={`${sectionHeading} mb-12`}>
                Why work with an AI consultant in Pasadena
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyLocal.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.1}>
                  <h3 className="text-xl font-display font-semibold text-text-heading mb-3">{item.title}</h3>
                  <p className="text-text-body leading-relaxed">{item.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How I work */}
        <div className="border-t border-border">
          <ProofSection />
        </div>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="py-16 md:py-24 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <span className={marker}>04 / faq</span>
              <h2 id="faq-heading" className={`${sectionHeading} mb-12`}>
                Questions Pasadena business owners ask
              </h2>
            </Reveal>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {faqs.map((item, index) => (
                <Reveal key={item.question} delay={index * 0.05}>
                  <dt className="text-lg font-display font-semibold text-text-heading mb-2">{item.question}</dt>
                  <dd className="text-text-body leading-relaxed">{item.answer}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        <div className="border-t border-border">
          <ConsultCta />
        </div>
      </main>

      <Footer />
    </div>
  );
}
