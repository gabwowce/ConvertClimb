import React, { createContext, useContext, useRef, useState } from "react";
import { Animated } from "react-native";
import { BOTTOM_PAD, TOP_PAD } from "../components/config/sliderConfig";
import { GRADES } from "../data/grades";

type MaskCtx = {
  fullH: number;
  blueH: Animated.Animated;
  blueTop: Animated.Animated;
  blueY: Animated.Value;
  setFullH: (h: number) => void;
  setBlueY: (y: number) => void;
  anim: Animated.Value;
};

const Ctx = createContext<MaskCtx | null>(null);

export const useMask = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMask must be inside <MaskProvider>");
  return v;
};

export const MaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fullH, setFullH] = useState(0);

  /** bendras animacijos value – *visų* komponentų dalijamasi */
  const anim = useRef(new Animated.Value(1 - 32 / (GRADES.length - 1))).current;

  /** mėlynos juostos viršus (Y koord. nuo lango viršaus) */
  const blueY = useRef(new Animated.Value(0)).current;
  const setBlueY = (y: number) => blueY.setValue(y);

  /** aukštis pagal gradą */
  const usableH = Math.max(fullH - TOP_PAD - BOTTOM_PAD, 1);
  const blueH = Animated.add(Animated.multiply(anim, usableH), BOTTOM_PAD);

  /** viršus viršutiniams komponentams*/
  const blueTop = Animated.subtract(new Animated.Value(0), blueH);

  return (
    <Ctx.Provider
      value={{ fullH, blueH, blueTop, blueY, setFullH, setBlueY, anim }}
    >
      {children}
    </Ctx.Provider>
  );
};
