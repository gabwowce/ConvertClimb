import React, { useRef, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  LayoutChangeEvent,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  THUMB,
  R,
  SENS,
  STEP_PCT,
  TOP_PAD,
  BOTTOM_PAD,
} from "./config/sliderConfig";
import { useApp } from "../context/AppContext";
import { GRADES } from "../data/grades";

type Props = {
  onChange?: (pct: number) => void;
  onLayoutHeight: (h: number) => void;
};

export default function VerticalSlider({ onChange, onLayoutHeight }: Props) {
  const [fullHeight, setFullHeight] = useState(0);
  const start = useRef(0);
  const { setGradeAndSyncAnim, gradeIdx, stepUp, stepDown, anim } = useApp();
    const start = useRef(0);
  const lastIdx = useRef<number>(gradeIdx);
 const { setGradeAndSyncAnim, stepUp, stepDown, anim } = useApp();

  const usableH = Math.max(fullHeight - TOP_PAD - BOTTOM_PAD, 1);

  /* --- išmatavimai --- */
  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setFullHeight(h);
    onLayoutHeight(h);
  };

  /* --- apvaliname iki artimiausio žingsnio --- */
  const snap = (raw: number) => Math.round(raw / STEP_PCT) * STEP_PCT;

  /* --- PanResponder --- */
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          start.current = (anim as any).__getValue();
        },
        onPanResponderMove: (_, g) => {
          const raw = start.current - (g.dy * SENS) / usableH; // ↓ didina anim
          const clamped = Math.max(0, Math.min(raw, 1));
          anim.setValue(clamped);
          // onChange?.(clamped);
        },
        onPanResponderRelease: () => {
          const raw = (anim as any).__getValue();
          const sn = snap(raw);
          Animated.timing(anim, {
            toValue: sn,
            duration: 140,
            useNativeDriver: false,
          }).start();
          onChange?.(sn);
        },
      }),
    [anim, usableH]
  );

  /* --- vizualinė geometrija --- */
  const blueH = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [BOTTOM_PAD, fullHeight - TOP_PAD],
  });
  const thumbBottom = Animated.subtract(blueH, R);

  /* --- JSX --- */
  return (
    <View style={styles.layer} onLayout={onLayout} pointerEvents="box-none">
      {/* Balta sritis (viršuje): –1 žingsnis */}
      <TouchableWithoutFeedback onPress={stepUp}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      {/* Mėlyna apačia (aukštis reaguoja į anim) */}
      <TouchableWithoutFeedback onPress={stepDown}>
        <Animated.View style={[styles.blue, { height: blueH }]} />
      </TouchableWithoutFeedback>

      {/* Rankenėlė */}
      <Animated.View
        {...pan.panHandlers}
        style={[styles.thumb, { bottom: thumbBottom }]}
      >
        <Ionicons name="chevron-up-outline" size={18} color="#000" />
        <View style={styles.line} />
        <Ionicons name="chevron-down-outline" size={18} color="#000" />
      </Animated.View>
    </View>
  );
}

/* --- stiliai --- */
const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject },
  blue: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: 23,
    height: 2,
    backgroundColor: "#F2F2F2",
  },
});
