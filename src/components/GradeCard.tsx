import React from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Grade } from "../data/grades";
import { valueFor } from "../hooks/useGradeValue";
import MaskedText from "./masks/MaskedText";
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
            <MaskedLabel txt={topLabel} blueH={blueH} fullH={fullH} />
            <MaskedIcon
              name="chevron-down-outline"
              size={20}
              blueH={blueH}
              fullH={fullH}
            />
          </View>
        </Pressable>

        <Pressable onPress={onPressDifficulty}>
          <MaskedText
            txt={valueFor(topLabel, grade).toString()}
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
            <MaskedLabel txt={bottomLabel} blueH={blueH} fullH={fullH} />

            <MaskedIcon
              name="chevron-down-outline"
              size={20}
              blueH={blueH}
              fullH={fullH}
            />
          </View>
        </Pressable>

        <MaskedText
          txt={valueFor(bottomLabel, grade).toString()}
          blueH={blueH}
          fullH={fullH}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { alignItems: "flex-end", gap: "20%" },
  block: { alignItems: "flex-end" },

  label: { fontSize: 16, color: "#1A18BA", fontFamily: "Coolvetica" },

  row: { flexDirection: "row", alignItems: "center", gap: 4 },
});
