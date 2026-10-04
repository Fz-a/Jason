"use client";

import { useEffect, useState, type ReactNode } from "react";
import { isGateUnlocked, tryUnlockGate } from "../lib/gate";

/**
 * Client-side password lock for the corner-nav pages (/studio, /Introduce).
 * Shares the session unlock with CornerNav and /py via lib/gate — entering
 * the password once anywhere skips the prompt everywhere this session.
 *
 * Note: this is front-end gating only (the site is a static export), it
 * keeps casual visitors out rather than determined ones.
 */
export function GateLock({
	kicker,
	title,
	children,
}: {
	kicker: string;
	title: string;
	children: ReactNode;
}) {
	// Start locked everywhere (SSR + first client render agree), then read
	// the session flag after mount to avoid hydration mismatch.
	const [unlocked, setUnlocked] = useState(false);
	const [input, setInput] = useState("");
	const [error, setError] = useState(false);

	useEffect(() => {
		if (isGateUnlocked()) setUnlocked(true);
	}, []);

	function submit(e: React.FormEvent) {
		e.preventDefault();
		if (tryUnlockGate(input)) {
			setUnlocked(true);
		} else {
			setError(true);
			setInput("");
		}
	}

	if (unlocked) return <>{children}</>;

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#0F2A24] px-4">
			<form
				onSubmit={submit}
				className="w-full max-w-xs border border-[#F7F1E8]/15 bg-[#F7F1E8] p-8 shadow-2xl"
			>
				<p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/60">
					{kicker}
				</p>
				<h1 className="mt-2 text-xl font-extrabold tracking-tight text-[#162b26]">
					{title}
				</h1>
				<input
					type="password"
					autoFocus
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
						setError(false);
					}}
					placeholder="Password"
					className={`mt-6 w-full border px-3.5 py-2.5 text-sm outline-none transition-colors ${
						error
							? "border-red-400 bg-red-50"
							: "border-[#162b26]/15 focus:border-[#0F4C45]"
					}`}
				/>
				{error ? (
					<p className="mt-2 text-xs text-red-500">
						Wrong password, try again.
					</p>
				) : null}
				<button
					type="submit"
					className="mt-4 w-full bg-[#0F4C45] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					Enter
				</button>
			</form>
		</main>
	);
}
