import { useEffect, useRef, useState } from "react";
import { TIER_INFO } from "../data/cardPool.js";
import { ThemeIcon } from "./icons.jsx";
import "./tradingCard.css";

export const CARD_WIDTH = 220;
export const CARD_HEIGHT = 308;

// A figure's shape decides how it is fitted: most stand taller than they are wide,
// but a few (wings, cloaks, a raised weapon) run wide, and fitting those the same way
// leaves them small and stuck to the bottom. The shape is read from the picture the
// first time it is needed and remembered.
const aspects = new Map();

function useAspect(url) {
  const [aspect, setAspect] = useState(aspects.get(url) ?? null);
  useEffect(() => {
    if (aspects.has(url)) {
      setAspect(aspects.get(url));
      return;
    }
    const image = new Image();
    image.onload = () => {
      aspects.set(url, image.naturalWidth / image.naturalHeight);
      setAspect(aspects.get(url));
    };
    image.src = url;
  }, [url]);
  return aspect;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Front({ card, tier, info }) {
  const number = (card.bricklinkId ?? card.id).toUpperCase();
  const emblem = <ThemeIcon name={card.icon} size={16} />;
  // the narrowest thing that says where a figure comes from
  const origin = card.subtheme ?? card.themeName;

  if (info.layout === "sticker") {
    return (
      <div className="face">
        <div className="bg" />
        <div className="burst" />
        <div className="num">#{number.replace(/\D/g, "") || number}</div>
        <span className="emblem">{emblem}</span>
        <div className="fig" />
        <div className="banner">
          <b>{card.name}</b>
          <span>
            {origin} · {info.label}
          </span>
        </div>
        <div className="glare" />
      </div>
    );
  }

  if (info.layout === "art") {
    return (
      <>
        <div className="clip">
          <div className="glare" />
        </div>
        <div className="fig" />
        <div className="holo" />
        <div className="top">
          <span className="emblem">{emblem}</span>
        </div>
        <div className="plate">
          <b>{card.name}</b>
          <span>
            {[card.label || origin, info.label].join(" · ")}
          </span>
        </div>
      </>
    );
  }

  return (
    <div className="face">
      <div className="head">
        <span className="head__name">
          <b>{card.name}</b>
          {card.label && <small>{card.label}</small>}
        </span>
        <span className="emblem">{emblem}</span>
      </div>
      <div className="art">
        <div className="bg" />
        <div className="fig" />
        <div className="holo" />
      </div>
      <div className="foot">
        <span>
          {origin} · {info.label}
        </span>
        <i>{number}</i>
      </div>
      <div className="glare" />
    </div>
  );
}

// One trading card. `tier` is a rarity, or "sticker". `flipped` false shows the
// back, which glows in `tell`'s colour: a hint of what is coming, like the
// foil edge on a pack. `scale` shrinks it without changing the drawing.
export default function TradingCard({ card, tier, flipped = true, tell = null, scale = 1, interactive = true, onClick }) {
  const ref = useRef(null);
  const info = TIER_INFO[tier];

  const move = event => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    el.classList.add("hover");
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--ry", `${(x - 0.5) * 22}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 22}deg`);
    el.style.setProperty("--px", x - 0.5);
    el.style.setProperty("--py", y - 0.5);
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("hover");
    for (const name of ["--mx", "--my", "--rx", "--ry", "--px", "--py"]) el.style.removeProperty(name);
  };

  const figure = info.layout === "art" && card.fullArt ? card.fullArt : card.cutout;
  const aspect = useAspect(figure);

  const style = {
    "--accent": card.accent,
    "--fig": `url("${figure}")`,
    "--tier-color": info.color,
    "--aspect": aspect ?? 0.62,
    // like the Showcase: small pieces are drawn smaller, but never taller than a
    // standard minifig, since a big one would only lose its head to the frame
    "--fig-scale": Math.min(card.scale ?? 1, 1),
    ...(card.art ? { "--art": `url("${card.art}")` } : {}),
    ...(tell ? { "--tell": TIER_INFO[tell].color } : {})
  };

  const classes = [
    "tcard",
    `layout-${info.layout}`,
    `finish-${info.finish}`,
    `border-${info.border}`,
    flipped ? "tcard--up" : "tcard--down",
    tell ? "tcard--tell" : ""
  ].join(" ");

  return (
    <div className="tcard-box" style={{ width: CARD_WIDTH * scale, height: CARD_HEIGHT * scale }}>
      <div
        ref={ref}
        className={classes}
        style={{ ...style, transform: scale === 1 ? undefined : `scale(${scale})` }}
        onPointerMove={interactive ? move : undefined}
        onPointerLeave={interactive ? leave : undefined}
        onClick={onClick}
        role="img"
        aria-label={
          flipped
            ? `${card.name}${card.label ? `, ${card.label}` : ""}, ${card.themeName}${card.subtheme ? `, ${card.subtheme}` : ""}, ${info.label}`
            : "Face-down card"
        }
      >
        <div className="tcard__tilt">
          <div className="tcard__flip">
            <div className="tcard__front">
              <Front card={card} tier={tier} info={info} />
            </div>
            <div className="tcard__back">
              <div className="back__pattern" />
              <div className="back__mark">
                <ThemeIcon name="brick" size={52} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Just the back of a card, for the cards still waiting in a pack. It has no front
// at all, so it neither loads a picture nor gives away what is inside.
export function CardBack({ scale = 1 }) {
  return (
    <div className="tcard-box" style={{ width: CARD_WIDTH * scale, height: CARD_HEIGHT * scale }}>
      <div className="tcard tcard--static" style={{ transform: scale === 1 ? undefined : `scale(${scale})` }} aria-hidden="true">
        <div className="tcard__back">
          <div className="back__pattern" />
          <div className="back__mark">
            <ThemeIcon name="brick" size={52} />
          </div>
        </div>
      </div>
    </div>
  );
}
