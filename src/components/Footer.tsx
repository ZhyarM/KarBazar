import type { JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
  faDribbble,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";

function Footer(): JSX.Element {
  const { t } = useLanguage();
  const categoryLinks = [
    {
      label: t("footer.categories.graphicsDesign"),
      category: "Graphics & Design",
    },
    {
      label: t("footer.categories.digitalMarketing"),
      category: "Digital Marketing",
    },
    {
      label: t("footer.categories.writingTranslation"),
      category: "Writing & Translation",
    },
    {
      label: t("footer.categories.videoAnimation"),
      category: "Video & Animation",
    },
    {
      label: t("footer.categories.programmingTech"),
      category: "Programming & Tech",
    },
  ];

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
            {t("footer.description")}
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
              {t("footer.section.categories")}
            </h3>
            <ul className="space-y-2 text-sm text-(--color-text-muted)">
              {categoryLinks.map((item) => (
                <li key={item.category}>
                  <Link
                    to={`/browse-gigs?category=${encodeURIComponent(item.category)}`}
                    className="transition hover:text-(--color-primary)"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-primary-muted)">
              {t("footer.section.about")}
            </h3>
            <ul className="space-y-2 text-sm text-(--color-primary-muted)">
              <li>
                <Link
                  to="/about"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.about.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.about.contact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.about.faq")}
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.about.careers")}
                </Link>
              </li>
              <li>
                <Link
                  to="/press-news"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.about.pressNews")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-primary-muted)">
              {t("footer.section.support")}
            </h3>
            <ul className="space-y-2 text-sm text-(--color-primary-muted)">
              <li>
                <Link
                  to="/help-support"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.support.helpSupport")}
                </Link>
              </li>
              <li>
                <Link
                  to="/trust-safety"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.support.trustSafety")}
                </Link>
              </li>
              <li>
                <Link
                  to="/selling-on-karbazar"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.support.selling")}
                </Link>
              </li>
              <li>
                <Link
                  to="/buying-on-karbazar"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.support.buying")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="transition hover:text-(--color-primary)"
                >
                  {t("footer.support.termsService")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-(--color-border)">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-xs text-(--color-primary-muted) md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {new Date().getFullYear()} KarBazar.{" "}
            {t("footer.bottom.rightsReserved")}
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              to="/terms-of-service"
              className="transition hover:text-(--color-primary)"
            >
              {t("footer.bottom.terms")}
            </Link>
            <a href="#" className="transition hover:text-(--color-primary)">
              {t("footer.bottom.privacy")}
            </a>
            <a href="#" className="transition hover:text-(--color-primary)">
              {t("footer.bottom.cookies")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
