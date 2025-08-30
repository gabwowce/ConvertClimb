import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
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

export default function DifficultyPicker({
  visible,
  system,
  selectedIdx,
  onSelect,
  onClose,
}: Props) {
  const padX = useHorizontalPad();

  const COLS = system === "Polish" ? 4 : 5;

  const GAP = 0;
  const screenW = Dimensions.get("window").width;
  const innerW = screenW - padX * 2; // usable width
  const cellWidth = Math.floor((innerW - GAP * (COLS - 1)) / COLS);

  const gridW = COLS * cellWidth + (COLS - 1) * GAP;

  return (
    <FullScreenModal visible={visible} onClose={onClose}>
      <BackgroundLines />
      <Pressable
        style={{ flex: 1, justifyContent: "center" }}
        onPress={onClose}
      >
        <View style={{ alignItems: "center", paddingHorizontal: padX }}>
          <Text style={styles.title}>Choose difficulty ({system})</Text>

          <View style={[styles.grid, { width: gridW }]}>
            {GRADES.filter((g) => valueFor(system, g) !== "-").map((g) => {
              const isSelected = g.idx === selectedIdx;
              return (
                <Pressable
                  key={g.idx}
                  style={[
                    styles.cell,
                    {
                      width: cellWidth,
                      marginRight: GAP,
                      marginBottom: GAP,
                    },
                  ]}
                  onPress={() => onSelect(g.idx)}
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
      </Pressable>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: "flex-start",
  },
  cell: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  txt: {
    fontSize: TXT,
    letterSpacing: getLetterSpacing(TITLE),
    fontFamily: "Coolvetica",
  },
});
