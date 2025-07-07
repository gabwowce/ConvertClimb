import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  View,
  Animated,
  StyleSheet,
  Platform,
  ViewStyle,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type Props = {
  txt: string;
  blueH: Animated.Animated;
  fullH: number;
};

export default function MaskedLabel({ txt, blueH, fullH }: Props) {
  const ref = useRef<View>(null);
  const offset = useRef(new Animated.Value(0)).current;
  const [textH, setTextH] = useState(0);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const measure = () =>
      ref.current?.measureInWindow((x, y, w, h) => {
        offset.setValue(fullH - (y + h) - insets.bottom + 2);
        setTextH(h);
      });
    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
  }, [txt, fullH]);

  const translateY = Animated.subtract(offset, blueH);

  return (
    <View ref={ref} style={styles.stack}>
      <Text style={styles.blue}>{txt}</Text>
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
    fontSize: 16,
    color: "#1A18BA",
    fontFamily: "Coolvetica",
  },
  white: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Coolvetica",
  },
  maskRect: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "black",
  },
});
