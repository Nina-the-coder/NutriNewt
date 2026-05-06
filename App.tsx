import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { NutritionAnalyticsProvider } from "./src/context/NutritionAnalyticsContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { NutritionProvider } from "./src/context/NutritionProvider";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NutritionProvider>
            <NutritionAnalyticsProvider>
              <AppNavigator />
            </NutritionAnalyticsProvider>
          </NutritionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
