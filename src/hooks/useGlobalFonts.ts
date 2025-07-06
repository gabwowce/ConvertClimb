import { useEffect } from "react";
import { Text } from "react-native";
import { useFonts } from "expo-font";

export function useGlobalFonts() {
  const [fontsLoaded] = useFonts({
    Coolvetica: require("../../assets/fonts/coolvetica_rg.ttf"),
    CoolveticaBold: require("../../assets/fonts/CoolveticaRg-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (Text as any).defaultProps.style = [
        { fontFamily: "Coolvetica" },
        (Text as any).defaultProps.style,
      ];
    }
  }, [fontsLoaded]);

  return fontsLoaded;
}
