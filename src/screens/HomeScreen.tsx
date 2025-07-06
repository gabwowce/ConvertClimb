import React, { useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundLines from "../components/BackgroundLines";
import VerticalSlider from "../components/VerticalSlider";
import GradeCard from "../components/GradeCard";
import { GRADES } from "../data/grades";
import { useApp } from "../context/AppContext";
import { useHorizontalPad } from "../hooks/useHorizontalPad";
import { TOP_PAD, BOTTOM_PAD } from "../components/config/sliderConfig";

export default function HomeScreen() {
  const { gradeIdx, setGradeIdx, topSystem, bottomSystem, openModal } =
    useApp();

  const anim = useRef(
    new Animated.Value(1 - gradeIdx / (GRADES.length - 1))
  ).current;

  const [fullH, setFullH] = useState(0);
  const usableH = Math.max(fullH - TOP_PAD - BOTTOM_PAD, 1);

  const padX = useHorizontalPad();
  const grade = GRADES[gradeIdx];

  // Mėlyno sluoksnio aukštis (Animated.Value)
  const blueH = Animated.add(Animated.multiply(anim, usableH), BOTTOM_PAD);

  return (
    <SafeAreaView style={[s.container, { paddingHorizontal: padX }]}>
      <BackgroundLines />

      {/* SLIDERIS */}
      <View
        style={StyleSheet.absoluteFill}
        onLayout={(e) => setFullH(e.nativeEvent.layout.height)}
      >
        <VerticalSlider
          anim={anim}
          onChange={(p) => setGradeIdx(Math.round(p * (GRADES.length - 1)))}
          onLayoutHeight={() => {}}
        />
      </View>

      {/* KORTELĖ */}
      <GradeCard
        grade={grade}
        topLabel={topSystem}
        bottomLabel={bottomSystem}
        blueH={blueH}
        fullH={fullH}
        onPickTop={() => openModal("top")}
        onPickBottom={() => openModal("bottom")}
        onPressDifficulty={() => openModal("grade")}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },
});
