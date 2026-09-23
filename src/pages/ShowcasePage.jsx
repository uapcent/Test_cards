import { useEffect, useRef, useState } from "react";
import { themes } from "../data/collection.js";
import { Icon, ThemeIcon } from "../components/icons.jsx";
import { moveFocus } from "../lib/gridNav.js";
import "./showcase.css";

// The character-select screen: theme tabs, a tile grid, and the chosen figure
// shown large. Only a click changes the figure, never hovering.
export default function ShowcasePage() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(themes[0].characters[0].id);
  const [variantIndexes, setVariantIndexes] = useState({});
  const gridRef = useRef(null);

  const theme = themes[themeIndex];
  const selected = theme.characters.find(character => character.id === selectedId) ?? theme.characters[0];
  const variantIndex = variantIndexes[selected.id] ?? 0;
  const variant = selected.variants[variantIndex] ?? selected.variants[0];

  // stepping by a delta keeps quick repeats from landing on the same theme
  const stepTheme = delta => setThemeIndex(current => (current + delta + themes.length) % themes.length);

  // a new theme starts on its first character
  useEffect(() => {
    setSelectedId(themes[themeIndex].characters[0].id);
  }, [themeIndex]);

  useEffect(() => {
    const onKeyDown = event => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, [contenteditable]")) return;
      if (event.key === "q" || event.key === "Q") stepTheme(-1);
      if (event.key === "e" || event.key === "E") stepTheme(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const hasVariantList = selected.variants.length > 1 || !!selected.variants[0].label;

  return (
    <div className="showcase">
      <h1>Collection</h1>

      <div
        className="showcase__body"
        style={{
          ...(theme.accent ? { "--theme-accent": theme.accent } : {}),
          ...(theme.art ? { "--theme-art": `url("${theme.art}")` } : {})
        }}
      >
        <span className="showcase__backdrop" aria-hidden="true" />
        <div className="showcase__picker">
          <nav className="showcase__tabs" aria-label="Themes">
            <kbd aria-hidden="true">Q</kbd>
            {themes.map((entry, index) => (
              <button
                key={entry.key}
                type="button"
                className={index === themeIndex ? "is-current" : ""}
                aria-current={index === themeIndex ? "page" : undefined}
                aria-label={entry.name}
                onClick={() => setThemeIndex(index)}
              >
                <ThemeIcon name={entry.icon} size={index === themeIndex ? 26 : 22} />
                {index === themeIndex && (
                  <span className="showcase__tab-label">
                    <span>{entry.name}</span>
                    <span className="showcase__tab-count">
                      {entry.ownedVariants} / {entry.totalVariants}
                    </span>
                  </span>
                )}
              </button>
            ))}
            <kbd aria-hidden="true">E</kbd>
          </nav>

          <div className="showcase__tiles" ref={gridRef} onKeyDown={event => moveFocus(gridRef.current, event)}>
            {theme.characters.map(character => {
              const tileVariant = character.displayVariant;
              const classes = ["tile"];
              if (character.id === selected.id) classes.push("is-current");
              if (character.state === "missing") classes.push("tile--missing");
              if (character.state === "unknown") classes.push("tile--unknown");
              if (tileVariant.hasImage && !tileVariant.hasCutout) classes.push("tile--photo");

              return (
                <button
                  key={character.id}
                  type="button"
                  className={classes.join(" ")}
                  data-token={character.id}
                  aria-pressed={character.id === selected.id}
                  aria-label={character.name}
                  onClick={() => setSelectedId(character.id)}
                >
                  <span className="tile__inner">
                    {tileVariant.hasImage ? (
                      <img src={tileVariant.cutout} alt="" loading="lazy" />
                    ) : (
                      <span className="tile__unknown" aria-hidden="true">?</span>
                    )}
                  </span>
                  {character.wishlist && (
                    <span className="tile__mark tile__mark--star"><Icon name="star" size={15} /></span>
                  )}
                  {character.defective && (
                    <span className="tile__mark tile__mark--warning"><Icon name="warning" size={15} /></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="showcase__info">
          <h2>{selected.name}</h2>
          <p className="showcase__sub">
            {theme.name} · owns {selected.ownedCount} of {selected.variants.length}
          </p>

          {hasVariantList && (
            <ul className="showcase__variants">
              {selected.variants.map((each, index) => (
                <li key={each.id}>
                  <button
                    type="button"
                    className={index === variantIndex ? "is-current" : ""}
                    aria-pressed={index === variantIndex}
                    onClick={() => setVariantIndexes(current => ({ ...current, [selected.id]: index }))}
                  >
                    <span>{each.label || "Standard"}</span>
                    {!each.owned && <Icon name="lock" size={18} title="Not owned" />}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <dl className="showcase__facts">
            <div>
              <dt>Status</dt>
              <dd>{variant.owned ? "Owned" : "Not owned"}</dd>
            </div>
            {variant.year && (
              <div>
                <dt>Released</dt>
                <dd>{variant.year}</dd>
              </div>
            )}
            {variant.set && (
              <div>
                <dt>Appears in</dt>
                <dd><a href={variant.set} target="_blank" rel="noopener noreferrer">Set page</a></dd>
              </div>
            )}
            {variant.catalogUrl && (
              <div>
                <dt>BrickLink</dt>
                <dd><a href={variant.catalogUrl} target="_blank" rel="noopener noreferrer">{variant.brickLinkId}</a></dd>
              </div>
            )}
          </dl>
        </div>

        <div className={`showcase__stage ${variant.owned ? "" : "is-missing"} ${variant.hasCutout ? "" : "has-photo"}`}>
          {variant.hasImage ? (
            <div className="showcase__figure-wrap" style={{ "--figure-scale": variant.scale }}>
              <img className="showcase__figure" src={variant.cutout} alt={`${selected.name}, ${variant.label || "standard"}`} />
              <span className="showcase__reflection-clip" aria-hidden="true">
                <img className="showcase__reflection" src={variant.cutout} alt="" />
              </span>
            </div>
          ) : (
            <p className="showcase__nofigure">No picture yet</p>
          )}
        </div>
      </div>

      <footer className="showcase__hints">
        <span><kbd>Arrows</kbd> Move</span>
        <span><kbd>Enter</kbd> Select</span>
        <span><kbd>Q</kbd><kbd>E</kbd> Theme</span>
      </footer>
    </div>
  );
}
