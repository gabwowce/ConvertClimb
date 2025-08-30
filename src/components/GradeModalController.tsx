import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import DifficultyPicker from "./DifficultyPicker";
import { setGradeRef } from "./sliderController";
import SystemPicker from "./SystemPicker";

export default function GradeModalController() {
  const {
    modal,
    closeModal,
    setTopSystem,
    setBottomSystem,
    topSystem,
    bottomSystem,
    gradeIdx,
    setGradeAndSyncAnim,
  } = useApp();

  useEffect(() => {
    setGradeRef(setGradeAndSyncAnim, () => gradeIdx);
  }, [gradeIdx]);

  return (
    <>
      <DifficultyPicker
        visible={modal === "grade"}
        system={topSystem}
        onSelect={(i: number) => {
          setGradeAndSyncAnim(i, true);
          closeModal();
        }}
        onClose={closeModal}
        selectedIdx={gradeIdx}
      />
      <DifficultyPicker
        visible={modal === "gradeBottom"}
        system={bottomSystem}
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
