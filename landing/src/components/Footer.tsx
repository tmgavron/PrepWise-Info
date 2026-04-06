"use client";

import { LEGAL_LINKS, SOCIAL_LINKS, SUPPORT_EMAIL } from "@/lib/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.6a6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 3.76.92V6.17a4.83 4.83 0 0 1 0 .52z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-pw-border-soft py-12 px-6">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo & copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img src="/logo.svg" alt="PrepWise" className="h-7" />
          <p className="text-pw-text-muted text-xs">
            &copy; 2026 PrepWise. All rights reserved.
          </p>
        </div>

        {/* Legal links */}
        <div className="flex items-center gap-6 text-sm text-pw-text-subtle">
          <a
            href={LEGAL_LINKS.privacy}
            className="hover:text-pw-text transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a
            href={LEGAL_LINKS.terms}
            className="hover:text-pw-text transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
          <a
            href={SUPPORT_EMAIL}
            className="hover:text-pw-text transition-colors"
          >
            Support
          </a>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
          {/* TODO: Update social URLs when accounts are created */}
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-pw-text-muted hover:text-pw-text transition-colors"
          >
            <InstagramIcon className="w-5 h-5" />
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-pw-text-muted hover:text-pw-text transition-colors"
          >
            <TikTokIcon className="w-5 h-5" />
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="text-pw-text-muted hover:text-pw-text transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
