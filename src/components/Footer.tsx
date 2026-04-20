import type { JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
  faDribbble,
} from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "../context/LanguageContext.tsx";

function Footer(): JSX.Element {
  const { t } = useLanguage();

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
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.categories.graphicsDesign")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.categories.digitalMarketing")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.categories.writingTranslation")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.categories.videoAnimation")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.categories.programmingTech")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-primary-muted)">
              {t("footer.section.about")}
            </h3>
            <ul className="space-y-2 text-sm text-(--color-primary-muted)">
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.about.aboutUs")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.about.contact")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.about.faq")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.about.careers")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.about.pressNews")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-primary-muted)">
              {t("footer.section.support")}
            </h3>
            <ul className="space-y-2 text-sm text-(--color-primary-muted)">
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.support.helpSupport")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.support.trustSafety")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.support.selling")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.support.buying")}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-(--color-primary)">
                  {t("footer.support.termsService")}
                </a>
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
            <a href="#" className="transition hover:text-(--color-primary)">
              {t("footer.bottom.terms")}
            </a>
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
