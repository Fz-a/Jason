"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isGateUnlocked } from "../lib/gate";
import { GatePrompt } from "./GatePrompt";

type CornerNavMode = "menu" | "back";

const MENU_ITEMS = [
	{ label: "Jupyter", href: "/py/" },
	{ label: "Introduce", href: "/Introduce/" },
	{ label: "Low-altitude", href: "/low-altitude/index.html" },
	{ label: "Studio", href: "/studio/" },
] as const;

/**
 * Small circle pinned to the top-right corner. Hovering expands it:
 * - "menu" (homepage): Jupyter / Introduce / Low-altitude / Studio, each gated by password
 * - "back" (inner pages): a "Back" link in the same spot
 */
export function CornerNav({ mode }: { mode: CornerNavMode }) {
	const router = useRouter();
	const [askPasswordFor, setAskPasswordFor] = useState<string | null>(null);
	// Touch devices have no hover — also open on tap.
	const [open, setOpen] = useState(false);

	function navigate(href: string) {
		// Static HTML lives outside the App Router — a full page load is safer.
		if (href.endsWith(".html")) {
			window.location.assign(href);
		} else {
			router.push(href);
		}
	}

	function go(href: string) {
		if (isGateUnlocked()) {
			setOpen(false);
			navigate(href);
		} else {
			setOpen(false);
			setAskPasswordFor(href);
		}
	}

	return (
		<>
			<div className="group fixed right-5 top-5 z-50 flex flex-col items-end">
				{mode === "menu" ? (
					<>
						{/* the orb — tap toggles the menu (hover works too) */}
						<button
							type="button"
							aria-label="menu"
							aria-expanded={open}
							onClick={() => setOpen((o) => !o)}
							className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#043439] text-white shadow-lg transition-transform duration-200 hover:scale-105"
						>
							<span className="flex gap-1">
								<span className="h-1 w-1 rounded-full bg-white/90" />
								<span className="h-1 w-1 rounded-full bg-white/90" />
								<span className="h-1 w-1 rounded-full bg-white/90" />
							</span>
						</button>
						{/* expanding menu — open on hover OR tap */}
						<div
							className={`mt-2 overflow-hidden transition-all duration-300 ease-out ${
								open
									? "pointer-events-auto max-h-48 opacity-100"
									: "pointer-events-none max-h-0 opacity-0"
							} group-hover:pointer-events-auto group-hover:max-h-48 group-hover:opacity-100`}
						>
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
							aria-label="Back to home"
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
								Back
							</button>
						</div>
					</>
				)}
			</div>

			{/* password modal */}
			<GatePrompt
				open={askPasswordFor !== null}
				onClose={() => setAskPasswordFor(null)}
				onSuccess={() => {
					const href = askPasswordFor;
					setAskPasswordFor(null);
					if (href) navigate(href);
				}}
			/>
		</>
	);
}
