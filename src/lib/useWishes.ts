"use client";

import { useEffect, useSyncExternalStore } from "react";
import { fetchWishes, guestbookReady, type Wish } from "./guestbook";

/**
 * Kho lời chúc dùng chung cho danh sách trong khung và bong bóng bay —
 * tải từ Sheet đúng 1 lần, lời chúc vừa gửi được thêm vào ngay.
 */
type State = { wishes: Wish[]; loading: boolean; latest: Wish | null };

let state: State = { wishes: [], loading: guestbookReady, latest: null };
let started = false;
const listeners = new Set<() => void>();
const SERVER_STATE: State = { wishes: [], loading: guestbookReady, latest: null };

function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function load() {
  if (started) return;
  started = true;
  fetchWishes()
    .then((wishes) => set({ wishes }))
    .catch(() => {})
    .finally(() => set({ loading: false }));
}

/** Thêm lời chúc vừa gửi thành công lên đầu danh sách. */
export function addWish(w: Wish) {
  set({ wishes: [w, ...state.wishes], latest: w });
}

export function useWishes() {
  useEffect(load, []);
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
    () => SERVER_STATE,
  );
}
