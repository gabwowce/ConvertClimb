import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from "react-native";
import FullScreenModal from "./FullScreenModal";
import { GRADES } from "../data/grades";
import { valueFor } from "../hooks/useGradeValue";
import { useHorizontalPad } from "../hooks/useHorizontalPad";
import BackgroundLines from "./BackgroundLines";
import { useApp } from "../context/AppContext";

/**
 * A full, self‑contained picker for climbing grade difficulty.
 * – Updates grade via context and sync animation.
 * – Calculates correct grid width so the block is perfectly centred.
 */

type Props = {
  visible: boolean;
  system: string;
  selectedIdx: number;
  onSelect: (idx: number) => void;
  onClose: () => void;
};

const GAP = 8; // visual gap in px

export default function DifficultyPicker({
  visible,
  system,
  selectedIdx,
  onSelect,
  onClose,
}: Props) {
  const padX = useHorizontalPad();
  const { setGradeAndSyncAnim } = useApp();

  /* 1️⃣ Columns depend on grade system */
  const COLS = system === "Polish" ? 4 : 5;

  /* 2️⃣ Calculate useful inner width and cell width */
  const screenW = Dimensions.get("window").width;
  const innerW = screenW - padX * 2;
  const cellWidth = Math.floor((innerW - GAP * (COLS - 1)) / COLS);
  const gridW = COLS * cellWidth + (COLS - 1) * GAP;

  /* 3️⃣ Filter out grades not supported by chosen system */
  const availableGrades = React.useMemo(
    () => GRADES.filter((g) => valueFor(system, g) !== "-"),
    [system]
  );

  return (
    <FullScreenModal visible={visible} onClose={onClose}>
      {/* Close modal when tapping on the dimmed backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Main content area – let inner Pressables receive touches */}
      <View style={styles.container} pointerEvents="box-none">
        <BackgroundLines />

        <View style={{ paddingHorizontal: padX }}>
          <Text style={styles.title}>Choose difficulty ({system})</Text>

          <View style={[styles.grid, { width: gridW }]}>
            {availableGrades.map((g, idx) => {
              const isSelected = g.idx === selectedIdx;

              return (
                <Pressable
                  key={g.idx}
                  style={[
                    styles.cell,
                    {
                      width: cellWidth,
                      // add right margin except for last column
                      marginRight: (idx + 1) % COLS === 0 ? 0 : GAP,
                      // add bottom margin except for last row
                      marginBottom:
                        idx < availableGrades.length - COLS ? GAP : 0,
                    },
                  ]}
                  android_ripple={{ color: "#1A18BA20" }}
                  onPress={() => {
                    onSelect(g.idx);
                    setGradeAndSyncAnim?.(g.idx); // optional context sync
                  }}
                >
                  <View
                    style={[
                      {
                        padding: 10,
                        backgroundColor: isSelected ? "#1A18BA" : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.txt,
                        {
                          backgroundColor: isSelected ? "#1A18BA" : "#FFFFFF",
                          color: isSelected ? "#FFFFFF" : "#1A18BA",
                        },
                      ]}
                    >
                      {valueFor(system, g)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#1A18BA",
    textAlign: "center",
    marginBottom: 50,
    fontFamily: "CoolveticaBold",
    fontSize: 28,
    lineHeight: 34,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCell: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  innerCellSelected: {
    backgroundColor: "#1A18BA",
  },
  txt: {
    color: "#1A18BA",
    fontSize: 20,
    fontFamily: "Coolvetica",
  },
  txtSelected: {
    color: "#FFFFFF",
  },
});
