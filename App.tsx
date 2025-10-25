import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// import * as SplashScreenExpo from "expo-splash-screen";
import { AppProvider } from "./src/context/AppContext";
import { MaskProvider } from "./src/context/MaskContext";
import { useGlobalFonts } from "./src/hooks/useGlobalFonts";
import HomeScreen from "./src/screens/HomeScreen";
import SplashScreen from "./src/screens/SplashScreen";

// SplashScreenExpo.preventAutoHideAsync();

export default function App() {
  const fontsLoaded = useGlobalFonts();
  const [splashFinished, setSplashFinished] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     // Hide Expo's splash screen immediately when fonts are loaded
  //     SplashScreenExpo.hideAsync();
  //   }
  // }, [fontsLoaded]);

  const handleSplashFinish = () => {
    setSplashFinished(true);

    // Animate splash screen sliding down
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setShowSplash(false);
    });
  };

  if (!fontsLoaded) {
    return <SplashScreen onFinish={() => {}} />;
  }

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000], // Adjust this value based on screen height
  });

  return (
    <SafeAreaProvider>
      <AppProvider>
        <MaskProvider>
          <StatusBar style="auto" />
          <HomeScreen />

          {showSplash && (
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              <SplashScreen onFinish={handleSplashFinish} />
            </Animated.View>
          )}
        </MaskProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
