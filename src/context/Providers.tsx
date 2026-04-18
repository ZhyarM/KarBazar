import CombineProviders from './CombineProviders.tsx';
import { ThemeProvider } from './ThemeContext.tsx';
import { CollapseProvider } from './SideBarContextCollapse.tsx'
import { LanguageProvider } from './LanguageContext.tsx';

const appProvider = CombineProviders(
    LanguageProvider,
    ThemeProvider,
    CollapseProvider
)

export default appProvider