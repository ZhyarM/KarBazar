import CombineProviders from './CombineProviders.tsx';
import { ThemeProvider } from './ThemeContext.tsx';
import { CollapseProvider } from './SideBarContextCollapse.tsx'

const appProvider = CombineProviders(
    ThemeProvider,
    CollapseProvider
)

export default appProvider