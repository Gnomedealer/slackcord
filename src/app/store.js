import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chatSlice";
import sessionReducer from "../features/sessionSlice";

const STORAGE_KEY = "slackcord.v1";

export function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
}

export function makeStore(preloadedState) {
  const store = configureStore({
    reducer: { chat: chatReducer, session: sessionReducer },
    preloadedState,
  });

  // Save to the browser whenever something changes (batched so a burst
  // of updates only writes once).
  let pending = null;
  store.subscribe(() => {
    if (pending) return;
    pending = setTimeout(() => {
      pending = null;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()));
      } catch {
        // Storage full or blocked: the app keeps working for this visit.
      }
    }, 100);
  });

  return store;
}

export function resetSavedData() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
