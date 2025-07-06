import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NUM_LINES = 33;

export default function BackgroundLines() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");

  const safeHeight = windowHeight - insets.top - insets.bottom;
  const lineSpacing = safeHeight / NUM_LINES;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { top: insets.top, bottom: insets.bottom },
      ]}
    >
      {Array.from({ length: NUM_LINES }).map((_, i) => (
        <View key={i} style={[styles.line, { top: i * lineSpacing }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: 1,
    backgroundColor: "rgba(102,102,102,0.05)",
  },
});
