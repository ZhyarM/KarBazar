import { createContext, useContext, useState, type JSX, type ReactNode } from "react";

interface CollapseContextType {
  isCollapse: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<CollapseContextType | undefined>(undefined);

interface CollapseProviderProps {
  children: ReactNode;
}

export const CollapseProvider = ({ children }: CollapseProviderProps): JSX.Element => {
  const [isCollapse, setIsCollapse] = useState(false);

  const toggleCollapse = (): void => {
    setIsCollapse((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapse, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useCollapse = (): CollapseContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useCollapse must be used within a CollapseProvider");
  }
  return context;
};
