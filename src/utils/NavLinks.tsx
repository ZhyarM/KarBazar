import type { TranslationKey } from "../i18n/translations";

 type NavLinkItem = { labelKey: TranslationKey; to: string };
 
const navLinks: NavLinkItem[] = [ 
    { labelKey: "nav.home", to: "/" }, 
    { labelKey: "nav.browseGigs", to: "/browsegigs" }, 
    { labelKey: "nav.categories", to: "/categories" }, 
    { labelKey: "nav.about", to: "/about" },
];
export default navLinks;