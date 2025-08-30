import React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useApp } from "../context/AppContext";
import { GRADES } from "../data/grades";
import { getLetterSpacing } from "../helpers/getLetterSpacing";
import { valueFor } from "../hooks/useGradeValue";
import { useHorizontalPad } from "../hooks/useHorizontalPad";
import BackgroundLines from "./BackgroundLines";
import { TITLE, TXT } from "./config/textSize";
import FullScreenModal from "./FullScreenModal";

type Props = {
  visible: boolean;
  system: string;
  selectedIdx: number;
  onSelect: (idx: number) => void;
  onClose: () => void;
};

const GAP = 8;

export default function DifficultyPicker({
  visible,
  system,
  selectedIdx,
  onSelect,
  onClose,
}: Props) {
  const padX = useHorizontalPad();
  const { setGradeAndSyncAnim } = useApp();

  const COLS = system === "Polish" ? 4 : 5;

  const screenW = Dimensions.get("window").width;
  const innerW = screenW - padX * 2;
  const cellWidth = Math.floor((innerW - GAP * (COLS - 1)) / COLS);
  const gridW = COLS * cellWidth + (COLS - 1) * GAP;

  const availableGrades = React.useMemo(
    () => GRADES.filter((g) => valueFor(system, g) !== "-"),
    [system]
  );

  return (
    <FullScreenModal visible={visible} onClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

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
                      marginRight: (idx + 1) % COLS === 0 ? 0 : GAP,
                      marginBottom:
                        idx < availableGrades.length - COLS ? GAP : 0,
                    },
                  ]}
                  android_ripple={{ color: "#1A18BA20" }}
                  onPress={() => {
                    onSelect(g.idx);
                    setGradeAndSyncAnim?.(g.idx);
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
    fontSize: TITLE,
    letterSpacing: getLetterSpacing(TITLE),
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
    fontSize: TXT,
    letterSpacing: getLetterSpacing(TITLE),
    fontFamily: "Coolvetica",
  },
  txtSelected: {
    color: "#FFFFFF",
  },
});
