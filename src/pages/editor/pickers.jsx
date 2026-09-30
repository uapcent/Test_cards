import { ThemeIcon, SYMBOL_NAMES } from "../../components/icons.jsx";

// Pictures tried out from the user's own computer, by the name they will have once they
// are in assets/theme_backgrounds/. They exist only in this tab, for the previews.
const localArt = new Map();

// The URL a backdrop picture is served at
export const artUrl = file => localArt.get(file) ?? `${import.meta.env.BASE_URL}theme_backgrounds/${file}`;

// Pick one of the drawings in icons.jsx. `inherit` adds a "use the theme's" choice.
export function IconPicker({ value, onChange, inherit = false }) {
  return (
    <div className="ed-icons" role="group" aria-label="Icon">
      {inherit && (
        <button type="button" className={`ed-icons__inherit${value == null ? " is-on" : ""}`} onClick={() => onChange(null)}>
          inherit
        </button>
      )}
      {SYMBOL_NAMES.map(name => (
        <button
          key={name}
          type="button"
          title={name}
          aria-label={name}
          aria-pressed={value === name}
          className={value === name ? "is-on" : ""}
          onClick={() => onChange(name)}
        >
          <ThemeIcon name={name} size={20} />
        </button>
      ))}
    </div>
  );
}

// A colour, as a swatch and a hex box. `inherit` lets it be left to the parent.
export function ColorField({ value, onChange, inherit = false }) {
  const valid = /^#[0-9a-f]{6}$/i.test(value ?? "");
  return (
    <div className="ed-color">
      <input type="color" value={valid ? value : "#444444"} onChange={event => onChange(event.target.value)} aria-label="Colour" />
      <input
        type="text"
        value={value ?? ""}
        placeholder={inherit ? "inherited" : "#rrggbb"}
        onChange={event => onChange(event.target.value)}
        aria-label="Colour, as hex"
      />
      {inherit && value != null && (
        <button type="button" onClick={() => onChange(null)}>
          inherit
        </button>
      )}
    </div>
  );
}

// Pick one of the pictures in assets/theme_backgrounds/
export function ArtPicker({ value, onChange, inheritLabel }) {
  const files = [...__THEME_ART__, ...[...localArt.keys()].filter(name => !__THEME_ART__.includes(name))];
  const isLocal = value && localArt.has(value) && !__THEME_ART__.includes(value);
  const missing = value && !files.includes(value);

  // `npm run theme-backgrounds` turns whatever is dropped in the folder into a WebP, so
  // that is the name the picture will end up with, and the one written to the YAML
  const tryLocal = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const name = `${file.name.replace(/\.[^.]+$/, "")}.webp`;
    localArt.set(name, URL.createObjectURL(file));
    onChange(name);
    event.target.value = "";
  };
  return (
    <div className="ed-art">
      <select value={value ?? ""} onChange={event => onChange(event.target.value || null)} aria-label="Backdrop picture">
        <option value="">{inheritLabel}</option>
        {missing && <option value={value}>{value} (file not found)</option>}
        {files.map(file => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </select>
      {value && !missing && <img src={artUrl(value)} alt="" className="ed-art__thumb" />}
      <label className="ed-file">
        Try a picture from your computer
        <input type="file" accept="image/*" onChange={tryLocal} />
      </label>
      {isLocal && (
        <p className="ed-hint ed-hint--warn">
          Only previewed here. To use it, put the picture in assets/theme_backgrounds/, run npm run theme-backgrounds (it becomes{" "}
          {value}), then restart the dev server.
        </p>
      )}
    </div>
  );
}
