import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import FullScreenModal from "./FullScreenModal";
import { GRADES } from "../data/grades";
import { valueFor } from "../hooks/useGradeValue";
import { useHorizontalPad } from "../hooks/useHorizontalPad";
import BackgroundLines from "./BackgroundLines";
import { useApp } from "../context/AppContext";
type Props = {
  visible: boolean;
  system: string;
  onSelect: (idx: number) => void;
  onClose: () => void;
};

export default function DifficultyPicker({
  visible,
  system,
  onSelect,
  onClose,
}: Props) {
  const padX = useHorizontalPad(); // ← tas pats hook’as
  const { setGradeAndSyncAnim } = useApp();
  const cellWidth = system === "Polish" ? 90 : 60;
  return (
    <FullScreenModal visible={visible} onClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <BackgroundLines />
          <View style={{ paddingHorizontal: padX }}>
            <Text style={s.title}>Choose difficulty ({system})</Text>

            <View style={s.grid}>
              {[...GRADES]
                .sort((a, b) => b.idx - a.idx)
                .map((g) => (
                  <Pressable
                    key={g.idx}
                    style={[s.cell, { width: cellWidth }]}
                    onPress={() => {
                      setGradeAndSyncAnim(g.idx);
                      onClose();
                    }}
                  >
                    <Text style={s.txt}>{valueFor(system, g)}</Text>
                  </Pressable>
                ))}
            </View>
          </View>
        </View>
      </Pressable>
    </FullScreenModal>
  );
}

const s = StyleSheet.create({
  title: {
    color: "#1A18BA",
    textAlign: "center",
    marginBottom: 50,
    fontFamily: "CoolveticaBold",
    fontSize: 28,
    lineHeight: 34,
  },
  gridWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  cell: {
    width: 90,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: { color: "#1A18BA", fontSize: 20, fontFamily: "Coolvetica" },
});
