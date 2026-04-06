import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use – PrepWise",
  description:
    "PrepWise Terms of Use (EULA). Rules and conditions for using the PrepWise AI-powered meal planning app.",
  openGraph: {
    title: "Terms of Use – PrepWise",
    description:
      "Terms and conditions for using the PrepWise app.",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
          <p className="text-pw-text-muted text-sm mb-10">
            Effective Date: March 9, 2026 &middot; Last Updated: March 9, 2026
          </p>

          <div className="space-y-8 text-pw-text-subtle leading-relaxed">
            <p>
              These Terms of Use (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
              (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and PrepWise (&ldquo;we,&rdquo;
              &ldquo;our,&rdquo; or &ldquo;us&rdquo;) governing your use of the PrepWise mobile application (the
              &ldquo;App&rdquo;). By downloading, installing, or using the App, you agree to be bound by these Terms. If
              you do not agree, do not use the App.
            </p>

            <div className="rounded-lg border border-pw-warning/30 bg-pw-warning/5 p-4 text-sm">
              <strong className="text-pw-warning">Apple EULA Notice:</strong>{" "}
              <span className="text-pw-text-subtle">
                These Terms incorporate the Apple Licensed Application End User License Agreement (LAEULA) by reference. In
                any conflict between these Terms and the LAEULA, the LAEULA governs with respect to Apple&apos;s role. Apple
                is not responsible for the App or its content.
              </span>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">1. Eligibility</h2>
              <p>
                You must be at least 13 years old to use this App. By using the App, you represent that you meet this age
                requirement. If you are under 18, you must have the consent of a parent or legal guardian.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">2. Account Registration</h2>
              <p className="mb-3">To access most features you must create an account. You agree to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide accurate and current information during registration.</li>
                <li>Maintain the confidentiality of your login credentials.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
                <li>Be responsible for all activity that occurs under your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">3. Subscriptions &amp; In-App Purchases</h2>
              <p className="mb-3">
                PrepWise offers auto-renewing subscription plans that unlock premium features. By purchasing a subscription:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Payment will be charged to your Apple ID account at confirmation of purchase.</li>
                <li>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.</li>
                <li>Your account will be charged for renewal within 24 hours prior to the end of the current period at the rate of your selected plan.</li>
                <li>Free trial periods, if offered, will convert to a paid subscription at the end of the trial unless cancelled before the trial ends.</li>
                <li>You can manage and cancel your subscription at any time in your <strong className="text-pw-text">Apple ID Account Settings</strong>. Cancellation takes effect at the end of the current billing period.</li>
                <li>Refunds are handled by Apple in accordance with their policies.</li>
              </ul>
              <p className="mt-3">
                To restore a previously purchased subscription, use the <strong className="text-pw-text">Restore Purchases</strong> button
                in <strong className="text-pw-text">Profile &amp; Settings &rarr; Subscription</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">4. License Grant</h2>
              <p>
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to
                download and use the App on Apple-branded devices that you own or control, solely for your personal,
                non-commercial use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">5. Prohibited Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Reverse engineer, decompile, or disassemble any portion of the App.</li>
                <li>Use the App for any unlawful purpose or in violation of any applicable laws.</li>
                <li>Upload or share content that is illegal, harmful, defamatory, obscene, or infringes any third-party rights.</li>
                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts.</li>
                <li>Use automated scripts, bots, or scrapers to access the App.</li>
                <li>Resell or sublicense access to the App.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">6. User Content</h2>
              <p>
                You retain ownership of content you create in the App (recipes, meal plans, notes, etc.). By submitting
                content, you grant us a limited license to store, process, and display that content solely to provide the
                App&apos;s services to you. We do not claim ownership of your content and do not share it with other users
                without your permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">7. AI-Generated Content Disclaimer</h2>
              <p>
                The App includes an AI assistant that generates meal plans, recipes, and nutritional information. This
                content is for informational purposes only and is not a substitute for professional dietary, medical, or
                nutritional advice. We make no warranties regarding the accuracy, completeness, or suitability of
                AI-generated content for any specific dietary needs or health conditions. Always consult a qualified
                professional before making significant changes to your diet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">8. Intellectual Property</h2>
              <p>
                All App content, features, and functionality (excluding your user content) — including but not limited to
                text, graphics, logos, icons, and software — are owned by or licensed to PrepWise and are protected by
                applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without
                our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">9. Privacy</h2>
              <p>
                Your use of the App is subject to our <a href="/privacy" className="text-pw-link hover:underline">Privacy Policy</a>,
                which is incorporated into these Terms by reference. By using the App, you consent to the data practices
                described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">10. Disclaimers</h2>
              <p className="uppercase text-sm">
                The App is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
                express or implied, including warranties of merchantability, fitness for a particular purpose, or
                non-infringement. We do not warrant that the App will be uninterrupted, error-free, or free of viruses or
                other harmful components.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">11. Limitation of Liability</h2>
              <p className="uppercase text-sm">
                To the fullest extent permitted by law, PrepWise and its officers, directors, employees, and agents shall
                not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your
                use of or inability to use the App, even if we have been advised of the possibility of such damages. Our
                total liability to you for any claims arising from these Terms shall not exceed the amount you paid us in
                the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">12. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless PrepWise and its affiliates from any claims, damages, losses,
                liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from your use of the
                App, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">13. Account Deletion</h2>
              <p>
                You may delete your account at any time from <strong className="text-pw-text">Profile &amp; Settings &rarr;
                Account &rarr; Delete Account</strong>. Deletion is permanent and cannot be undone. Upon deletion, all your
                data will be permanently removed from our systems within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">14. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at our sole discretion, without notice, for
                conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon
                termination, your license to use the App immediately ends.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">15. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you of material changes by updating the
                &ldquo;Last Updated&rdquo; date. Continued use of the App after changes constitutes your acceptance of the
                updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">16. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States, without
                regard to conflict of law principles. Any disputes shall be resolved in a court of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-pw-text mb-3">17. Contact Us</h2>
              <p>If you have questions about these Terms, please contact us:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Email: <a href="mailto:support@prepwise.app" className="text-pw-link hover:underline">support@prepwise.app</a></li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
