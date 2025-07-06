import React, { createContext, useContext, useState } from "react";

type GradeContextType = {
  gradeIdx: number;
  setGradeIdx: (i: number) => void;
  topSystem: string;
  bottomSystem: string;
  setTopSystem: (s: string) => void;
  setBottomSystem: (s: string) => void;
  openModal: (which: "grade" | "top" | "bottom") => void;
  modal: "grade" | "top" | "bottom" | null;
  closeModal: () => void;
};

const AppContext = createContext<GradeContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [gradeIdx, setGradeIdx] = useState(18);
  const [topSystem, setTopSystem] = useState("YDS");
  const [bottomSystem, setBottomSystem] = useState("French");
  const [modal, setModal] = useState<"grade" | "top" | "bottom" | null>(null);

  const openModal = (which: typeof modal) => setModal(which);
  const closeModal = () => setModal(null);

  return (
    <AppContext.Provider
      value={{
        gradeIdx,
        setGradeIdx,
        topSystem,
        bottomSystem,
        setTopSystem,
        setBottomSystem,
        openModal,
        modal,
        closeModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
