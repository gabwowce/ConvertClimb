import LottieView from "lottie-react-native";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import pvz from "../../assets/animation/climpv6_3s.json";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <LottieView
        source={pvz}
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={onFinish}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
