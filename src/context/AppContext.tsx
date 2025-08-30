import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, InteractionManager } from "react-native";
import { GRADES } from "../data/grades";

export type ModalType = "grade" | "top" | "bottom" | "gradeBottom" | null;

export interface GradeCtx {
  gradeIdx: number;
  topSystem: string;
  bottomSystem: string;
  modal: ModalType;
  setGradeIdx: (i: number) => void;
  setTopSystem: (s: string) => void;
  setBottomSystem: (s: string) => void;
  setGradeAndSyncAnim: (idx: number, animated?: boolean) => void;
  stepUp: () => void;
  stepDown: () => void;
  openModal: (w: ModalType) => void;
  closeModal: () => void;
  anim: Animated.Value;
}

const STORAGE_KEY = "@climb-app:prefs";
const Ctx = createContext<GradeCtx | undefined>(undefined);

const idxToAnim = (idx: number) => 1 - idx / (GRADES.length - 1);

export function AppProvider({ children }: { children: ReactNode }) {
  const [gradeIdx, setGradeIdx] = useState(32);
  const [topSystem, setTopSystem] = useState("YDS");
  const [bottomSystem, setBottomSystem] = useState("French");
  const [modal, setModal] = useState<ModalType>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  /* ANIM (pradžiai 0 = mėlyna apačia) */
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (typeof saved.gradeIdx === "number") setGradeIdx(saved.gradeIdx);
          if (typeof saved.topSystem === "string")
            setTopSystem(saved.topSystem);
          if (typeof saved.bottomSystem === "string")
            setBottomSystem(saved.bottomSystem);
        }
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!bootstrapped) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ gradeIdx, topSystem, bottomSystem })
    ).catch((e) => console.warn("Failed to persist preferences", e));
  }, [bootstrapped, gradeIdx, topSystem, bottomSystem]);

  useEffect(() => {
    if (!bootstrapped) return;
    const target = idxToAnim(gradeIdx);
    const task = InteractionManager.runAfterInteractions(() => {
      Animated.timing(anim, {
        toValue: target,
        duration: 800,
        useNativeDriver: false,
      }).start();
    });
    return () => task.cancel?.();
  }, [bootstrapped]);

  const setGradeAndSyncAnim = (idx: number, animated = false) => {
    setGradeIdx(idx);
    const val = idxToAnim(idx);
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

  const stepUp = () => setGradeAndSyncAnim(Math.max(0, gradeIdx - 1), true);
  const stepDown = () =>
    setGradeAndSyncAnim(Math.min(GRADES.length - 1, gradeIdx + 1), true);

  const openModal = (w: ModalType) => setModal(w);
  const closeModal = () => setModal(null);

  if (!bootstrapped) return null;

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
