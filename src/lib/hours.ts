/* ================================================================== */
/*  Opening hours engine — machine-readable + timezone aware          */
/*  Display strings stay in i18n.ts; logic lives here.                */
/* ================================================================== */

import { SITE_CONFIG } from "./config";

/** Weekday numbers match Date.getDay(): 0 = Sunday … 6 = Saturday. */
export type DaySchedule = {
  days: number[]; // which weekdays this row applies to
  open: string; // "HH:MM" (24h)
  close: string; // "HH:MM" (24h)
};

/**
 * Single source of truth for the schedule.
 * Edit here — the Location table labels live in i18n, this drives
 * the "Open now" badge, the booking modal slots and JSON-LD.
 */
export const HOURS: DaySchedule[] = [
  { days: [1, 2, 3, 4, 5], open: "10:00", close: "20:00" }, // Mon–Fri
  { days: [6], open: "10:00", close: "18:00" }, // Saturday
  // Sunday: closed (no entry)
];

const BEIRUT_TZ = "Asia/Beirut";

/** Minutes since midnight for a "HH:MM" string. */
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Current wall-clock pieces in Beirut.
 * Uses Intl to stay correct across DST changes.
 */
export function beirutNow(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BEIRUT_TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  return { day: dayMap[get("weekday")] ?? 0, minutes: hour * 60 + minute };
}

export type OpenState =
  | { open: true; closesAt: string }
  | { open: false; opensDay?: string; opensAt?: string }; // day names handled by callers

/** Is the shop open right now (Beirut time)? */
export function isOpenNow(): OpenState {
  const { day, minutes } = beirutNow();
  const row = HOURS.find((r) => r.days.includes(day));
  if (row && minutes >= toMinutes(row.open) && minutes < toMinutes(row.close)) {
    return { open: true, closesAt: row.close };
  }
  return { open: false };
}

/** Next N days the shop is open, starting today (Beirut time). */
export function upcomingOpenDays(count: number): Date[] {
  const today = beirutNow();
  const result: Date[] = [];
  // Anchor on "today" in Beirut, expressed as a UTC-midnight date for label formatting.
  for (let offset = 0; result.length < count && offset < 14; offset++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + offset);
    // The Beirut weekday for this calendar date:
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: BEIRUT_TZ,
      weekday: "short",
    }).formatToParts(d);
    const wd = parts.find((p) => p.type === "weekday")?.value ?? "";
    const dayMap: Record<string, number> = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    };
    const weekday = dayMap[wd];
    if (!HOURS.some((r) => r.days.includes(weekday))) continue;
    // If it's today and the last slot has passed, skip today.
    if (offset === 0) {
      const row = HOURS.find((r) => r.days.includes(weekday))!;
      const lastSlot = toMinutes(row.close) - 30; // last 30-min slot
      if (today.minutes >= lastSlot) continue;
    }
    result.push(d);
  }
  return result;
}

/** 30-min bookable slots for a given date (based on that day's schedule). */
export function slotsForDate(date: Date): string[] {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BEIRUT_TZ,
    weekday: "short",
  }).formatToParts(date);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "";
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const row = HOURS.find((r) => r.days.includes(dayMap[wd]));
  if (!row) return [];

  const slots: string[] = [];
  for (let m = toMinutes(row.open); m <= toMinutes(row.close) - 30; m += 30) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return slots;
}

/** Weekday number (Beirut) for a date — used for labels. */
export function weekdayOf(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BEIRUT_TZ,
    weekday: "short",
  }).formatToParts(date);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "";
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return dayMap[wd] ?? 0;
}

/**
 * Booking lead time — slots must start at least this many minutes from
 * now so the chair can be prepped (tools sterilized, towel warmed).
 */
export const BOOKING_LEAD_MIN = 30;

/** "YYYY-MM-DD" an instant falls on, in Beirut — for same-day comparisons. */
export function beirutDayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BEIRUT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** The "YYYY-MM-DD" key of the day after `key` (pure calendar math, DST-safe). */
export function nextDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

/** Does `date` fall on today (Beirut time)? */
export function isToday(date: Date): boolean {
  return beirutDayKey(date) === beirutDayKey(new Date());
}

/**
 * Has a 30-min slot effectively passed for booking purposes?
 * True when the slot is today and starts within the lead-time window
 * (or already started). Used to grey out stale slots in the picker.
 */
export function isSlotGone(date: Date, slot: string, leadMin = BOOKING_LEAD_MIN): boolean {
  if (!isToday(date)) return false;
  return toMinutes(slot) <= beirutNow().minutes + leadMin;
}

export const SHOP_TZ = BEIRUT_TZ;
export const SHOP_PHONE_INTL = SITE_CONFIG.phoneDisplay.replace(/\s/g, "");
