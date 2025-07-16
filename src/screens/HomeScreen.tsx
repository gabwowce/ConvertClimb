import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  View as RNView,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BackgroundLines from "../components/BackgroundLines";
import VerticalSlider from "../components/VerticalSlider";
import GradeCard from "../components/GradeCard";
import GradeModalController from "../components/GradeModalController";

import { GRADES } from "../data/grades";
import { useApp } from "../context/AppContext";
import { useHorizontalPad } from "../hooks/useHorizontalPad";
import { TOP_PAD, BOTTOM_PAD } from "../components/config/sliderConfig";

export default function HomeScreen() {
  /* --- konteksto duomenys --- */
  const {
    gradeIdx,
    topSystem,
    bottomSystem,
    openModal,
    setGradeAndSyncAnim,
    stepUp,
    anim,
  } = useApp();

  /* --- bendrinama animacija --- */
  // const anim = useRef(
  //   new Animated.Value(1 - gradeIdx / (GRADES.length - 1))
  // ).current;

  // const anim = useRef(
  //   new Animated.Value(gradeIdx / (GRADES.length - 1))
  // ).current;

  /* --- matmenys & padėtys --- */
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;
  const [fullH, setFullH] = useState(0);
  const usableH = Math.max(windowHeight - TOP_PAD - BOTTOM_PAD, 1);
  const blueH = Animated.add(Animated.multiply(anim, usableH), BOTTOM_PAD);

  /* --- UI --- */
  const padX = useHorizontalPad();
  const grade = React.useMemo(
    () => GRADES.find((g) => g.idx === gradeIdx)!,
    [gradeIdx]
  );

  return (
    <SafeAreaView
      style={[s.container, { paddingHorizontal: padX }]}
      onLayout={(e) => setFullH(e.nativeEvent.layout.height)}
    >
      <BackgroundLines />
      <GradeModalController />

      {/* Paspaudimai ant viršutinės / apatinės zonos  */}
      <Animated.View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {/* Viršus – mažina laipsnį */}
        <Animated.View
          pointerEvents="auto"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: Animated.subtract(blueH, 26),
          }}
        >
          <TouchableWithoutFeedback onPress={stepUp}>
            <RNView style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </Animated.View>
      </Animated.View>

      {/* Slideris */}
      <View style={StyleSheet.absoluteFill}>
        <VerticalSlider
          onChange={(p) =>
            setGradeAndSyncAnim(Math.round((1 - p) * (GRADES.length - 1)))
          }
          onLayoutHeight={() => {}}
        />
      </View>

      {/* Kortelė */}
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
