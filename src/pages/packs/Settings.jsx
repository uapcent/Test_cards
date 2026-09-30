import { poolByTier } from "../../data/cardPool.js";
import { TIERS, TIER_INFO } from "../../data/tiers.js";
import { DEFAULT_SETTINGS, MAX_PACK_SIZE, PRESETS } from "../../lib/packs.js";
import { replaceSettings, updateSettings, updateSound } from "../../lib/packStore.js";
import { playTick } from "../../lib/sound.js";

// Pack size, odds, sticker and guarantee toggles, and sound
export default function Settings({ settings, sound }) {
  const total = TIERS.reduce((sum, tier) => sum + (poolByTier[tier].length ? Math.max(0, Number(settings.odds[tier]) || 0) : 0), 0);

  return (
    <aside className="settings" aria-label="Pack settings">
      <h3>Pack settings</h3>

      <div className="presets" role="group" aria-label="Presets">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button key={name} type="button" className="chip" onClick={() => { playTick(); replaceSettings(preset); }}>
            {name}
          </button>
        ))}
      </div>

      <label className="field">
        <span>Cards per pack</span>
        <span className="field__row">
          <input
            type="range"
            min="1"
            max={MAX_PACK_SIZE}
            value={settings.size}
            onChange={event => updateSettings({ size: Number(event.target.value) })}
          />
          <output>{settings.size}</output>
        </span>
      </label>

      <fieldset className="odds">
        <legend>Odds</legend>
        {TIERS.map(tier => {
          const usable = poolByTier[tier].length > 0;
          const weight = Number(settings.odds[tier]) || 0;
          return (
            <label key={tier} className="field">
              <span style={{ color: TIER_INFO[tier].color }}>{TIER_INFO[tier].label}</span>
              <span className="field__row">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={weight}
                  disabled={!usable}
                  onChange={event => updateSettings({ odds: { ...settings.odds, [tier]: Number(event.target.value) } })}
                />
                <output>{usable && total ? `${((weight / total) * 100).toFixed(1)}%` : "–"}</output>
              </span>
            </label>
          );
        })}
      </fieldset>

      <label className="check">
        <input type="checkbox" checked={settings.sticker} onChange={event => updateSettings({ sticker: event.target.checked })} />
        One die-cut sticker in every pack
      </label>
      <label className="check">
        <input type="checkbox" checked={settings.guarantee} onChange={event => updateSettings({ guarantee: event.target.checked })} />
        Guarantee a Rare or better
      </label>

      <fieldset className="odds">
        <legend>Sound</legend>
        <label className="check">
          <input type="checkbox" checked={!sound.muted} onChange={event => updateSound({ muted: !event.target.checked })} />
          Sound effects
        </label>
        <label className="field">
          <span>Volume</span>
          <span className="field__row">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sound.volume}
              onChange={event => updateSound({ volume: Number(event.target.value) })}
            />
          </span>
        </label>
      </fieldset>

      <button type="button" className="btn btn--small" onClick={() => replaceSettings(DEFAULT_SETTINGS)}>
        Reset to defaults
      </button>
    </aside>
  );
}
