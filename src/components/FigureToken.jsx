import { Icon } from "./icons.jsx";

const STATE_LABELS = {
  owned: "owned",
  partial: "some variants owned",
  missing: "not owned",
  unknown: "no picture yet"
};

export default function FigureToken({ character, selected, tabIndex, onPreview, onOpen }) {
  const variant = character.displayVariant;
  const owned = `${character.ownedCount} of ${character.variants.length}`;

  const classes = ["token", `token--${character.state}`];
  if (selected) classes.push("token--selected");
  if (character.defective) classes.push("token--defective");

  return (
    <button
      type="button"
      className={classes.join(" ")}
      tabIndex={tabIndex}
      data-token={character.id}
      style={{ "--owned-share": `${(character.ownedCount / character.variants.length) * 100}%` }}
      onMouseEnter={() => onPreview(character.id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(character.id)}
      onBlur={() => onPreview(null)}
      onClick={() => onOpen(character.id)}
      aria-label={`${character.name}, ${STATE_LABELS[character.state]}${
        character.variants.length > 1 ? `, ${owned} variants` : ""
      }`}
    >
      <span className="token__disc">
        {variant.hasImage ? (
          <img src={variant.image} alt="" loading="lazy" />
        ) : (
          <span className="token__unknown" aria-hidden="true">?</span>
        )}
      </span>

      {character.state === "missing" && (
        <span className="token__badge token__badge--lock">
          <Icon name="lock" size={11} />
        </span>
      )}
      {character.wishlist && (
        <span className="token__badge token__badge--star">
          <Icon name="star" size={11} />
        </span>
      )}
      {character.variants.length > 1 && (
        <span className="token__count">{character.variants.length}</span>
      )}
    </button>
  );
}
