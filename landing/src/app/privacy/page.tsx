import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy – PrepWise",
  description:
    "PrepWise Privacy Policy. Learn how we collect, use, and protect your data in the PrepWise meal planning app.",
  openGraph: {
    title: "Privacy Policy – PrepWise",
    description:
      "How PrepWise collects, uses, and protects your data.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <LegalLayout
        title="Privacy Policy"
        effectiveDate="March 9, 2026"
        lastUpdated="March 9, 2026"
      >
        <p>
          PrepWise (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
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
          <h2 className="text-xl font-semibold text-pw-text mb-3">3. AI Assistant</h2>
          <p>
            The App includes an AI-powered assistant that processes your messages to generate meal plans, recipe
            suggestions, and nutritional guidance. Messages sent to the assistant may be transmitted to our AI service
            provider for processing. We do not use your assistant messages to train third-party AI models.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">4. Sharing of Information</h2>
          <p className="mb-3">We do not sell your personal information. We may share information with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-pw-text">Service Providers:</strong> Cloud hosting (Supabase), AI processing, analytics, and crash reporting services that process data on our behalf under confidentiality obligations.</li>
            <li><strong className="text-pw-text">In-App Purchases:</strong> Apple processes all subscription payments. We receive limited transaction metadata (e.g., subscription status) but never your full payment details.</li>
            <li><strong className="text-pw-text">Legal Requirements:</strong> Where required by law or to protect the rights and safety of our users.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">5. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active or as needed to provide the App. You may delete
            your account at any time from <strong className="text-pw-text">Profile &amp; Settings &rarr; Account &rarr; Delete Account</strong>.
            Upon deletion, we permanently remove your account and all associated data within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">6. Security</h2>
          <p>
            We use industry-standard security measures including encrypted data transmission (TLS) and secure cloud
            storage. However, no method of transmission over the internet is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">7. Children&apos;s Privacy</h2>
          <p>
            The App is not directed at children under 13. We do not knowingly collect personal information from children
            under 13. If you believe a child has provided us with personal information, please contact us and we will
            delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">8. Your Rights</h2>
          <p className="mb-3">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal information we hold about you.</li>
            <li>Correct inaccurate information.</li>
            <li>Request deletion of your data (via in-app account deletion or by contacting us).</li>
            <li>Opt out of non-essential communications.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:support@prepwise-app.com" className="text-pw-link hover:underline">support@prepwise-app.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">9. Third-Party Links &amp; Services</h2>
          <p>
            The App may contain links to third-party websites or services. We are not responsible for the privacy
            practices of those third parties and encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by updating
            the &ldquo;Last Updated&rdquo; date above. Continued use of the App after changes constitutes acceptance of
            the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pw-text mb-3">11. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Email: <a href="mailto:support@prepwise-app.com" className="text-pw-link hover:underline">support@prepwise-app.com</a></li>
          </ul>
        </section>
      </LegalLayout>
      <Footer />
    </>
  );
}
