import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Bad Alien',
  description:
    'How Bad Alien LLC collects, uses, and protects information you provide through the website, contact form, and SMS messaging program.',
  alternates: { canonical: '/privacy-policy' },
};

const EFFECTIVE_DATE = 'April 29, 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-base relative grain-texture">
      <Header />

      <main id="main-content" className="pt-32 pb-24 px-6">
        <article className="container mx-auto max-w-3xl">
          <header className="mb-12">
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary block mb-4">
              Legal / Privacy
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-light tracking-tight text-text-heading mb-4">
              Privacy Policy
            </h1>
            <p className="text-text-secondary font-sans text-sm">
              Effective date: {EFFECTIVE_DATE}
            </p>
          </header>

          <div className="space-y-10 font-sans text-text-body leading-relaxed text-base md:text-lg">
            <section>
              <p>
                This Privacy Policy describes how Bad Alien LLC (&ldquo;Bad Alien,&rdquo; &ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and shares information when you
                visit{' '}
                <a href="https://badalien.works" className="text-primary hover:text-primary-light underline">
                  badalien.works
                </a>{' '}
                and any related subdomains, submit our contact form, book a call, or receive SMS text
                messages from us. By using the site or our messaging program you agree to this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4 mt-2">
                1. Who we are
              </h2>
              <p>
                Bad Alien LLC is a California limited liability company providing AI consulting, custom
                software, and creative technology services.
              </p>
              <p className="mt-3">
                <strong className="text-text-heading font-medium">Mailing address:</strong> 275 Wallis
                Street, Pasadena, CA 91106
                <br />
                <strong className="text-text-heading font-medium">Email:</strong>{' '}
                <a href="mailto:contact@badalien.works" className="text-primary hover:text-primary-light underline">
                  contact@badalien.works
                </a>
                <br />
                <strong className="text-text-heading font-medium">SMS support:</strong> (626) 469-5839
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                2. Information we collect
              </h2>
              <p className="mb-3">We collect only what we need to respond to you and provide services.</p>
              <h3 className="text-xl font-display font-light text-text-heading mt-6 mb-2">
                Information you provide
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-text-body">
                <li>
                  <strong className="text-text-heading font-medium">Contact form:</strong> name, email
                  address, company name (optional), service interest (optional), and the contents of
                  your message.
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Phone number &amp; SMS consent:</strong>{' '}
                  if you choose to receive text messages from us, your mobile phone number and an
                  affirmative opt-in (a checkbox on the contact form or other written/verbal consent).
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Booking information:</strong> when
                  you book a call through our scheduling tool (Cal.com), Cal.com collects the name,
                  email, and any answers to booking questions and shares them with us.
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Correspondence:</strong> emails and
                  text messages you send to us.
                </li>
              </ul>

              <h3 className="text-xl font-display font-light text-text-heading mt-6 mb-2">
                Information collected automatically
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-text-body">
                <li>
                  Basic technical information from your browser: IP address, user-agent, referring page,
                  and pages viewed. We use this for security, debugging, and aggregate traffic
                  measurement.
                </li>
                <li>
                  Cookies and similar technologies that are strictly necessary for the site to function
                  (for example, session and security cookies). We do not currently use third-party
                  advertising or cross-site tracking cookies.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                3. How we use information
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-text-body">
                <li>To respond to inquiries you submit through the contact form or by email.</li>
                <li>To schedule, confirm, and follow up on calls and consulting engagements.</li>
                <li>
                  To send transactional and account-related SMS messages you have opted in to receive
                  (consulting follow-ups, appointment reminders, and service notifications).
                </li>
                <li>To operate, secure, and improve the website.</li>
                <li>To comply with legal obligations and enforce our Terms.</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information, and we do not use it for cross-context
                behavioral advertising.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                4. SMS / text messaging — mobile information sharing
              </h2>
              <div className="rounded-lg border border-border bg-surface p-6">
                <p className="text-text-heading font-medium">
                  No mobile information will be shared with third parties or affiliates for marketing or
                  promotional purposes.
                </p>
                <p className="mt-3">
                  All categories of mobile information described in this policy exclude text-messaging
                  originator opt-in data and consent; this information will not be shared with any
                  third parties.
                </p>
                <p className="mt-3">
                  Information sharing to subcontractors that support the messaging program — such as
                  our SMS platform provider (Twilio) and our customer-support and email tooling — is
                  permitted solely to deliver the service you requested. Those providers are
                  contractually restricted to using your mobile information only on our behalf.
                </p>
              </div>
              <p className="mt-4">
                See our{' '}
                <Link href="/terms-and-conditions#sms-terms" className="text-primary hover:text-primary-light underline">
                  SMS Messaging Terms
                </Link>{' '}
                for the full description of the program, message frequency, and how to opt out.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                5. Service providers we use
              </h2>
              <p className="mb-3">
                We rely on a small set of vetted service providers to operate the site and our
                messaging program. They process data on our behalf under contracts that limit their
                use of that data to providing the service.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-body">
                <li>
                  <strong className="text-text-heading font-medium">Vercel</strong> — website hosting and
                  request logs.
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Resend</strong> — delivery of
                  transactional email triggered by the contact form.
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Cal.com</strong> — call scheduling
                  and booking confirmations.
                </li>
                <li>
                  <strong className="text-text-heading font-medium">Twilio</strong> — SMS message
                  delivery and carrier compliance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                6. When we may disclose information
              </h2>
              <p>We may disclose information outside the categories above only when:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-body mt-3">
                <li>You direct us to (for example, by asking us to make an introduction).</li>
                <li>
                  Required by law, subpoena, or to respond to a lawful request from public authorities.
                </li>
                <li>
                  Necessary to investigate or prevent fraud, security incidents, or violations of our
                  Terms.
                </li>
                <li>
                  In connection with a merger, acquisition, financing, or sale of assets — in which
                  case we will require the recipient to honor this Privacy Policy.
                </li>
              </ul>
              <p className="mt-3">
                As stated above, mobile phone numbers and SMS opt-in data are excluded from any
                transfer for marketing or promotional purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                7. Data retention
              </h2>
              <p>
                We keep contact-form submissions, booking records, and SMS opt-in records for as long
                as needed to provide our services and to maintain compliance records (typically up to
                three years from your last interaction with us, unless a longer period is required by
                law). You can ask us to delete your information at any time using the contact details
                in Section 1.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                8. Your rights
              </h2>
              <p>Depending on where you live you may have rights to:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-body mt-3">
                <li>Request access to or a copy of the information we hold about you.</li>
                <li>Request that we correct or delete your information.</li>
                <li>Withdraw your SMS consent at any time by replying STOP to any text we send.</li>
                <li>
                  Opt out of email follow-ups by replying to any email asking us to stop, or by emailing{' '}
                  <a href="mailto:contact@badalien.works" className="text-primary hover:text-primary-light underline">
                    contact@badalien.works
                  </a>.
                </li>
              </ul>
              <p className="mt-3">
                California residents have additional rights under the California Consumer Privacy Act
                (CCPA/CPRA), including the right to know what personal information we collect, the
                right to delete it, and the right not to be discriminated against for exercising those
                rights. We do not sell or share personal information as those terms are defined under
                the CCPA. To submit a request, email{' '}
                <a href="mailto:contact@badalien.works" className="text-primary hover:text-primary-light underline">
                  contact@badalien.works
                </a>{' '}
                with the subject line &ldquo;Privacy Request.&rdquo;
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                9. Security
              </h2>
              <p>
                We use reasonable administrative, technical, and physical safeguards to protect your
                information, including encrypted transport (HTTPS) and access controls on our
                back-office tooling. No method of transmission over the internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                10. Children&rsquo;s privacy
              </h2>
              <p>
                The site and our messaging program are not directed to children under 13, and we do not
                knowingly collect personal information from children. If you believe a child has
                provided us with information, please contact us so we can delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                11. International users
              </h2>
              <p>
                Bad Alien LLC operates from the United States. If you access the site or opt in to our
                messaging program from outside the United States, you understand that your information
                will be processed in the United States, where data-protection laws may differ from
                those of your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                12. Changes to this policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. The &ldquo;Effective date&rdquo;
                at the top will reflect the most recent revision. Material changes that affect SMS
                consent will be communicated to active subscribers before they take effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-light text-text-heading mb-4">
                13. Contact us
              </h2>
              <p>
                Questions or requests about this Privacy Policy can be sent to{' '}
                <a href="mailto:contact@badalien.works" className="text-primary hover:text-primary-light underline">
                  contact@badalien.works
                </a>{' '}
                or by mail to Bad Alien LLC, 275 Wallis Street, Pasadena, CA 91106.
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
