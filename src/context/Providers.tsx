import CombineProviders from "./CombineProviders.tsx";
import { ThemeProvider } from "./ThemeContext.tsx";
import { CollapseProvider } from "./SideBarContextCollapse.tsx";
import { LanguageProvider } from "./LanguageContext.tsx";
import { UserDataProvider } from "./UserDataContext.tsx";

const appProvider = CombineProviders(
  UserDataProvider,
  LanguageProvider,
  ThemeProvider,
  CollapseProvider,
);

export default appProvider;
