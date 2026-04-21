import CombineProviders from "./CombineProviders.tsx";
import { ThemeProvider } from "./ThemeContext.tsx";
import { CollapseProvider } from "./SideBarContextCollapse.tsx";
import { LanguageProvider } from "./LanguageContext.tsx";
import { UserDataProvider } from "./UserDataContext.tsx";
import { SearchProvider } from "./SearchContext.tsx";

const appProvider = CombineProviders(
  UserDataProvider,
  LanguageProvider,
  ThemeProvider,
  CollapseProvider,
  SearchProvider,
);

export default appProvider;
