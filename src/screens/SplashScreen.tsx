import React, { useEffect, useRef } from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import LottieView from "lottie-react-native";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <LottieView
        source={require("../../assets/animation/climpv6_2s.json")}
        autoPlay
        loop={false}
        resizeMode="cover" // ⬅️ svarbu: „cover“
        onAnimationFinish={onFinish}
        style={StyleSheet.absoluteFillObject} // ⬅️ ištempia iki kiekvieno krašto
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // fallback spalva, jei Lottie per krovimą 1 kadrui „pabaltuos“
    backgroundColor: "#fff",
  },
});
