import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ← pridėta

import { AppProvider } from "./src/context/AppContext";
import HomeScreen from "./src/screens/HomeScreen";
import { useGlobalFonts } from "./src/hooks/useGlobalFonts";
import { MaskProvider } from "./src/context/MaskContext";

export default function App() {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <MaskProvider>
          <StatusBar style="auto" />
          <HomeScreen />
        </MaskProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
