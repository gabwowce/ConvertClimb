import { Platform } from "react-native";

const Component =
  Platform.OS === "ios"
    ? require("./DifficultyPicker.ios").default
    : require("./DifficultyPicker.android").default;

export default Component;
