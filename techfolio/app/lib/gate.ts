/** Shared password gate for the corner nav + /py playground. */

/** Change your password here. */
export const GATE_PASSWORD = "1029";

const KEY = "corner-gate-unlocked-v1";

/** Whether the visitor has entered the password this browser session. */
export function isGateUnlocked(): boolean {
	if (typeof sessionStorage === "undefined") return false;
	return sessionStorage.getItem(KEY) === "1";
}

/** Check a candidate password. On success, remember it for the session. */
export function tryUnlockGate(candidate: string): boolean {
	if (candidate === GATE_PASSWORD) {
		try {
			sessionStorage.setItem(KEY, "1");
		} catch {
			// ignore storage failures (e.g. private mode) — still unlock in-memory
		}
		return true;
	}
	return false;
}
