"use client";

import { useState } from "react";

/** Change your password here. */
const PASSWORD = "1029";
const JL_URL = "/jl/lab/index.html";

export default function PyGate() {
	const [input, setInput] = useState("");
	const [unlocked, setUnlocked] = useState(false);
	const [error, setError] = useState(false);

	function submit(e: React.FormEvent) {
		e.preventDefault();
		if (input === PASSWORD) {
			setUnlocked(true);
		} else {
			setError(true);
			setInput("");
		}
	}

	if (unlocked) {
		return (
			<iframe
				src={JL_URL}
				title="JupyterLite"
				className="fixed inset-0 h-full w-full border-0 bg-[#111]"
			/>
		);
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#0F2A24] px-4">
			<form
				onSubmit={submit}
				className="w-full max-w-xs rounded-2xl bg-white/95 p-8 shadow-2xl"
			>
				<p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/60">
					Python Playground
				</p>
				<h1 className="mt-2 text-xl font-extrabold tracking-tight text-[#162b26]">
					numpy in the browser
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
					className={`mt-6 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${
						error
							? "border-red-400 bg-red-50"
							: "border-[#162b26]/15 focus:border-[#0F4C45]"
					}`}
				/>
				{error ? (
					<p className="mt-2 text-xs text-red-500">Wrong password, try again.</p>
				) : null}
				<button
					type="submit"
					className="mt-4 w-full rounded-lg bg-[#0F4C45] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					Enter
				</button>
			</form>
		</main>
	);
}
