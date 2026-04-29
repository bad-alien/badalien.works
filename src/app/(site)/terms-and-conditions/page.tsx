import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Bad Alien',
  description:
    'Terms governing your use of badalien.works, the contact form, and the Bad Alien LLC SMS messaging program.',
  alternates: { canonical: '/terms-and-conditions' },
};

const EFFECTIVE_DATE = 'April 29, 2026';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-base relative grain-texture">
      <Header />

      <main id="main-content" className="pt-32 pb-24 px-6">
        <article className="container mx-auto max-w-3xl">
          <header className="mb-12">
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary block mb-4">
              Legal / Terms
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-light tracking-tight text-text-heading mb-4">
              Terms &amp; Conditions
            </h1>
            <p className="text-text-secondary font-sans text-sm">
              Effective date: {EFFECTIVE_DATE}
            </p>
          </header>

          <div className="space-y-10 font-sans text-text-body leading-relaxed text-base md:text-lg">
            <section>
              <p>
                These Terms &amp; Conditions (the &ldquo;Terms&rdquo;) govern your use of{' '}
                <a href="https://badalien.works" className="text-primary hover:text-primary-light underline">
                  badalien.works
                </a>{' '}
                and its subdomains (the &ldquo;Site&rdquo;), the contact form, the call-booking
                experience, and the Bad Alien LLC SMS text-messaging program (collectively, the
                &ldquo;Services&rdquo;) operated by Bad Alien LLC (&ldquo;Bad Alien,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing the Site,
                submitting the contact form, booking a call, or opting in to receive text messages,
                you agree to these Terms and to our{' '}
                <Link href="/privacy-policy" className="text-primary hover:text-primary-light underline">
                  Privacy Policy
                </Link>
                . If you do not agree, please do not use the Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                1. Eligibility
              </h2>
              <p>
                You must be at least 18 years old (or the age of majority in your jurisdiction) to use
                the Services or to opt in to receive SMS messages. By using the Services you represent
                that you meet this requirement and that the information you provide is accurate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                2. Use of the Site
              </h2>
              <p>
                The Site, including its text, code, images, and design, is owned by Bad Alien LLC and
                protected by copyright and other intellectual-property laws. You may view and use the
                Site for personal, non-commercial purposes. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-body mt-3">
                <li>Copy, redistribute, or create derivative works from the Site without permission.</li>
                <li>
                  Use the Services in any unlawful manner or to harass, defame, or harm another person.
                </li>
                <li>
                  Attempt to probe, scan, or breach the security of the Site or any related
                  infrastructure.
                </li>
                <li>
                  Submit false, misleading, or third-party contact information through the contact
                  form or SMS opt-in.
                </li>
              </ul>
            </section>

            <section id="sms-terms" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                3. SMS messaging program (Twilio A2P 10DLC)
              </h2>
              <p>
                The following terms apply specifically to the Bad Alien LLC SMS text-messaging program.
                The program is operated by Bad Alien LLC and delivered through Twilio.
              </p>

              <h3 className="text-xl font-display font-medium text-text-heading mt-8 mb-3">
                Program description
              </h3>
              <p>
                When you opt in, Bad Alien LLC will use SMS text messages to communicate with you
                about your inquiry, consulting engagement, or booked call. Specifically, you may
                receive:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-body mt-3">
                <li>
                  <strong className="text-text-heading font-medium">Consulting follow-ups</strong> —
                  one-to-one replies and follow-up messages related to your inquiry or active
                  engagement.
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Appointment reminders</strong> —
                  reminders, confirmations, and reschedule notices for calls you book through our
                  scheduler.
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Account &amp; service notifications</strong>{' '}
                  — transactional updates about an active engagement (for example, deliverable
                  hand-offs or status changes).
                </li>
              </ul>
              <p className="mt-3">
                We do not send marketing or promotional text messages under this program.
              </p>

              <h3 className="text-xl font-display font-medium text-text-heading mt-8 mb-3">
                How to opt in
              </h3>
              <p>
                You can opt in by entering your mobile phone number on the Bad Alien contact form and
                checking the box that reads &ldquo;I agree to receive SMS text messages from Bad Alien
                LLC at the number above. Message and data rates may apply. Reply STOP to opt out, HELP
                for help. Consent is not a condition of any purchase.&rdquo; You may also opt in
                verbally or in writing during a call or email exchange, in which case we record the
                consent in our records.
              </p>
              <p className="mt-3">
                Your consent applies only to the Bad Alien LLC messaging program and is never sold,
                transferred, or shared with third parties for marketing or promotional purposes.
              </p>

              <h3 className="text-xl font-display font-medium text-text-heading mt-8 mb-3">
                Message frequency
              </h3>
              <p>
                Message frequency varies based on your interaction with us. Most subscribers receive
                fewer than 5 messages per month; subscribers in an active engagement may receive more.
              </p>

              <h3 className="text-xl font-display font-medium text-text-heading mt-8 mb-3">
                Message and data rates
              </h3>
              <p>
                Message and data rates may apply. Standard message and data rates from your wireless
                carrier apply to all messages sent and received. Bad Alien LLC does not charge for the
                messages themselves.
              </p>

              <h3 className="text-xl font-display font-medium text-text-heading mt-8 mb-3">
                Opting out
              </h3>
              <p>
                You can cancel the SMS service at any time. Reply <strong className="text-text-heading">STOP</strong>{' '}
                to any message you receive from us, and we will unsubscribe you from the program. After
                you reply STOP we will send a single confirmation message and will not send you any
                further messages unless you opt back in.
              </p>

              <h3 className="text-xl font-display font-medium text-text-heading mt-8 mb-3">
                Help and support
              </h3>
              <p>
                For help with the SMS program, reply <strong className="text-text-heading">HELP</strong>{' '}
                to any message, or contact us at:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-body mt-3">
                <li>
                  <strong className="text-text-heading font-medium">Phone / SMS:</strong> (626) 469-5839
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Email:</strong>{' '}
                  <a href="mailto:contact@badalien.works" className="text-primary hover:text-primary-light underline">
                    contact@badalien.works
                  </a>
                </li>
              </ul>

              <h3 className="text-xl font-display font-medium text-text-heading mt-8 mb-3">
                Carriers
              </h3>
              <p>
                The program is supported on most major U.S. wireless carriers, including AT&amp;T,
                T-Mobile, Verizon Wireless, Sprint, Boost, Cricket, MetroPCS, U.S. Cellular, Virgin
                Mobile, and others. Carriers are not liable for delayed or undelivered messages. T-Mobile
                is not liable for delayed or undelivered messages.
              </p>

              <h3 className="text-xl font-display font-medium text-text-heading mt-8 mb-3">
                Privacy
              </h3>
              <p>
                Information collected through the SMS program is handled as described in our{' '}
                <Link href="/privacy-policy" className="text-primary hover:text-primary-light underline">
                  Privacy Policy
                </Link>
                . As stated there, no mobile information will be shared with third parties or
                affiliates for marketing or promotional purposes, and text-messaging originator opt-in
                data and consent will not be shared with any third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                4. Booking and engagements
              </h2>
              <p>
                Submitting the contact form or booking a call does not create a consulting engagement
                or any contractual obligation on either party. Any paid engagement will be governed by
                a separate written agreement between you (or your organization) and Bad Alien LLC.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                5. Disclaimers
              </h2>
              <p>
                The Site and the Services are provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis without warranties of any kind, whether express or implied,
                including the implied warranties of merchantability, fitness for a particular purpose,
                and non-infringement. We do not warrant that the Site will be uninterrupted, error-free,
                or free of harmful components. Any content shared on the Site or in messages is for
                informational purposes only and does not constitute legal, financial, medical, or
                other professional advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                6. Limitation of liability
              </h2>
              <p>
                To the fullest extent permitted by law, Bad Alien LLC and its members, employees, and
                contractors will not be liable for any indirect, incidental, special, consequential,
                or punitive damages, or for any loss of profits, revenue, data, or goodwill, arising
                out of or in connection with your use of the Site or the Services. Our aggregate
                liability for any claim arising out of these Terms or the Services will not exceed one
                hundred U.S. dollars ($100).
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                7. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless Bad Alien LLC and its members, employees, and
                contractors from any claim, demand, loss, or damage (including reasonable attorneys&rsquo;
                fees) arising out of your breach of these Terms, your misuse of the Services, or your
                violation of any law or third-party right.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                8. Governing law
              </h2>
              <p>
                These Terms are governed by the laws of the State of California, without regard to its
                conflict-of-laws principles. Any dispute arising out of these Terms or the Services
                will be resolved in the state or federal courts located in Los Angeles County,
                California, and you consent to the personal jurisdiction of those courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                9. Changes to these Terms
              </h2>
              <p>
                We may update these Terms from time to time. The &ldquo;Effective date&rdquo; at the
                top will reflect the most recent revision. Material changes affecting the SMS program
                will be communicated to active subscribers before they take effect. Continued use of
                the Services after an update constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                10. Contact
              </h2>
              <p>
                Bad Alien LLC
                <br />
                275 Wallis Street, Pasadena, CA 91106
                <br />
                <a href="mailto:contact@badalien.works" className="text-primary hover:text-primary-light underline">
                  contact@badalien.works
                </a>
                <br />
                SMS support: (626) 469-5839
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
