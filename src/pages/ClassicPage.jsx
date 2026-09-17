import { useMemo, useState } from "react";
import { themes, charactersById } from "../data/collection.js";
import DetailsDialog from "../components/DetailsDialog.jsx";
import { Icon } from "../components/icons.jsx";
import "./classic.css";

// The original page: one card per character, clicking a card cycles its variants
export default function ClassicPage() {
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [indexes, setIndexes] = useState({});
  const [detailsId, setDetailsId] = useState(null);

  const visibleThemes = useMemo(() => {
    const keep = variant => (!ownedOnly || variant.owned) && (!wishlistOnly || variant.wishlist);
    return themes
      .map(theme => ({
        ...theme,
        visible: theme.characters
          .map(character => ({ character, variants: character.variants.filter(keep) }))
          .filter(entry => entry.variants.length > 0)
      }))
      .filter(theme => theme.visible.length > 0);
  }, [ownedOnly, wishlistOnly]);

  const details = detailsId ? charactersById.get(detailsId) : null;

  const tilt = event => {
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    const rotateX = ((event.clientY - box.top - box.height / 2) / box.height) * 30;
    const rotateY = ((event.clientX - box.left - box.width / 2) / box.width) * 30;
    card.style.transform = `scale(1.2) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  return (
    <div className="classic">
      <h1>Minifigure checklist</h1>

      <div className="classic__filters">
        <label>
          <input type="checkbox" checked={wishlistOnly} onChange={event => setWishlistOnly(event.target.checked)} />
          Wishlist only
        </label>
        <label>
          <input type="checkbox" checked={ownedOnly} onChange={event => setOwnedOnly(event.target.checked)} />
          Owned only
        </label>
      </div>

      {visibleThemes.map(theme => (
        <section key={theme.key} className="classic__theme">
          <h2>{theme.name}</h2>
          <div className="classic__grid">
            {theme.visible.map(({ character, variants }) => {
              const index = (indexes[character.id] ?? 0) % variants.length;
              const variant = variants[index];

              return (
                <div
                  key={character.id}
                  className={`card ${variant.defective ? "card--defective" : ""}`}
                  role="button"
                  style={character.glow ? { "--glow-color": character.glow } : undefined}
                  tabIndex={0}
                  onClick={() => setIndexes(current => ({ ...current, [character.id]: index + 1 }))}
                  onKeyDown={event => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    setIndexes(current => ({ ...current, [character.id]: index + 1 }));
                  }}
                  onMouseMove={tilt}
                  onMouseLeave={event => { event.currentTarget.style.transform = ""; }}
                >
                  <img
                    src={variant.image}
                    alt={character.name}
                    loading="lazy"
                    style={variant.owned ? undefined : { filter: "grayscale(100%)" }}
                  />

                  <button
                    type="button"
                    className="card__info"
                    aria-label={`Details for ${character.name}`}
                    onClick={event => {
                      event.stopPropagation();
                      setDetailsId(character.id);
                    }}
                  >
                    i
                  </button>

                  {variant.defective && (
                    <span className="card__defective"><Icon name="warning" size={16} title="Defective" /></span>
                  )}

                  <div className="card__overlay">
                    <strong>{character.name}</strong>
                    <span>{variant.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {details && (
        <DetailsDialog
          character={details}
          variantIndex={(indexes[details.id] ?? 0) % details.variants.length}
          onVariant={index => setIndexes(current => ({ ...current, [details.id]: index }))}
          onClose={() => setDetailsId(null)}
        />
      )}
    </div>
  );
}
