import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ViewStyle,
  Platform,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";

const FONT = 64;

type Props = {
  txt: string;
  blueH: Animated.Animated; // mėlyno sluoksnio aukštis
  fullH: number; // visas ekrano aukštis
};

export default function MaskedText({ txt, blueH, fullH }: Props) {
  const ref = useRef<View>(null);
  const offset = useRef(new Animated.Value(0)).current; // px iki apačios
  const [textH, setTextH] = useState(0); // teksto aukštis

  const platformOffset = Platform.OS === "ios" ? 68 : 43;
  /* pamatuojam absoliučią poziciją */
  useEffect(() => {
    const measure = () =>
      ref.current?.measureInWindow((x, y, w, h) => {
        offset.setValue(fullH - (y + h) + platformOffset); // atstumas iki apačios
        setTextH(h);
      });
    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
  }, [txt, fullH]);

  /* kaukės viršaus koordinatė (mažėja kylant mėlynai) */
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
                // ❶ vietoje textH:
                height: blueH as unknown as number | string, // TS hack – kai reikia
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
    marginTop: -8,
    marginRight: 4,
  },
  white: {
    fontSize: FONT,
    color: "#fff",
    fontFamily: "CoolveticaBold",
    marginTop: -8,
    marginRight: 4,
  },
  maskRect: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "black", // būtina kaukei
  },
});
