import { useEffect, useRef } from "react";
import { Icon } from "./icons.jsx";

export default function DetailsDialog({ character, variantIndex, onVariant, onClose }) {
  const closeRef = useRef(null);
  const variant = character.variants[variantIndex] ?? character.variants[0];

  useEffect(() => {
    closeRef.current?.focus();
  }, [character.id]);

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onVariant((variantIndex + 1) % character.variants.length);
      if (event.key === "ArrowLeft") {
        onVariant((variantIndex - 1 + character.variants.length) % character.variants.length);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [character, variantIndex, onVariant, onClose]);

  return (
    <div className="details" onClick={event => event.target === event.currentTarget && onClose()}>
      <section className="details__panel" role="dialog" aria-modal="true" aria-labelledby="details-name">
        <header className="details__header">
          <span className="details__portrait">
            {variant.hasImage ? (
              <img src={variant.image} alt="" />
            ) : (
              <span className="token__unknown" aria-hidden="true">?</span>
            )}
          </span>

          <div className="details__title">
            <span className="details__theme">{character.themeName}</span>
            <h2 id="details-name">{character.name}</h2>
            <div className="details__owned">
              <span className="details__bars" aria-hidden="true">
                {character.variants.map(each => (
                  <span key={each.id} className={each.owned ? "is-owned" : ""} />
                ))}
              </span>
              <span>
                Owns {character.ownedCount} of {character.variants.length}
                {character.variants.length > 1 ? " variants" : ""}
              </span>
            </div>
          </div>

          <button type="button" className="details__close" onClick={onClose} ref={closeRef} aria-label="Close details">
            <Icon name="close" size={20} />
          </button>
        </header>

        {character.variants.length > 1 && (
          <div className="details__variants">
            {character.variants.map((each, index) => (
              <button
                key={each.id}
                type="button"
                className={`details__variant ${index === variantIndex ? "is-current" : ""}`}
                aria-pressed={index === variantIndex}
                onClick={() => onVariant(index)}
              >
                <span className={`token token--${each.owned ? "owned" : "missing"}`}>
                  <span className="token__disc">
                    {each.hasImage ? (
                      <img src={each.image} alt="" loading="lazy" />
                    ) : (
                      <span className="token__unknown" aria-hidden="true">?</span>
                    )}
                  </span>
                  {!each.owned && (
                    <span className="token__badge token__badge--lock">
                      <Icon name="lock" size={11} />
                    </span>
                  )}
                </span>
                <span className="details__variant-label">{each.label || "No label"}</span>
              </button>
            ))}
          </div>
        )}

        <dl className="details__facts">
          {character.variants.length > 1 && (
            <div>
              <dt>Variant</dt>
              <dd>{variant.label || "No label"}</dd>
            </div>
          )}
          <div>
            <dt>Status</dt>
            <dd>
              {variant.owned ? "Owned" : "Not owned"}
              {variant.wishlist ? " · on the wishlist" : ""}
              {variant.defective ? " · defective" : ""}
            </dd>
          </div>
          <div>
            <dt>Released</dt>
            <dd>{variant.year ?? "—"}</dd>
          </div>
          <div>
            <dt>Appears in</dt>
            <dd>
              {variant.set ? (
                <a href={variant.set} target="_blank" rel="noopener noreferrer">Set page</a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt>BrickLink</dt>
            <dd>
              {variant.catalogUrl ? (
                <a href={variant.catalogUrl} target="_blank" rel="noopener noreferrer">{variant.brickLinkId}</a>
              ) : (
                "—"
              )}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
