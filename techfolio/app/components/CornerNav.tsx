"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isGateUnlocked, tryUnlockGate } from "../lib/gate";

type CornerNavMode = "menu" | "back";

const MENU_ITEMS = [
	{ label: "Jupyter", href: "/py/" },
	{ label: "Introduce", href: "/Introduce/" },
	{ label: "Studio", href: "/studio/" },
] as const;

/**
 * Small circle pinned to the top-right corner. Hovering expands it:
 * - "menu" (homepage): Jupyter / Introduce / Studio, each gated by password
 * - "back" (inner pages): a "返回首页" link in the same spot
 */
export function CornerNav({ mode }: { mode: CornerNavMode }) {
	const router = useRouter();
	const [askPasswordFor, setAskPasswordFor] = useState<string | null>(null);
	const [input, setInput] = useState("");
	const [error, setError] = useState(false);

	function go(href: string) {
		if (isGateUnlocked()) {
			router.push(href);
		} else {
			setInput("");
			setError(false);
			setAskPasswordFor(href);
		}
	}

	function submitPassword(e: React.FormEvent) {
		e.preventDefault();
		if (tryUnlockGate(input) && askPasswordFor) {
			const href = askPasswordFor;
			setAskPasswordFor(null);
			router.push(href);
		} else {
			setError(true);
			setInput("");
		}
	}

	return (
		<>
			<div className="group fixed right-5 top-5 z-50 flex flex-col items-end">
				{mode === "menu" ? (
					<>
						{/* the orb */}
						<div
							aria-label="menu"
							className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#043439] text-white shadow-lg transition-transform duration-200 group-hover:scale-105"
						>
							<span className="flex gap-1">
								<span className="h-1 w-1 rounded-full bg-white/90" />
								<span className="h-1 w-1 rounded-full bg-white/90" />
								<span className="h-1 w-1 rounded-full bg-white/90" />
							</span>
						</div>
						{/* expanding menu */}
						<div className="pointer-events-none mt-2 max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:max-h-48 group-hover:opacity-100">
							<div className="flex flex-col gap-1 rounded-2xl bg-white/95 p-2 shadow-xl ring-1 ring-[#162b26]/10 backdrop-blur">
								{MENU_ITEMS.map((item) => (
									<button
										key={item.href}
										type="button"
										onClick={() => go(item.href)}
										className="cursor-pointer rounded-xl px-5 py-2 text-left text-[0.82rem] font-semibold text-[#162b26] transition-colors hover:bg-[#0F4C45] hover:text-white"
									>
										{item.label}
									</button>
								))}
							</div>
						</div>
					</>
				) : (
					<>
						{/* the orb */}
						<button
							type="button"
							aria-label="返回首页"
							onClick={() => router.push("/")}
							className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#043439] text-white shadow-lg transition-transform duration-200 group-hover:scale-105"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.4"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M19 12H5" />
								<path d="m12 19-7-7 7-7" />
							</svg>
						</button>
						{/* expanding back label */}
						<div className="pointer-events-none mt-2 max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:max-h-16 group-hover:opacity-100">
							<button
								type="button"
								onClick={() => router.push("/")}
								className="cursor-pointer rounded-xl bg-white/95 px-5 py-2 text-[0.82rem] font-semibold text-[#162b26] shadow-xl ring-1 ring-[#162b26]/10 backdrop-blur transition-colors hover:bg-[#0F4C45] hover:text-white"
							>
								返回首页
							</button>
						</div>
					</>
				)}
			</div>

			{/* password modal */}
			{askPasswordFor ? (
				<div
					className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F2A24]/50 px-4 backdrop-blur-sm"
					onClick={() => setAskPasswordFor(null)}
				>
					<form
						onSubmit={submitPassword}
						onClick={(e) => e.stopPropagation()}
						className="w-full max-w-xs rounded-2xl bg-white p-7 shadow-2xl"
					>
						<p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/60">
							需要密码
						</p>
						<input
							type="password"
							autoFocus
							value={input}
							onChange={(e) => {
								setInput(e.target.value);
								setError(false);
							}}
							placeholder="输入密码"
							className={`mt-4 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${
								error
									? "border-red-400 bg-red-50"
									: "border-[#162b26]/15 focus:border-[#0F4C45]"
							}`}
						/>
						{error ? (
							<p className="mt-2 text-xs text-red-500">密码不对，再试一次</p>
						) : null}
						<button
							type="submit"
							className="mt-4 w-full rounded-lg bg-[#0F4C45] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
						>
							进入
						</button>
					</form>
				</div>
			) : null}
		</>
	);
}
