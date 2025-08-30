import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProvider } from "./src/context/AppContext";
import { MaskProvider } from "./src/context/MaskContext";
import { useGlobalFonts } from "./src/hooks/useGlobalFonts";
import HomeScreen from "./src/screens/HomeScreen";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  const fontsLoaded = useGlobalFonts();
  const [splashFinished, setSplashFinished] = useState(false);

  if (!fontsLoaded || !splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

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
