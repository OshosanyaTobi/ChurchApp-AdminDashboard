import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => null,
});

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}) => {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    const appliedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    root.classList.add(appliedTheme);
  }, [theme]);

  const setTheme = (value) => {
    localStorage.setItem(storageKey, value);
    setThemeState(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.string,
  storageKey: PropTypes.string,
};

export { ThemeContext };
