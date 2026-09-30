import { useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS, rollPack } from "./packs.js";
import { setMuted, setVolume } from "./sound.js";

// Session state for the Packs page, kept outside React so it survives switching
// pages. It lives only as long as the tab: nothing is written anywhere, so a
// reload is a fresh start.
let state = {
  settings: DEFAULT_SETTINGS,
  // { cards, revealed } while a pack is open, null otherwise
  pack: null,
  // "<figure id>|<tier>" -> { card, tier, count }
  album: {},
  packsOpened: 0,
  sound: { muted: false, volume: 0.7 }
};

const listeners = new Set();

function set(next) {
  state = { ...state, ...next };
  listeners.forEach(listener => listener());
}

export function usePackStore() {
  return useSyncExternalStore(
    listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state
  );
}

export function updateSettings(patch) {
  set({ settings: { ...state.settings, ...patch } });
}

export function replaceSettings(settings) {
  set({ settings: { ...settings, odds: { ...settings.odds } } });
}

export function openPack() {
  set({ pack: { cards: rollPack(state.settings), revealed: 0 }, packsOpened: state.packsOpened + 1 });
}

export function closePack() {
  set({ pack: null });
}

// Reveal cards up to `upTo` (exclusive) and add each one to the album
export function revealTo(upTo) {
  const { pack } = state;
  if (!pack || upTo <= pack.revealed) return;
  const end = Math.min(upTo, pack.cards.length);
  const album = { ...state.album };
  for (const { card, tier } of pack.cards.slice(pack.revealed, end)) {
    const key = `${card.id}|${tier}`;
    album[key] = { card, tier, count: (album[key]?.count ?? 0) + 1 };
  }
  set({ pack: { ...pack, revealed: end }, album });
}

export function clearAlbum() {
  set({ album: {}, packsOpened: 0, pack: null });
}

export function updateSound(patch) {
  const sound = { ...state.sound, ...patch };
  setMuted(sound.muted);
  setVolume(sound.volume);
  set({ sound });
}
