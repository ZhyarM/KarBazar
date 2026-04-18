import { RouterProvider } from "react-router-dom";
import router from "./router/Routes.tsx";
import { useTheme } from './context/ThemeContext.tsx';
import { useLanguage } from "./context/LanguageContext.tsx";
import "./App.css";
import { useEffect } from "react";

function App() {

  const { theme } = useTheme();
  const { language, direction } = useLanguage();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;

    html.classList.add("dir-transition");
    html.dir = direction;

    const timeout = window.setTimeout(() => {
      html.classList.remove("dir-transition");
    }, 280);

    return () => {
      window.clearTimeout(timeout);
      html.classList.remove("dir-transition");
    };
  }, [language, direction]);

  return <RouterProvider router={router} />;
}

export default App;
