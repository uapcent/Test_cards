import { useState } from "react";
import { ThemeIcon } from "../../components/icons.jsx";
import { prefersReducedMotion } from "../../lib/hooks.js";
import { openPack } from "../../lib/packStore.js";
import { playRip } from "../../lib/sound.js";

// The unopened pack: click to tear it
export default function SealedPack({ size, sticker }) {
  const [ripping, setRipping] = useState(false);

  const rip = () => {
    if (ripping) return;
    setRipping(true);
    playRip();
    setTimeout(() => {
      openPack();
      setRipping(false);
    }, prefersReducedMotion() ? 0 : 650);
  };

  return (
    <button type="button" className={`pack${ripping ? " pack--ripping" : ""}`} onClick={rip} autoFocus>
      <span className="pack__top" />
      <span className="pack__body">
        <ThemeIcon name="brick" size={44} />
        <b>Minifigure Booster</b>
        <small>
          {size} {size === 1 ? "card" : "cards"}
          {sticker ? " + 1 sticker" : ""}
        </small>
      </span>
      <span className="pack__bottom" />
      <span className="pack__cta">{ripping ? "…" : "Tear it open"}</span>
    </button>
  );
}
