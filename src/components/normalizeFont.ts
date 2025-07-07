export const normalize = (size: number) => moderateScale(size, 0.25); // 0.25 – labiau fiksuotas

// utils/normalize.ts
import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Sukuriame bazinį ekraną (pvz. iPhone 11 – 414x896 dp)
const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

export const scale = (size: number) =>
  (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Naudojimui: scale (plotis), verticalScale (aukštis), moderateScale (švelnesnis)
