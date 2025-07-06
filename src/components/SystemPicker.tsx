import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import FullScreenModal from "./FullScreenModal";
import { SYSTEMS } from "../data/systems";
import BackgroundLines from "./BackgroundLines";

type Props = {
  visible: boolean;
  onSelect: (sys: string) => void;
  onClose: () => void;
};

export default function SystemPicker({ visible, onSelect, onClose }: Props) {
  return (
    <FullScreenModal visible={visible} onClose={onClose}>
      <BackgroundLines />
      <Text style={styles.title}>Choose grading system</Text>

      {SYSTEMS.map((s) => (
        <Pressable
          key={s.key}
          style={styles.row}
          onPress={() => onSelect(s.label)}
        >
          <Text style={styles.txt}>{s.label}</Text>
        </Pressable>
      ))}
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#1A18BA",
    textAlign: "center",
    marginBottom: 60,
    fontFamily: "CoolveticaBold",
    fontSize: 28,
    lineHeight: 34,
  },
  row: { paddingVertical: 8, alignItems: "center" },
  txt: {
    fontSize: 20,
    color: "#1A18BA",
    fontFamily: "CoolveticaBold",
    height: 48,
  },
});
