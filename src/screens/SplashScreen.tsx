import LottieView from "lottie-react-native";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import animation from "../../assets/animation/Gradiator splash V1.0.json";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <LottieView
        source={animation}
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
