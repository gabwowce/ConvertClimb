import React, { useRef, useEffect } from "react";
import { View, Animated, Platform, ViewStyle, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type Props = {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  blueH: Animated.Animated; // mėlyno sluoksnio aukštis
  fullH: number; // visas ekrano aukštis
};

export default function MaskedIcon({ name, size, blueH, fullH }: Props) {
  const ref = useRef<View>(null);
  const offset = useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();

  /* pamatuojam absoliučią piktogramos poziciją */
  useEffect(() => {
    const measure = () =>
      ref.current?.measureInWindow((x, y, w, h) => {
        offset.setValue(fullH - (y + h) - insets.bottom + insets.bottom + 18);
      });
    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
  }, [blueH]);

  const translateY = Animated.subtract(offset, blueH);

  return (
    <View ref={ref} style={styles.stack}>
      {/* Mėlyna piktograma (fonas) */}
      <Ionicons name={name} size={size} color="#1A18BA" />

      {/* Balta kopija užmaskuojama kaip tekstai */}
      <MaskedView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        maskElement={
          <Animated.View
            style={[
              styles.maskRect,
              { top: translateY } as Animated.WithAnimatedValue<ViewStyle>,
            ]}
            pointerEvents="none"
          />
        }
      >
        <Ionicons name={name} size={size} color="#fff" />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { position: "relative" },
  maskRect: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
  },
});
