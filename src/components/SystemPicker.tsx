import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import FullScreenModal from "./FullScreenModal";
import { SYSTEMS } from "../data/systems";
import BackgroundLines from "./BackgroundLines";

type Props = {
  visible: boolean;
  onSelect: (sys: string) => void;
  onClose: () => void;
  exclude?: string[];
};

export default function SystemPicker({
  visible,
  onSelect,
  onClose,
  exclude = [],
}: Props) {
  const availableSystems = SYSTEMS.filter((s) => !exclude.includes(s.label));
  return (
    <FullScreenModal visible={visible} onClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <BackgroundLines />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.title}>Choose grading system</Text>

          {availableSystems.map((s) => (
            <Pressable
              key={s.key}
              style={styles.row}
              onPress={() => onSelect(s.label)}
            >
              <Text style={styles.txt}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
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
