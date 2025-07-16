import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ViewStyle,
  LayoutRectangle,
  Dimensions,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { normalize } from "../normalizeFont";
import { useMask } from "../../context/MaskContext";

const FONT = normalize(64);
const globalMargin = 0;

type Props = {
  txt: string;
  blueH: Animated.Animated;
  fullH: number;
};

export default function MaskedText({ txt, blueH, fullH }: Props) {
  const { blueY } = useMask();
  const ref = useRef<View>(null);
  const offset = useRef(new Animated.Value(0)).current;
  const [textH, setTextH] = useState(0);
  const [textY, setTextY] = useState(0);
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;
  useEffect(() => {
    const measure = () =>
      ref.current?.measureInWindow((x, y, w, h) => {
        const value = windowHeight - (y + h);
        offset.setValue(value);
        setTextH(h);
        setTextY(y);
      });

    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
  }, [txt, blueH]);

  // const translateY = Animated.subtract(offset, blueH);
  const translateY = Animated.subtract(blueY, textY);

  return (
    <View style={styles.stack}>
      <Text
        ref={ref}
        style={styles.blue}
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
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
