// components/masks/MaskedText.tsx   (UNIVERSALI VERSIJA)

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Animated,
  ViewStyle,
  StyleSheet,
  Dimensions,
  Text,
  TextStyle,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { useMask } from "../context/MaskContext";
import { Ionicons } from "@expo/vector-icons";
import { normalize } from "./normalizeFont";

const DEFAULT_FONT = normalize(64);
const BASE_COLOR = "#1A18BA";
const MASKED_COLOR = "#fff";

type IconProps = {
  name: string;
  size?: number;
  color?: string; // jei nori individualios spalvos
};

type Props = {
  /** Jei paduodi textą – bus atvaizduotas tekstas */
  text?: string;
  /** Jei paduodi ikoną – bus atvaizduota ikona */
  icon?: IconProps;
  /** Kaukei reikalingas aukštis (paduodi tą patį, kurį skaičiuoji animacijoje) */
  blueH: Animated.Animated;
  /** Viso ekrano (ar naudotino) aukštis – liko logikai */
  fullH: number;
  /** Papildomas stilius tekstui / ikonai (baseline sluoksniui) */
  style?: TextStyle;
  /** Pagrindinė (baseline) spalva, numatyta – mėlyna */
  baseColor?: string;
  /** Spalva po kauke, numatyta – balta */
  maskedColor?: string;
};

export default function MaskedText({
  text,
  icon,
  blueH,
  fullH,
  style,
  baseColor = BASE_COLOR,
  maskedColor = MASKED_COLOR,
}: Props) {
  const { blueY } = useMask();

  /* ---------------------- matavimas absoliučiai Y koordinacijai ---------------------- */
  const ref = useRef<View>(null);
  const [yPos, setYPos] = useState(0);
  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    const measure = () =>
      ref.current?.measureInWindow((x, y) => {
        setYPos(y);
      });

    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
  }, [text, icon, blueH]);

  /* ---------------------- animacija ---------------------- */
  const translateY = Animated.subtract(blueY, yPos);

  /* ---------------------- elementas, kurį kaukėsime ---------------------- */
  const renderContent = (color: string) => {
    if (icon) {
      const { name, size = 20 } = icon;
      return <Ionicons name={name} size={size} color={color} />;
    }

    // tekstas kaip numatytasis variantas
    return (
      <Text
        style={[
          {
            fontSize: DEFAULT_FONT,
            fontFamily: "CoolveticaBold",
            color,
            marginTop: 0,
            marginRight: 4,
          },
          style,
        ]}
      >
        {text}
      </Text>
    );
  };

  return (
    <View style={styles.stack}>
      {/* Baseline sluoksnis – mėlynas (ar kitos baseColor) */}
      <View ref={ref} collapsable={false}>
        {renderContent(baseColor)}
      </View>

      {/* Kaukuotas sluoksnis – baltas (ar maskedColor) */}
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
        {renderContent(maskedColor)}
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { position: "relative", alignSelf: "flex-start" },
  maskRect: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "black",
  },
});
