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
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:px-6 lg:flex-row lg:justify-between lg:py-14">
        <div className="max-w-md space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              K
            </div>
            <span className="text-xl font-semibold tracking-tight">
              KarBazar
            </span>
          </div>

          <p className="text-sm leading-relaxed text-gray-500">
            Connect with talented freelancers worldwide. Find the perfect
            professional for your project or offer your skills to clients
            globally.
          </p>

          <div className="flex gap-3">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm transition hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faFacebookF} className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm transition hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm transition hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm transition hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faLinkedinIn} className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm transition hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faDribbble} className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Graphics &amp; Design
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Digital Marketing
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Writing &amp; Translation
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Video &amp; Animation
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Programming &amp; Tech
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
              About
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Press &amp; News
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Help &amp; Support
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Trust &amp; Safety
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Selling on KarBazar
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Buying on KarBazar
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-xs text-gray-600 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} KarBazar. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="transition hover:text-blue-600">
              Terms
            </a>
            <a href="#" className="transition hover:text-blue-600">
              Privacy
            </a>
            <a href="#" className="transition hover:text-blue-600">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
