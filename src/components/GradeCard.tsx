import React from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Grade } from "../data/grades";
import { valueFor } from "../hooks/useGradeValue";
import MaskedText from "./MaskedText";
import MaskedLabel from "./masks/MaskedLabel";
import MaskedIcon from "./masks/MaskedIcon";

type Props = {
  grade: Grade;
  topLabel: string;
  bottomLabel: string;
  blueH: Animated.Animated; // tas pats Animated.add(...)
  onPickTop: () => void;
  onPickBottom: () => void;
  onPressDifficulty: () => void;
  fullH: number;
};

export default function GradeCard({
  grade,
  topLabel,
  bottomLabel,
  blueH,
  onPickTop,
  onPickBottom,
  onPressDifficulty,
  fullH,
}: Props) {
  return (
    <View style={s.card}>
      {/* VIRŠUS */}
      <View style={s.block}>
        <Pressable onPress={onPickTop}>
          <View style={s.row}>
            {/* <Text style={s.label}>{topLabel}</Text> */}

            <MaskedText
              text={topLabel}
              blueH={blueH}
              fullH={fullH}
              style={{ fontSize: 16, fontFamily: "Coolvetica" }} // per propsus
            />

            <MaskedText
              icon={{ name: "chevron-down-outline", size: 18 }}
              blueH={blueH}
              fullH={fullH}
            />
          </View>
        </Pressable>

        <Pressable onPress={onPressDifficulty}>
          <MaskedText
            text={valueFor(topLabel, grade).toString()}
            blueH={blueH}
            fullH={fullH}
          />
        </Pressable>
      </View>

      {/* APAČIA */}
      <View style={s.block}>
        <Pressable onPress={onPickBottom}>
          <View style={s.row}>
            {/* <Text style={s.label}>{bottomLabel}</Text> */}

            <MaskedText
              text={bottomLabel}
              blueH={blueH}
              fullH={fullH}
              style={{
                fontSize: 16,
                fontFamily: "Coolvetica",
              }} // per propsus
            />

            <MaskedText
              icon={{ name: "chevron-down-outline", size: 18 }}
              blueH={blueH}
              fullH={fullH}
            />
          </View>
        </Pressable>

        <MaskedText
          text={valueFor(bottomLabel, grade).toString()}
          blueH={blueH}
          fullH={fullH}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: "25%",
  },
  block: { alignItems: "flex-end" },

  label: { fontSize: 16, color: "#1A18BA", fontFamily: "Coolvetica" },

  row: {
    flexDirection: "row",
    gap: 4,
  },
});
