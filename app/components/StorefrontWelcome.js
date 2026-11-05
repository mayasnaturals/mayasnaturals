"use client";

import { useCallback, useState } from "react";
import DiwaliFireworks from "./DiwaliFireworks";
import SalePopup from "./SalePopup";

// # Own the welcome sequence in one place. The sale timer starts only after
// # fireworks report completion, including sessions where playback is skipped.
export default function StorefrontWelcome() {
  const [isCelebrationComplete, setIsCelebrationComplete] = useState(false);
  const finishCelebration = useCallback(() => {
    setIsCelebrationComplete(true);
  }, []);

  return (
    <>
      <DiwaliFireworks onComplete={finishCelebration} />
      <SalePopup enabled={isCelebrationComplete} />
    </>
  );
}
