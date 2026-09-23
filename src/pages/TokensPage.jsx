import { useMemo, useRef, useState } from "react";
import { themes, collection, charactersById } from "../data/collection.js";
import FigureToken from "../components/FigureToken.jsx";
import DetailsDialog from "../components/DetailsDialog.jsx";
import { Icon } from "../components/icons.jsx";
import { moveFocus } from "../lib/gridNav.js";
import "./tokens.css";

const FILTERS = [
  { key: "all", label: "All", matches: () => true },
  { key: "owned", label: "Owned", matches: character => character.ownedCount > 0 },
  { key: "missing", label: "Not owned", matches: character => character.ownedCount < character.variants.length },
  { key: "wishlist", label: "Wishlist", matches: character => character.wishlist }
];

export default function TokensPage() {
  const [filterKey, setFilterKey] = useState("all");
  // Clicking a token keeps it shown when the pointer is elsewhere
  const [pinnedId, setPinnedId] = useState(themes[0].characters[0].id);
  const [previewId, setPreviewId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);
  const [variantIndexes, setVariantIndexes] = useState({});
  const [collapsedThemes, setCollapsedThemes] = useState(() => new Set());
  const gridsRef = useRef(null);

  const toggleTheme = key =>
    setCollapsedThemes(current => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const filter = FILTERS.find(entry => entry.key === filterKey);
  const visibleThemes = useMemo(
    () =>
      themes
        .map(theme => ({ ...theme, visible: theme.characters.filter(filter.matches) }))
        .filter(theme => theme.visible.length > 0),
    [filter]
  );

  const shown = charactersById.get(previewId) ?? charactersById.get(pinnedId);
  const shownVariant = shown.variants[variantIndexes[shown.id] ?? 0] ?? shown.variants[0];
  const details = detailsId ? charactersById.get(detailsId) : null;

  const open = id => {
    setPinnedId(id);
    setDetailsId(id);
  };

  const setVariant = (characterId, index) =>
    setVariantIndexes(current => ({ ...current, [characterId]: index }));

  return (
    <div className="tokens" onKeyDown={event => moveFocus(gridsRef.current, event)}>
      <div className="tokens__top">
        <header className="tokens__bar">
          <p className="counter">
            <span className="counter__icon"><Icon name="brickCount" size={30} /></span>
            <span className="counter__owned">{collection.owned}</span>
            <span className="counter__total">/ {collection.total} figures owned</span>
          </p>

          <div className="filters" role="group" aria-label="Filter figures">
            {FILTERS.map(entry => (
              <button
                key={entry.key}
                type="button"
                className={entry.key === filterKey ? "is-current" : ""}
                aria-pressed={entry.key === filterKey}
                onClick={() => setFilterKey(entry.key)}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </header>

        <section className="selected" aria-label="Selected figure">
          <div className="selected__side selected__side--left">
            <span className="selected__theme">{shown.themeName}</span>
            <span className="selected__muted">
              {shown.ownedCount} of {shown.variants.length} owned
            </span>
          </div>

          <div className="selected__figure">
            <span className={`portrait portrait--${shown.state}`}>
              {shownVariant.hasImage ? (
                <img src={shownVariant.image} alt={shown.name} />
              ) : (
                <span className="token__unknown" aria-hidden="true">?</span>
              )}
            </span>
            <h1>{shown.name}</h1>
          </div>

          <ul className="selected__facts">
            {shown.variants.length > 1 && (
              <li>* Variant <strong>{shownVariant.label || "No label"}</strong></li>
            )}
            <li>* {shownVariant.owned ? "Owned" : <strong>Not owned</strong>}</li>
            {shownVariant.year && <li>* Released in <strong>{shownVariant.year}</strong></li>}
            {shownVariant.set && (
              <li>* <a href={shownVariant.set} target="_blank" rel="noopener noreferrer">Set page</a></li>
            )}
            {shownVariant.defective && <li>* Defective</li>}
            {shownVariant.wishlist && <li>* On the wishlist</li>}
          </ul>
        </section>
      </div>

      <div className="tokens__grids" ref={gridsRef}>
        {visibleThemes.map(theme => {
          const collapsed = collapsedThemes.has(theme.key);
          return (
            <section key={theme.key} className="tokens__theme">
              <h2>
                <button
                  type="button"
                  className="tokens__theme-toggle"
                  aria-expanded={!collapsed}
                  onClick={() => toggleTheme(theme.key)}
                >
                  <Icon name="chevron" size={16} />
                  {theme.name}
                  <span>{theme.ownedVariants} / {theme.totalVariants} owned</span>
                </button>
              </h2>
              {!collapsed && (
                <div className="tokens__grid">
                  {theme.visible.map((character, index) => (
                    <FigureToken
                      key={character.id}
                      character={character}
                      selected={character.id === pinnedId}
                      tabIndex={index === 0 ? 0 : -1}
                      onPreview={setPreviewId}
                      onOpen={open}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <footer className="tokens__hints">
        <span><kbd>Arrows</kbd> Move</span>
        <span><kbd>Enter</kbd> Details</span>
        <span><kbd>Tab</kbd> Next theme</span>
        <span><kbd>Esc</kbd> Close</span>
      </footer>

      {details && (
        <DetailsDialog
          character={details}
          variantIndex={variantIndexes[details.id] ?? 0}
          onVariant={index => setVariant(details.id, index)}
          onClose={() => setDetailsId(null)}
        />
      )}
    </div>
  );
}
