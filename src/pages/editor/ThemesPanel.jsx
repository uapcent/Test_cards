import { useState } from "react";
import { ThemeIcon } from "../../components/icons.jsx";
import CardPreview, { sampleCard, withLook } from "./CardPreview.jsx";
import { ArtPicker, ColorField, IconPicker } from "./pickers.jsx";

// The icon, colour and backdrop of each theme: themes.yaml
export default function ThemesPanel({ themes }) {
  const list = Array.isArray(themes.data) ? themes.data : [];
  const [selected, setSelected] = useState(0);
  const theme = list[selected];

  const set = (field, value) =>
    themes.change(doc =>
      value == null || value === "" ? doc.deleteIn([selected, field]) : doc.setIn([selected, field], value)
    );

  return (
    <div className="ed-split">
      <ul className="ed-list" aria-label="Themes">
        {list.map((entry, index) => (
          <li key={entry.key}>
            <button type="button" className={index === selected ? "is-on" : ""} onClick={() => setSelected(index)}>
              <ThemeIcon name={entry.icon} size={18} />
              <span>{entry.name}</span>
              <i style={{ background: entry.accent }} />
            </button>
          </li>
        ))}
      </ul>

      {theme && (
        <div className="ed-form">
          <h2>{theme.name}</h2>
          <p className="ed-hint">
            The theme's look is what every card of it wears, unless a sub-theme says otherwise. It also colours the Tokens,
            Showcase and Rankings pages.
          </p>
          <label>Icon</label>
          <IconPicker value={theme.icon} onChange={set.bind(null, "icon")} />
          <label>Colour</label>
          <ColorField value={theme.accent} onChange={set.bind(null, "accent")} />
          <label>Backdrop</label>
          <ArtPicker value={theme.art} onChange={set.bind(null, "art")} inheritLabel="none (the colour alone)" />
          <CardPreview card={withLook(sampleCard(theme.key), { icon: theme.icon, accent: theme.accent, art: theme.art })} />
        </div>
      )}
    </div>
  );
}
