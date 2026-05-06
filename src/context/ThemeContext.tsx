import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DarkTheme,
  LightTheme,
  BlackTheme,
  OceanTheme,
} from "../theme/themes";

type ThemeName = "dark" | "light" | "black" | "ocean";

const themeMap = {
  dark: DarkTheme,
  light: LightTheme,
  black: BlackTheme,
  ocean: OceanTheme,
};

const ThemeContext = createContext<any>(null);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [loaded, setLoaded] = useState(false);

  /* 🔥 LOAD SAVED THEME */
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("APP_THEME");
      if (saved && themeMap[saved as ThemeName]) {
        setThemeState(saved as ThemeName);
      }
      setLoaded(true);
    };

    loadTheme();
  }, []);

  /* 🔥 SAVE THEME */
  const setTheme = async (newTheme: ThemeName) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem("APP_THEME", newTheme);
  };

  const colors = themeMap[theme];

  // Prevent flicker before loading
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};