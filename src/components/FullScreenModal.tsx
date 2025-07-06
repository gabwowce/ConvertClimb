import React, { ReactNode } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StyleProp,
  ViewStyle,
  ScrollView,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** leidžiam perduoti papildomą stilių lapeliui */
  contentStyle?: StyleProp<ViewStyle>;
};

export default function FullScreenModal({
  visible,
  onClose,
  children,
  contentStyle,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.container}>
        <Pressable style={s.backdrop} onPress={onClose} />

        {/* lapelis */}
        <SafeAreaView style={[s.sheet, contentStyle]}>
          <ScrollView
            contentContainerStyle={s.contentContainerStyle}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
