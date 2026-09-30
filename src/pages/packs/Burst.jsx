import { useMemo } from "react";
import { TIER_INFO } from "../../data/tiers.js";

// A burst of confetti from the middle of the stage, in the tier's colour
const PARTICLES = { sticker: 16, rare: 14, epic: 32, legendary: 48, gold: 72 };

export default function Burst({ tier }) {
  const particles = useMemo(() => {
    const colors = [TIER_INFO[tier].color, "#ffffff", "#f2c14e"];
    return Array.from({ length: PARTICLES[tier] ?? 0 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 140 + Math.random() * 260;
      return {
        "--dx": `${Math.cos(angle) * distance}px`,
        "--dy": `${Math.sin(angle) * distance}px`,
        "--size": `${4 + Math.random() * 7}px`,
        "--delay": `${Math.random() * 0.12}s`,
        background: colors[Math.floor(Math.random() * colors.length)]
      };
    });
  }, [tier]);

  return (
    <div className="burst-fx" aria-hidden="true">
      {particles.map((style, i) => (
        <span key={i} style={style} />
      ))}
    </div>
  );
}
