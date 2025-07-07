import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ViewStyle,
  LayoutRectangle,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { normalize } from "./normalizeFont";

const FONT = normalize(64);
const globalMargin = 0;

type Props = {
  txt: string;
  blueH: Animated.Animated;
  fullH: number;
};

export default function MaskedText({ txt, blueH, fullH }: Props) {
  const ref = useRef<View>(null);
  const offset = useRef(new Animated.Value(0)).current;
  const [textH, setTextH] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const measure = () =>
      ref.current?.measureInWindow((x, y, w, h) => {
        const value = fullH - (y + h) + insets.top - insets.bottom;
        console.log("x:", x, "y:", y, "w:", w, "h:", h);
        console.log("------ MASK DEBUG START ------");
        console.log("fullH (ekrano aukštis be status bar):", fullH);
        console.log("Text y (nuo viršaus):", y);
        console.log("Text height (h):", h);
        console.log("Insets.top:", insets.top);
        console.log("Insets.bottom:", insets.bottom);
        console.log("Skaičiuotas offset (iki apačios):", value);
        console.log("------ MASK DEBUG END --------");

        offset.setValue(value);
        setTextH(h);
      });

    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
  }, [txt, fullH]);

  const translateY = Animated.subtract(offset, blueH);

  useEffect(() => {
    const id = blueH.addListener(({ value }) => {
      offset.addListener(({ value: off }) => {
        console.log(
          "🔵 blueH:",
          value,
          "↕️ offset:",
          off,
          "➡️ translateY:",
          off - value
        );
      });
    });
    return () => blueH.removeListener(id);
  }, [blueH]);

  return (
    <View
      style={styles.stack}
      onLayout={(e) => {
        console.log("📦 View (stack) height:", e.nativeEvent.layout.height);
      }}
    >
      <Text
        ref={ref}
        style={styles.blue}
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          console.log("🔤 Text height:", layout.height);
          console.log("🔝 Text y (from top of parent):", layout.y);
        }}
      >
        {txt}
      </Text>

      <MaskedView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        maskElement={
          <Animated.View
            style={[
              styles.maskRect,
              {
                top: translateY,
                height: blueH as unknown as number | string,
              } as Animated.WithAnimatedValue<ViewStyle>,
            ]}
          />
        }
      >
        <Text style={styles.white}>{txt}</Text>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { position: "relative" },

  blue: {
    fontSize: FONT,
    color: "#1A18BA",
    fontFamily: "CoolveticaBold",
    marginTop: globalMargin,
    marginRight: 4,
  },
  white: {
    fontSize: FONT,
    color: "#fff",
    fontFamily: "CoolveticaBold",
    marginTop: globalMargin,
    marginRight: 4,
  },
  maskRect: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "black",
  },
});
