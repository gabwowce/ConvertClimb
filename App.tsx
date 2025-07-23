import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProvider } from "./src/context/AppContext";
import { MaskProvider } from "./src/context/MaskContext";
import HomeScreen from "./src/screens/HomeScreen";
import SplashScreen from "./src/screens/SplashScreen"; // ← nauja
import { useGlobalFonts } from "./src/hooks/useGlobalFonts";

export default function App() {
  const fontsLoaded = useGlobalFonts();
  const [splashFinished, setSplashFinished] = useState(false);

  /* 1️⃣ Kol šriftai ar Splash animacija neužsibaigė – rodom Splash */
  if (!fontsLoaded || !splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  /* 2️⃣ Kai abu pasiruošę – startuoja jūsų tikroji UI */
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MaskProvider>
          {/* dabar galime rodyti status-barą kaip įprasta */}
          <StatusBar style="auto" />
          <HomeScreen />
        </MaskProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
