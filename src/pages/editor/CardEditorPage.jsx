import { useState } from "react";
import cardsRaw from "../../../data/cards.yaml?raw";
import themesRaw from "../../../data/themes.yaml?raw";
import FiguresPanel from "./FiguresPanel.jsx";
import SubthemesPanel from "./SubthemesPanel.jsx";
import ThemesPanel from "./ThemesPanel.jsx";
import { useThemeFiles } from "./useThemeFiles.js";
import { download, useYamlDoc } from "./useYamlDoc.js";
import "./editor.css";

const TABS = [
  ["themes", "Themes"],
  ["subthemes", "Sub-themes"],
  ["figures", "Figures"]
];

// A local tool for setting up the look of the trading cards: a theme's icon, colour and
// backdrop, the sub-themes, and corrections to single figures (and, per variant, its
// favourite, description and source, which live in the theme files). It edits the YAML
// files in memory and hands them back as downloads to put over the ones in data/.
//
// DEV ONLY. App.jsx only imports this page when import.meta.env.DEV is true, which
// Vite replaces with false in a build, so none of this code (or the `yaml` package it
// uses) reaches the deployed site. The check below is a second lock, not the first.
export default function CardEditorPage() {
  const cards = useYamlDoc(cardsRaw);
  const themes = useYamlDoc(themesRaw);
  const files = useThemeFiles();
  const [tab, setTab] = useState("themes");

  if (!import.meta.env.DEV) return null;

  return (
    <main className="ed">
      <header className="ed-header">
        <div>
          <h1>
            Card editor <span className="ed-badge">local only</span>
          </h1>
          <p>
            Changes live in this tab until you download the files and put them over the ones in <code>data/</code>; the dev
            server then reloads them. Nothing here is saved anywhere else.
          </p>
        </div>
        <div className="ed-downloads">
          <button type="button" className="ed-button ed-button--primary" disabled={!cards.dirty} onClick={() => download("cards.yaml", cards.text())}>
            Download cards.yaml{cards.dirty ? " •" : ""}
          </button>
          <button type="button" className="ed-button ed-button--primary" disabled={!themes.dirty} onClick={() => download("themes.yaml", themes.text())}>
            Download themes.yaml{themes.dirty ? " •" : ""}
          </button>
          {files.dirtyKeys.map(key => (
            <button key={key} type="button" className="ed-button ed-button--primary" onClick={() => download(`${key}.yaml`, files.text(key))}>
              Download {key}.yaml •
            </button>
          ))}
          <button
            type="button"
            className="ed-button"
            disabled={!cards.dirty && !themes.dirty && files.dirtyKeys.length === 0}
            onClick={() => {
              if (window.confirm("Throw away every change made in this tab?")) {
                cards.reset();
                themes.reset();
                files.reset();
              }
            }}
          >
            Discard changes
          </button>
        </div>
      </header>

      <div className="ed-tabs" role="tablist" aria-label="What to edit">
        {TABS.map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "themes" && <ThemesPanel themes={themes} />}
      {tab === "subthemes" && <SubthemesPanel cards={cards} themes={themes} />}
      {tab === "figures" && <FiguresPanel cards={cards} themes={themes} files={files} />}
    </main>
  );
}
