import { RouterProvider } from "react-router-dom";
import router from "./router/Routes.tsx";
import { useTheme } from './context/ThemeContext.tsx';
import "./App.css";
import { useEffect } from "react";

function App() {

  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme
  },[theme])

  return <RouterProvider router={router} />;
}

export default App;
