import type { TranslationKey } from "../i18n/translations";

type NavLinkItem = { labelKey: TranslationKey; to: string };

const navLinks: NavLinkItem[] = [
  { labelKey: "nav.home", to: "/" },
  { labelKey: "nav.browseGigs", to: "/browse-gigs" },
  { labelKey: "nav.deals", to: "/deals" },
  { labelKey: "nav.categories", to: "/categories" },
  { labelKey: "nav.about", to: "/about" },
];
export default navLinks;
