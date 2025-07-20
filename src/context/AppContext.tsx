import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GRADES } from "../data/grades";

// —— types ——
export type ModalType = "grade" | "top" | "bottom" | null;

export type GradeCtx = {
  /* data */
  gradeIdx: number;
  topSystem: string;
  bottomSystem: string;
  modal: ModalType;
  setGradeIdx: (i: number) => void;
  setTopSystem: (s: string) => void;
  setBottomSystem: (s: string) => void;
  /* actions */
  setGradeAndSyncAnim: (idx: number, animated?: boolean) => void;
  stepUp: () => void;
  stepDown: () => void;
  openModal: (w: ModalType) => void;
  closeModal: () => void;
  /* shared animation */
  anim: Animated.Value;
};

const STORAGE_KEY = "@climb-app:prefs";
const Ctx = createContext<GradeCtx | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  /* —— 1. primary state —— */
  const [gradeIdx, setGradeIdx] = useState<number>(32);
  const [topSystem, setTopSystem] = useState<string>("YDS");
  const [bottomSystem, setBottomSystem] = useState<string>("French");
  const [modal, setModal] = useState<ModalType>(null);
  const [bootstrapped, setBootstrapped] = useState<boolean>(false);

  /* —— 2. shared animation —— */
  const anim = useRef(new Animated.Value(1 - 32 / (GRADES.length - 1))).current;

  /* —— 3a. load persisted state once —— */
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (typeof saved.gradeIdx === "number") {
            setGradeIdx(saved.gradeIdx);
            anim.setValue(1 - saved.gradeIdx / (GRADES.length - 1));
          }
          if (typeof saved.topSystem === "string")
            setTopSystem(saved.topSystem);
          if (typeof saved.bottomSystem === "string")
            setBottomSystem(saved.bottomSystem);
        }
      } catch (e) {
        console.warn("Failed to load saved preferences", e);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, [anim]);

  /* —— 3b. persist state whenever it changes —— */
  useEffect(() => {
    if (!bootstrapped) return; // avoid overwriting before initial load
    const persist = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ gradeIdx, topSystem, bottomSystem })
        );
      } catch (e) {
        console.warn("Failed to persist preferences", e);
      }
    };
    persist();
  }, [gradeIdx, topSystem, bottomSystem, bootstrapped]);

  /* —— 4. helper to sync index + animation —— */
  const setGradeAndSyncAnim = (idx: number, animated: boolean = false) => {
    setGradeIdx(idx);
    const val = 1 - idx / (GRADES.length - 1);
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

  /* —— 5. +/- steps —— */
  const stepUp = () => setGradeAndSyncAnim(Math.max(0, gradeIdx - 1), true);
  const stepDown = () =>
    setGradeAndSyncAnim(Math.min(GRADES.length - 1, gradeIdx + 1), true);

  /* —— 6. modal helpers —— */
  const openModal = (w: ModalType) => setModal(w);
  const closeModal = () => setModal(null);

  /* —— 7. render children only after state is bootstrapped —— */
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
