import { useWindowDimensions } from "react-native";

export function useHorizontalPad(): number {
  const { width } = useWindowDimensions();

  if (width < 600) return 24; // phone
  if (width < 900) return 90; // small tablet
  if (width < 1200) return 140; // large tablet
  return Math.min(width * 0.2, 200); // very wide
}
