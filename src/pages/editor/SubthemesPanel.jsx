import { useState } from "react";
import { ThemeIcon } from "../../components/icons.jsx";
import CardPreview, { sampleCard, withLook } from "./CardPreview.jsx";
import { ArtPicker, ColorField, IconPicker } from "./pickers.jsx";

const slug = text =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const lines = text => text.split("\n").map(line => line.trim()).filter(Boolean);

// The sub-themes of each theme: cards.yaml. They are matched in order and the first
// that takes a figure wins, so the order is editable too.
export default function SubthemesPanel({ cards, themes }) {
  const themeList = Array.isArray(themes.data) ? themes.data : [];
  const [themeKey, setThemeKey] = useState(themeList[0]?.key);
  const [selected, setSelected] = useState(0);

  const theme = themeList.find(entry => entry.key === themeKey);
  const rules = cards.data.subthemes?.[themeKey] ?? [];
  const rule = rules[selected] ?? rules[0];
  const index = rules.indexOf(rule);
  const path = field => ["subthemes", themeKey, index, field];

  const setField = (field, value) =>
    cards.change(doc =>
      value == null || value === "" || (Array.isArray(value) && !value.length)
        ? doc.deleteIn(path(field))
        : doc.setIn(path(field), Array.isArray(value) ? doc.createNode(value) : value)
    );

  const add = () => {
    const name = window.prompt("Name of the new sub-theme (for example Galactic Empire):");
    if (!name?.trim()) return;
    let key = slug(name) || "new";
    while (rules.some(entry => entry.key === key)) key += "-2";
    cards.change(doc => {
      if (!doc.hasIn(["subthemes", themeKey])) doc.setIn(["subthemes", themeKey], doc.createNode([]));
      const seq = doc.getIn(["subthemes", themeKey], true);
      // a catch-all ("*") has to stay last, or nothing after it would ever match
      const last = seq.items[seq.items.length - 1]?.toJSON?.();
      const at = last?.names?.includes("*") ? seq.items.length - 1 : seq.items.length;
      seq.items.splice(at, 0, doc.createNode({ key, name: name.trim(), icon: "star" }));
      setSelected(at);
    });
  };

  const remove = () => {
    if (!window.confirm(`Delete the sub-theme "${rule.name}"?`)) return;
    cards.change(doc => doc.deleteIn(path()));
    setSelected(0);
  };

  const move = direction => {
    const target = index + direction;
    if (target < 0 || target >= rules.length) return;
    cards.change(doc => {
      const { items } = doc.getIn(["subthemes", themeKey], true);
      [items[index], items[target]] = [items[target], items[index]];
    });
    setSelected(target);
  };

  const parent = { icon: theme?.icon, accent: theme?.accent, art: theme?.art };

  return (
    <div className="ed-split">
      <div className="ed-side">
        <select
          value={themeKey}
          onChange={event => {
            setThemeKey(event.target.value);
            setSelected(0);
          }}
          aria-label="Theme"
        >
          {themeList.map(entry => (
            <option key={entry.key} value={entry.key}>
              {entry.name}
            </option>
          ))}
        </select>
        <ul className="ed-list" aria-label="Sub-themes">
          {rules.map((entry, i) => (
            <li key={entry.key}>
              <button type="button" className={entry === rule ? "is-on" : ""} onClick={() => setSelected(i)}>
                <ThemeIcon name={entry.icon ?? theme?.icon} size={18} />
                <span>{entry.name}</span>
                <i style={{ background: entry.accent ?? theme?.accent }} />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="ed-button" onClick={add}>
          + Add a sub-theme
        </button>
        {rules.length === 0 && <p className="ed-hint">None yet: every figure of this theme wears the theme's own look.</p>}
      </div>

      {rule && (
        <div className="ed-form">
          <h2>{rule.name}</h2>
          <div className="ed-row">
            <button type="button" className="ed-button" onClick={() => move(-1)} disabled={index === 0}>
              ↑ Earlier
            </button>
            <button type="button" className="ed-button" onClick={() => move(1)} disabled={index === rules.length - 1}>
              ↓ Later
            </button>
            <button type="button" className="ed-button ed-button--danger" onClick={remove}>
              Delete
            </button>
          </div>
          <p className="ed-hint">
            Position {index + 1} of {rules.length}. The first sub-theme that takes a figure wins, so narrow ones go before broad
            ones, and a catch-all stays last.
          </p>

          <label>Name</label>
          <input type="text" value={rule.name ?? ""} onChange={event => setField("name", event.target.value)} />
          <label>Icon</label>
          <IconPicker value={rule.icon} onChange={value => setField("icon", value)} inherit />
          <label>Colour</label>
          <ColorField value={rule.accent} onChange={value => setField("accent", value)} inherit />
          <label>Backdrop</label>
          <ArtPicker value={rule.art} onChange={value => setField("art", value)} inheritLabel="the theme's backdrop" />

          <label>Character names it takes (one per line; a * at the start or end matches the rest)</label>
          <textarea rows={6} defaultValue={(rule.names ?? []).join("\n")} key={`names-${themeKey}-${rule.key}`} onBlur={event => setField("names", lines(event.target.value))} />
          <label>Variant labels it takes (an episode, a season, a series)</label>
          <textarea rows={3} defaultValue={(rule.labels ?? []).join("\n")} key={`labels-${themeKey}-${rule.key}`} onBlur={event => setField("labels", lines(event.target.value))} />

          <CardPreview card={withLook(sampleCard(themeKey, rule.name), rule, parent)} />
        </div>
      )}
    </div>
  );
}
