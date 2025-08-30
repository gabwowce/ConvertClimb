import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TextStyle, View } from "react-native";
import { useMask } from "../context/MaskContext";
import { getLetterSpacing } from "../helpers/getLetterSpacing";
import { normalize } from "./normalizeFont";

const BASE = "#1A18BA";
const MASK = "#fff";
const F = normalize(64);

export default function MaskedText({
  text,
  icon,
  blueH,
  style,
  baseColor = BASE,
  maskedColor = MASK,
}: {
  text?: string;
  icon?: { name: string; size?: number };
  blueH: Animated.Animated;
  style?: TextStyle;
  baseColor?: string;
  maskedColor?: string;
}) {
  const { blueY } = useMask();
  const ref = useRef<View>(null);
  const [yPos, setYPos] = useState(0);

  useEffect(() => {
    const measure = () =>
      ref.current?.measureInWindow((x, y) => {
        setYPos(y);
      });

    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
  }, [text, icon, blueH]);
  const translateY = Animated.subtract(blueY, yPos);

  const render = (c: string) =>
    icon ? (
      <Ionicons name={icon.name} size={icon.size ?? 20} color={c} />
    ) : (
      <Text
        style={[
          {
            color: c,
            fontSize: F,
            letterSpacing: getLetterSpacing(F),
            fontFamily: "CoolveticaBold",
          },
          style,
        ]}
      >
        {text}
      </Text>
    );

  return (
    <View style={styles.stack}>
      <View ref={ref} collapsable={false}>
        {render(baseColor)}
      </View>

      <MaskedView
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        maskElement={
          <Animated.View
            style={[styles.mask, { top: translateY, height: blueH as any }]}
          />
        }
      >
        {render(maskedColor)}
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { position: "relative", alignSelf: "flex-end" },
  mask: { position: "absolute", left: 0, right: 0, backgroundColor: "black" },
});
