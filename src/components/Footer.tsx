import type { JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
  faDribbble,
} from "@fortawesome/free-brands-svg-icons";

function Footer(): JSX.Element {
  return (
    <footer className="bg-(--color-bg) text-(--color-text) border-t border-t-(--color-text)">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:px-6 lg:flex-row lg:justify-between lg:py-14">
        <div className="max-w-md space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-primary) text-lg font-bold text-(--color-text-inverse)">
              K
            </div>
            <span className="text-xl font-semibold tracking-tight">
              KarBazar
            </span>
          </div>

          <p className="text-sm leading-relaxed text-(--color-text-muted)">
            Connect with talented freelancers worldwide. Find the perfect
            professional for your project or offer your skills to clients
            globally.
          </p>

          <div className="flex gap-3">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-card) text-(--color-text) shadow-sm transition hover:bg-(--color-card-hover)"
            >
              <FontAwesomeIcon icon={faFacebookF} className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-card) text-(--color-text) shadow-sm transition hover:bg-(--color-card-hover)"
            >
              <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-card) text-(--color-text) shadow-sm transition hover:bg-(--color-card-hover)"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-card) text-(--color-text) shadow-sm transition hover:bg-(--color-card-hover)"
            >
              <FontAwesomeIcon icon={faLinkedinIn} className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-card) text-(--color-text) shadow-sm transition hover:bg-(--color-card-hover)"
            >
              <FontAwesomeIcon icon={faDribbble} className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-text-muted)">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-(--color-text-muted)">
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Graphics &amp; Design
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Digital Marketing
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Writing &amp; Translation
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Video &amp; Animation
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Programming &amp; Tech
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-primary-muted)">
              About
            </h3>
            <ul className="space-y-2 text-sm text-(--color-primary-muted)">
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Press &amp; News
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-primary-muted)">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-(--color-primary-muted)">
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Help &amp; Support
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Trust &amp; Safety
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Selling on KarBazar
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Buying on KarBazar
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-(--color-border)">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-xs text-(--color-primary-muted) md:flex-row md:items-center md:justify-between md:px-6">
          <p>© 2024 KarBazar. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="transition hover:text-(--color-primary)">
              Terms
            </a>
            <a href="#" className="transition hover:text-(--color-primary)">
              Privacy
            </a>
            <a href="#" className="transition hover:text-(--color-primary)">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
