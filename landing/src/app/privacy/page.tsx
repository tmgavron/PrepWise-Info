import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalLayout from "@/components/LegalLayout";
import JsonLd from "@/components/JsonLd";
import { siteGraph } from "@/lib/schema";
import { OG_IMAGE } from "@/lib/constants";

const TITLE = "Privacy Policy | How PrepWise Collects and Protects Data";
const DESCRIPTION =
  "How the PrepWise meal planning app collects, uses, stores, and protects your data, which sub-processors handle it, and the choices you have over all of it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/privacy",
  },
  // Next REPLACES the root layout's openGraph rather than merging into it, so
  // the image and card have to be restated here. Omitting them is what left
  // this page with no og:image until 2026-07-26.
  openGraph: {
    title: TITLE,
    description: "How PrepWise collects, uses, and protects your data.",
    type: "website",
    url: "/privacy",
    siteName: "PrepWise",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "How PrepWise collects, uses, and protects your data.",
    images: [OG_IMAGE],
  },
};

// A legal page has no campaign of its own: its only App Store link is the
// navbar's, which renders the sitewide default token. The sitewide nodes are
// emitted here rather than by the root layout, so this page keeps the
// Organization + WebSite that verify-seo.mjs requires on every page.
const jsonLd = siteGraph(undefined);

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <LegalLayout
        title="Privacy Policy"
        effectiveDate="March 9, 2026"
        lastUpdated="September 8, 2026"
      >
        <p>
          PrepWise LLC (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the
          PrepWise mobile application (the &ldquo;App&rdquo;). Please read this policy carefully. By using the App you
          agree to the practices described here.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">1. Information We Collect</h2>
          <p className="mb-3">We may collect the following categories of information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-pw-text">Account Information:</strong> Email address and display name when you register.</li>
            <li><strong className="text-pw-text">Profile &amp; Preferences:</strong> Daily nutrition goals, unit preferences, theme, shopping schedule, and notification settings.</li>
            <li><strong className="text-pw-text">Content You Create:</strong> Recipes, meal plans, calendar events, and pantry items you add to the App.</li>
            <li><strong className="text-pw-text">Photos &amp; Camera:</strong> Images you choose to attach to recipes. We access your camera or photo library only when you explicitly initiate an upload. Images are stored in our secure cloud storage.</li>
            <li><strong className="text-pw-text">Usage Data:</strong> App interactions, feature usage, and diagnostic information to improve performance.</li>
            <li><strong className="text-pw-text">Device Information:</strong> Device type, operating system version, and anonymous device identifiers.</li>
            <li><strong className="text-pw-text">Analytics &amp; Crash Data:</strong> Crash logs and error reports, device type, operating system version, app version, IP address, in-app usage and interaction events, and a pseudonymous (randomly generated) user identifier. This data is collected through our sub-processors described in Section 4.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide, maintain, and improve the App&apos;s features and functionality.</li>
            <li>Personalize your meal planning experience and AI-generated recommendations.</li>
            <li>Send transactional messages (e.g., password reset, account notifications).</li>
            <li>Monitor and analyze usage patterns to improve performance and reliability.</li>
            <li>Comply with legal obligations and enforce our Terms of Use.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">3. AI Features</h2>
          <p>
            The App uses <strong className="text-pw-text">OpenAI</strong> to power its AI assistant, recipe
            generation, pantry and receipt photo scanning, and nutrition estimates (including &ldquo;Generate
            Macros&rdquo; and &ldquo;Generate Meal Info&rdquo;). When you use one of these features, OpenAI processes
            the text and photos you send, along with your pantry items, saved recipe titles, planned meals, shopping
            list, display name, and food preferences, so it can generate a response. We do not use this data to train
            OpenAI&apos;s or any other third party&apos;s AI models. OpenAI is contractually required to protect your
            data under the same confidentiality and data-protection obligations as the other sub-processors described
            in Section 5.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">4. Analytics &amp; Crash Monitoring</h2>
          <p className="mb-3">
            We use the following third-party sub-processors to keep the App stable and to understand how it is used.
            Each processes data on our behalf under contractual confidentiality and data-protection obligations:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-pw-text">Sentry (crash &amp; error monitoring):</strong> Collects crash logs, error
              reports and stack traces, device type, operating system version, app version, IP address, and a pseudonymous
              user identifier. We use this data for app stability and diagnostics: detecting, diagnosing, and fixing crashes
              and errors. See the{" "}
              <a href="https://sentry.io/privacy/" className="text-pw-link underline underline-offset-2" target="_blank" rel="noopener noreferrer">Sentry Privacy Policy</a>.
            </li>
            <li>
              <strong className="text-pw-text">PostHog (product analytics):</strong> Collects in-app usage and interaction
              events, device type, operating system version, app version, IP address, and a pseudonymous user identifier. We
              use this data for product improvement: understanding feature usage and how the App performs. See the{" "}
              <a href="https://posthog.com/privacy" className="text-pw-link underline underline-offset-2" target="_blank" rel="noopener noreferrer">PostHog Privacy Policy</a>.
            </li>
          </ul>
          <p className="mt-3">
            This data is tied to a pseudonymous identifier rather than your name. We do not use it to build advertising
            profiles, and we do not sell it for money.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">5. Sharing of Information</h2>
          <p className="mb-3">We do not sell your personal information for money. We may share information with the following service providers and sub-processors, each of which processes data on our behalf under contractual confidentiality and data-protection obligations:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-pw-text">Supabase (cloud hosting, authentication &amp; storage):</strong> Stores your account, the content you create, and uploaded images, and handles sign-in.</li>
            <li><strong className="text-pw-text">Superwall (subscription management):</strong> We share your subscription status and a user identifier with Superwall to manage and display subscription offers and entitlements.</li>
            <li><strong className="text-pw-text">PostHog (product analytics)</strong> and <strong className="text-pw-text">Sentry (crash &amp; error monitoring):</strong> See Section 4 for the data collected, purposes, and links to their policies.</li>
            <li><strong className="text-pw-text">AI processing (OpenAI):</strong> As described in Section 3, we share the text and photos you submit to AI-powered features, along with pantry, recipe, calendar, and shopping-list context, your display name, and your preferences, with OpenAI so it can generate a response. OpenAI does not use this data to train its models and is held to the same confidentiality and data-protection obligations as our other sub-processors.</li>
            <li><strong className="text-pw-text">In-App Purchases:</strong> Apple processes all subscription payments. We receive limited transaction metadata (e.g., subscription status) but never your full payment details.</li>
            <li><strong className="text-pw-text">Legal Requirements:</strong> Where required by law or to protect the rights and safety of our users.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">6. Data Retention</h2>
          <p className="mb-3">
            We retain your data for as long as your account is active or as needed to provide the App. You may delete
            your account at any time from <strong className="text-pw-text">Profile &amp; Settings &rarr; Account &rarr; Delete Account</strong>.
            Upon deletion, we permanently remove your account and all associated data within 30 days.
          </p>
          <p>
            Crash and error logs collected by Sentry are retained for up to 90 days. Product-analytics events collected
            by PostHog are retained for up to 12 months. Aggregated or de-identified data that can no longer be linked to
            you may be retained for longer to help us understand long-term trends.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">7. Security</h2>
          <p>
            We use industry-standard security measures including encrypted data transmission (TLS) and secure cloud
            storage. However, no method of transmission over the internet is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">8. International Data Transfers</h2>
          <p>
            We are based in the United States, and our service providers &mdash; including PostHog and Sentry &mdash;
            process and store data on servers located in the United States. If you access the App from the European
            Economic Area (EEA), the United Kingdom, or Switzerland, your personal information will be transferred to and
            processed in the United States, which may not offer the same level of data protection as your home country.
            Because PostHog processes analytics data on US-based cloud infrastructure, EU/EEA user data leaves the EEA.
            Where we transfer personal data out of the EEA, UK, or Switzerland, we rely on appropriate safeguards such as
            the European Commission&apos;s Standard Contractual Clauses (SCCs) and the UK International Data Transfer
            Addendum. You may request a copy of the safeguards we use by contacting us at the address in Section 14.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">9. Your Privacy Rights (EEA, UK &amp; Switzerland)</h2>
          <p className="mb-3">
            If you are located in the EEA, the UK, or Switzerland, the General Data Protection Regulation (GDPR) and
            equivalent laws give you certain rights over your personal data.
          </p>
          <p className="mb-3"><strong className="text-pw-text">Legal bases for processing.</strong> We rely on the following legal bases:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-pw-text">Performance of a contract</strong> &mdash; to provide the App&apos;s core features, such as your account, meal planning, and the content you create.</li>
            <li><strong className="text-pw-text">Legitimate interests</strong> &mdash; to keep the App stable and secure and to improve our product (for example, crash monitoring and product analytics), balanced against your rights and freedoms.</li>
            <li><strong className="text-pw-text">Consent</strong> &mdash; where required by law for optional product analytics and crash reporting; you may withdraw your consent at any time in the App via <strong className="text-pw-text">Settings &rarr; Preferences &rarr; Privacy &rarr; &ldquo;Share Usage &amp; Diagnostics.&rdquo;</strong></li>
            <li><strong className="text-pw-text">Legal obligation</strong> &mdash; to comply with applicable law.</li>
          </ul>
          <p className="mt-3 mb-3"><strong className="text-pw-text">Your rights.</strong> Subject to applicable law, you have the right to access, correct, delete, restrict, or object to our processing of your personal data, the right to data portability, and the right to withdraw consent at any time. You also have the right to lodge a complaint with your local data-protection supervisory authority.</p>
          <p>
            To withdraw consent for analytics and crash reporting, turn off{" "}
            <strong className="text-pw-text">Settings &rarr; Preferences &rarr; Privacy &rarr; &ldquo;Share Usage &amp; Diagnostics&rdquo;</strong>{" "}
            in the App. To exercise your other rights, contact us at{" "}
            <a href="mailto:support@prepwise-app.com" className="text-pw-link underline underline-offset-2">support@prepwise-app.com</a>. You
            can also delete your account and all associated data at any time from{" "}
            <strong className="text-pw-text">Profile &amp; Settings &rarr; Account &rarr; Delete Account</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">10. Your California Privacy Rights (CCPA/CPRA)</h2>
          <p className="mb-3">
            If you are a California resident, the California Consumer Privacy Act, as amended by the California Privacy
            Rights Act (CCPA/CPRA), gives you the right to know what personal information we collect, to access and delete
            it, to correct inaccurate information, and to opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of your
            personal information. We do not sell your personal information for money.
          </p>
          <p className="mb-3">
            However, our use of third-party product analytics (such as PostHog) may be considered
            &ldquo;sharing&rdquo; of personal information under California law. You have the right to opt out.
          </p>
          <p className="mb-3">
            <strong className="text-pw-text">Do Not Sell or Share My Personal Information.</strong> You can opt out at any
            time through any of the following:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-pw-text">In the App (recommended):</strong> go to <strong className="text-pw-text">Settings &rarr; Preferences &rarr; Privacy</strong> and turn off <strong className="text-pw-text">&ldquo;Share Usage &amp; Diagnostics.&rdquo;</strong> This single toggle immediately stops both product analytics (PostHog) and crash/diagnostics reporting (Sentry).</li>
            <li><strong className="text-pw-text">By email:</strong> contact us at <a href="mailto:support@prepwise-app.com?subject=Do%20Not%20Sell%20or%20Share" className="text-pw-link underline underline-offset-2">support@prepwise-app.com</a> with the subject line &ldquo;Do Not Sell or Share.&rdquo;</li>
            <li><strong className="text-pw-text">Global Privacy Control (GPC):</strong> on our website, we honor GPC browser signals where technically feasible. GPC is a browser-based signal and does not apply within the native App; please use the in-app toggle above to opt out inside the App.</li>
          </ul>
          <p className="mt-3">We will not discriminate against you for exercising any of these rights.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">11. Children&apos;s Privacy</h2>
          <p>
            The App is not directed at children under 13, and we do not knowingly collect personal information from
            children under 13. If you believe a child has provided us with personal information, please contact us at{" "}
            <a href="mailto:support@prepwise-app.com" className="text-pw-link underline underline-offset-2">support@prepwise-app.com</a>{" "}
            and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">12. Third-Party Links &amp; Services</h2>
          <p>
            The App may contain links to third-party websites or services. We are not responsible for the privacy
            practices of those third parties and encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">13. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by updating
            the &ldquo;Last Updated&rdquo; date above. Continued use of the App after changes constitutes acceptance of
            the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">14. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Email: <a href="mailto:support@prepwise-app.com" className="text-pw-link underline underline-offset-2">support@prepwise-app.com</a></li>
          </ul>
        </section>
      </LegalLayout>
      <Footer />
    </>
  );
}
