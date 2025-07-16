// src/context/MaskContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Animated } from "react-native";
import { BOTTOM_PAD, TOP_PAD } from "../components/config/sliderConfig";

type MaskContext = {
  fullH: number;
  blueTop: Animated.Animated;
  blueH: Animated.Animated;
  blueY: number;
  setFullH: (h: number) => void;
  setBlueY: (y: number) => void;
};

const Ctx = createContext<MaskContext | null>(null);

export const useMask = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMask must be inside <MaskProvider>");
  return ctx;
};

export const MaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fullH, setFullH] = useState(0);
  const [blueY, setBlueY] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  const usableH = Math.max(fullH - TOP_PAD - BOTTOM_PAD, 1);
  const blueH = Animated.add(Animated.multiply(anim, usableH), BOTTOM_PAD);
  const blueTop = Animated.subtract(new Animated.Value(0), blueH); // ar tavo logika čia reikalauja top?

  return (
    <Ctx.Provider value={{ fullH, blueTop, blueH, blueY, setFullH, setBlueY }}>
      {children}
    </Ctx.Provider>
  );
};
