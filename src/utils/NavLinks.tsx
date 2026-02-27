export type NavLinkItem = { label: string; to: string };
 
const navLinks: NavLinkItem[] = [ 
    { label: "Home", to: "/" }, 
    { label: "BrowseGigs", to: "/browsegigs" }, 
    { label: "Categories", to: "/categories" }, 
    { label: "About", to: "/about" },
];
export default navLinks;