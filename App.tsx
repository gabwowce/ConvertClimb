import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ← pridėta

import { AppProvider } from "./src/context/AppContext";
import HomeScreen from "./src/screens/HomeScreen";
import { useGlobalFonts } from "./src/hooks/useGlobalFonts";

export default function App() {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="auto" />
        <HomeScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
}
