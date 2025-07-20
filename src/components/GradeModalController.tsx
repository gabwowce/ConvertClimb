import React, { useEffect } from "react";
import DifficultyPicker from "./DifficultyPicker";
import SystemPicker from "./SystemPicker";
import { useApp } from "../context/AppContext";
import { setGradeRef } from "./sliderController";

export default function GradeModalController() {
  const {
    modal,
    closeModal,
    setGradeIdx,
    setTopSystem,
    setBottomSystem,
    topSystem,
    bottomSystem,
    gradeIdx,
    setGradeAndSyncAnim,
  } = useApp(); // ← pasiimam topSystem

  useEffect(() => {
    setGradeRef(setGradeAndSyncAnim, () => gradeIdx);
  }, [gradeIdx]);

  return (
    <>
      <DifficultyPicker
        visible={modal === "grade"}
        system={topSystem} // ← čia įdedam!
        onSelect={(i: number) => {
          setGradeAndSyncAnim(i, true);
          closeModal();
        }}
        onClose={closeModal}
        selectedIdx={gradeIdx}
      />
      <DifficultyPicker
        visible={modal === "gradeBottom"}
        system={bottomSystem} // ← čia įdedam!
        onSelect={(i: number) => {
          setGradeAndSyncAnim(i, true);
          closeModal();
        }}
        onClose={closeModal}
        selectedIdx={gradeIdx}
      />
      <SystemPicker
        visible={modal === "top"}
        exclude={[bottomSystem]}
        onSelect={(s: string) => {
          setTopSystem(s);
          closeModal();
        }}
        onClose={closeModal}
      />

      <SystemPicker
        visible={modal === "bottom"}
        exclude={[topSystem]}
        onSelect={(s: string) => {
          setBottomSystem(s);
          closeModal();
        }}
        onClose={closeModal}
      />
    </>
  );
}
