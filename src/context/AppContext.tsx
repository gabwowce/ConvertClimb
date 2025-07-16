import React, { createContext, useContext, useRef, useState } from "react";
import { Animated } from "react-native";
import { GRADES } from "../data/grades";

type GradeCtx = {
  /* duomenys */
  gradeIdx: number;
  topSystem: string;
  bottomSystem: string;
  modal: "grade" | "top" | "bottom" | null;
  setGradeIdx: (i: number) => void;
  setTopSystem: (s: string) => void;
  setBottomSystem: (s: string) => void;
  /* veiksmai */
  setGradeAndSyncAnim: (idx: number, animated?: boolean) => void;
  stepUp: () => void;
  stepDown: () => void;
  openModal: (w: GradeCtx["modal"]) => void;
  closeModal: () => void;

  /* bendrinama animacija */
  anim: Animated.Value;
};

const Ctx = createContext<GradeCtx | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  /* —— 1. pirminiai state’ai —— */
  const [gradeIdx, setGradeIdx] = useState(32);
  const [topSystem, setTopSystem] = useState("YDS");
  const [bottomSystem, setBottomSystem] = useState("French");
  const [modal, setModal] = useState<"grade" | "top" | "bottom" | null>(null);

  /* —— 2. visiems bendra animacija —— */
  const anim = useRef(
    new Animated.Value(1 - gradeIdx / (GRADES.length - 1))
  ).current;

  /* —— 3. sinchronizavimo funkcija —— */
  const setGradeAndSyncAnim = (idx: number, animated: boolean = false) => {
    /* atnaujinam state’ą */
    setGradeIdx(idx);

    /* perskaičiuojam animacijos tikslo vertę */
    const val = 1 - idx / (GRADES.length - 1);

    /* taikom animaciją arba tiesiog setValue() */
    if (animated) {
      Animated.timing(anim, {
        toValue: val,
        duration: 140,
        useNativeDriver: false,
      }).start();
    } else {
      anim.setValue(val);
    }
  };

  /* —— 4. +1 / –1 žingsniai —— */
  const stepUp = () => setGradeAndSyncAnim(Math.max(0, gradeIdx - 1), true); // sunkyn
  const stepDown = () =>
    setGradeAndSyncAnim(Math.min(GRADES.length - 1, gradeIdx + 1), true); // lengvyn

  /* —— 5. modalų valdymas —— */
  const openModal = (w: typeof modal) => setModal(w);
  const closeModal = () => setModal(null);

  return (
    <Ctx.Provider
      value={{
        gradeIdx,
        topSystem,
        bottomSystem,
        modal,
        anim,
        setGradeIdx,
        setTopSystem,
        setBottomSystem,
        setGradeAndSyncAnim,
        stepUp,
        stepDown,
        openModal,
        closeModal,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
