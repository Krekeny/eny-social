"use client";

import { LinkedinLogo, InstagramLogo } from "@phosphor-icons/react";
import NavMenu from "./ui/NavMenu";
import FadeIn from "./ui/FadeIn";

export default function Footer() {
  return (
    <footer className="px-6 py-8">
      <div className="mx-auto grid max-w-[1536px] grid-cols-3 items-center gap-6 px-6">
        {/* Links */}
        <NavMenu
          items={[
            { label: "imprint", href: "/imprint" },
            { label: "contact", href: "/contact" },
            { label: "privacy", href: "https://krekeny.com/data-protection" },
          ]}
          className="flex flex-col items-start gap-0"
          baseDelay={0}
          stagger={80}
        />

        {/* Social icons */}
        <div className="flex items-center justify-center gap-4">
          <FadeIn delay={320}>
            <a
              href="https://bsky.app/profile/eny.social"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal transition-colors hover:text-dusk"
              aria-label="Bluesky"
            >
              <svg className="h-8 w-8" viewBox="0 0 568 501" fill="currentColor">
                <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 374.577 284.043 370.593 284 373.549C283.957 370.593 282.831 374.577 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0533 296.954 15.7778 224.501C9.94445 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z" />
              </svg>
            </a>
          </FadeIn>
          <FadeIn delay={400}>
            <a
              href="https://www.linkedin.com/company/krekeny/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal transition-colors hover:text-dusk"
              aria-label="LinkedIn"
            >
              <LinkedinLogo className="h-9 w-9" weight="regular" />
            </a>
          </FadeIn>
          <FadeIn delay={480}>
            <a
              href="https://instagram.com/krekeny"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal transition-colors hover:text-dusk"
              aria-label="Instagram"
            >
              <InstagramLogo className="h-9 w-9" weight="regular" />
            </a>
          </FadeIn>
        </div>

        {/* Copyright */}
        <FadeIn delay={600}>
          <p className="text-right text-sm text-charcoal">
            &copy; {new Date().getFullYear()} made by krekeny in Offenbach
          </p>
        </FadeIn>
      </div>
    </footer>
  );
}
