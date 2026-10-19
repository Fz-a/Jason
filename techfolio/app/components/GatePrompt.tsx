"use client";

import { useEffect, useState } from "react";
import { tryUnlockGate } from "../lib/gate";

type GatePromptProps = {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
};

/** Shared password dialog used by the corner menu and the hero entry. */
export function GatePrompt({ open, onClose, onSuccess }: GatePromptProps) {
	const [input, setInput] = useState("");
	const [error, setError] = useState(false);

	function reset() {
		setInput("");
		setError(false);
	}

	function close() {
		reset();
		onClose();
	}

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F2A24]/50 px-4 backdrop-blur-sm"
			onClick={close}
		>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					if (tryUnlockGate(input)) {
						reset();
						onSuccess();
					} else {
						setError(true);
						setInput("");
					}
				}}
				onClick={(event) => event.stopPropagation()}
				className="w-full max-w-xs rounded-2xl bg-white p-7 shadow-2xl"
			>
				<p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/60">
					Password required
				</p>
				<input
					type="password"
					autoFocus
					value={input}
					onChange={(event) => {
						setInput(event.target.value);
						setError(false);
					}}
					placeholder="Enter password"
					className={`mt-4 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${
						error
							? "border-red-400 bg-red-50"
							: "border-[#162b26]/15 focus:border-[#0F4C45]"
					}`}
				/>
				{error ? (
					<p className="mt-2 text-xs text-red-500">Wrong password, try again</p>
				) : null}
				<button
					type="submit"
					className="mt-4 w-full rounded-lg bg-[#0F4C45] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					Enter
				</button>
			</form>
		</div>
	);
}
