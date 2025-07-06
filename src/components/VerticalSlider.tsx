// components/VerticalSlider.tsx
import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";
import {
  THUMB,
  R,
  SENS,
  STEP_PCT,
  TOP_PAD,
  BOTTOM_PAD,
} from "./config/sliderConfig";

type Props = {
  anim: Animated.Value; // bendras Animated.Value (0–1)
  onChange?: (pct: number) => void;
  onLayoutHeight: (h: number) => void; // pranešam aukštį į HomeScreen
};

export default function VerticalSlider({
  anim,
  onChange,
  onLayoutHeight,
}: Props) {
  const start = useRef(0);

  /* aukštį gaunam iš tėvo per onLayout */
  const usableHRef = useRef(1); // ref tam, kad panResponder visuomet turėtų naujausią

  const onLayout = (e: LayoutChangeEvent) => {
    const fullH = e.nativeEvent.layout.height;
    onLayoutHeight(fullH);
    usableHRef.current = Math.max(fullH - TOP_PAD - BOTTOM_PAD, 1);
  };

  const snap = (raw: number) => Math.round(raw / STEP_PCT) * STEP_PCT;

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          start.current = (anim as any).__getValue();
        },
        onPanResponderMove: (_, g) => {
          const usableH = usableHRef.current;
          const raw = start.current - (g.dy * SENS) / usableH;
          const clamped = Math.max(0, Math.min(raw, 1));
          anim.setValue(clamped);
          onChange?.(1 - clamped);
        },
        onPanResponderRelease: () => {
          const raw = (anim as any).__getValue();
          const sn = snap(raw);
          Animated.timing(anim, {
            toValue: sn,
            duration: 140,
            useNativeDriver: false,
          }).start();
          onChange?.(1 - sn);
        },
      }),
    [anim]
  );

  /* vizualai – mėlyna ir thumb (naudojame tėvo aukštį) */
  const blueH = Animated.add(
    Animated.multiply(anim, usableHRef.current),
    BOTTOM_PAD
  );
  const thumbBottom = Animated.subtract(blueH, R);

  return (
    <View style={styles.layer} onLayout={onLayout} pointerEvents="box-none">
      <Animated.View style={[styles.blue, { height: blueH }]} />
      <Animated.View
        {...pan.panHandlers}
        style={[styles.thumb, { bottom: thumbBottom }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject },
  blue: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#061FBF",
  },
  thumb: {
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: 50,
    width: THUMB,
    height: THUMB,
    borderRadius: R,
    backgroundColor: "#fff",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});
