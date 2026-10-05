"use client";

export interface ActivityEntry {
  id: number;
  action: string;
  detail?: string;
  date: string;
}

const KEY = "ece_activity_v1";
const MAX = 100;

export function getActivity(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function logActivity(action: string, detail?: string) {
  if (typeof window === "undefined") return;
  const entries = getActivity();
  entries.unshift({ id: Date.now(), action, detail, date: new Date().toISOString() });
  window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
  window.dispatchEvent(new Event("ece-activity"));
}
