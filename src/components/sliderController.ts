import { Animated } from "react-native";
import { STEP_PCT, STEPS } from "./config/sliderConfig";

let _animRef: Animated.Value | null = null;
let _setGradeIdx: ((val: number) => void) | null = null;
let _getGradeIdx: (() => number) | null = null;

export const setAnimRef = (ref: Animated.Value) => {
  _animRef = ref;
};

export const setGradeRef = (
  setFn: (val: number) => void,
  getFn: () => number
) => {
  _setGradeIdx = setFn;
  _getGradeIdx = getFn;
};

export const decrease = () => {
  if (!_animRef || !_setGradeIdx || !_getGradeIdx) return;

  const current = _getGradeIdx();
  if (current >= STEPS - 1) return;

  const next = current + 1;
  _setGradeIdx(next);

  Animated.timing(_animRef, {
    toValue: next * STEP_PCT,
    duration: 140,
    useNativeDriver: false,
  }).start();
};

export const increase = () => {
  if (!_animRef || !_setGradeIdx || !_getGradeIdx) return;

  const current = _getGradeIdx();
  const next = Math.max(0, current - 1);
  _setGradeIdx(next);

  Animated.timing(_animRef, {
    toValue: next * STEP_PCT,
    duration: 140,
    useNativeDriver: false,
  }).start();
};
