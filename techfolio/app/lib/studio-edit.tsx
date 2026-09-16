"use client";

import {
	createContext,
	useContext,
	useRef,
	type CSSProperties,
	type ElementType,
	type PointerEvent as ReactPointerEvent,
	type ReactNode,
} from "react";
import {
	DEFAULT_ELEMENT_LAYOUT,
	type ElementLayout,
} from "./page-layout";

export type StudioEditApi = {
	enabled: true;
	activeKey: string | null;
	setActiveKey: (key: string | null) => void;
	getElement: (key: string) => ElementLayout;
	patchElement: (key: string, patch: Partial<ElementLayout>) => void;
	getText: (key: string) => string;
	setText: (key: string, value: string) => void;
};

const StudioEditContext = createContext<StudioEditApi | null>(null);

export function StudioEditProvider({
	activeKey,
	setActiveKey,
	getElement,
	patchElement,
	getText,
	setText,
	children,
}: {
	activeKey: string | null;
	setActiveKey: (key: string | null) => void;
	getElement: (key: string) => ElementLayout;
	patchElement: (key: string, patch: Partial<ElementLayout>) => void;
	getText: (key: string) => string;
	setText: (key: string, value: string) => void;
	children: ReactNode;
}) {
	return (
		<StudioEditContext.Provider
			value={{
				enabled: true,
				activeKey,
				setActiveKey,
				getElement,
				patchElement,
				getText,
				setText,
			}}
		>
			{children}
		</StudioEditContext.Provider>
	);
}

export function useStudioEdit() {
	return useContext(StudioEditContext);
}

function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}

type Mode = "move" | "scale" | null;

/**
 * InDesign-style frame on a live text component inside the page preview.
 */
export function StudioTextFrame({
	k,
	multiline,
	className,
	style,
	as: Tag = "span",
}: {
	k: string;
	multiline?: boolean;
	className?: string;
	style?: CSSProperties;
	as?: ElementType;
}) {
	const studio = useStudioEdit();
	const mode = useRef<Mode>(null);
	const start = useRef({
		x: 0,
		y: 0,
		offsetX: 0,
		offsetY: 0,
		fontScale: 1,
	});

	if (!studio) return null;

	const active = studio.activeKey === k;
	const lay = studio.getElement(k);
	const text = studio.getText(k);

	const begin = (e: ReactPointerEvent, next: Mode) => {
		e.preventDefault();
		e.stopPropagation();
		studio.setActiveKey(k);
		mode.current = next;
		start.current = {
			x: e.clientX,
			y: e.clientY,
			offsetX: lay.offsetX,
			offsetY: lay.offsetY,
			fontScale: lay.fontScale,
		};
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onMove = (e: ReactPointerEvent) => {
		if (!mode.current) return;
		const dx = e.clientX - start.current.x;
		const dy = e.clientY - start.current.y;
		if (mode.current === "move") {
			studio.patchElement(k, {
				offsetX: clamp(start.current.offsetX + dx / 14, -24, 24),
				offsetY: clamp(start.current.offsetY + dy / 14, -24, 24),
			});
		} else if (mode.current === "scale") {
			const next = start.current.fontScale + (dx + dy) / 200;
			studio.patchElement(k, {
				fontScale: clamp(Math.round(next * 100) / 100, 0.55, 2.4),
			});
		}
	};

	const end = (e: ReactPointerEvent) => {
		mode.current = null;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* ok */
		}
	};

	const handle =
		"absolute z-20 h-2.5 w-2.5 rounded-[1px] border-2 border-[#e11d48] bg-white shadow";

	return (
		<span
			data-studio-el={k}
			className={`studio-text-frame relative inline-block max-w-full align-top ${
				active ? "z-10" : "z-[1]"
			}`}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				studio.setActiveKey(k);
			}}
		>
			{/* Selection / hover box */}
			<span
				aria-hidden
				className={`pointer-events-none absolute -inset-[3px] rounded-[2px] border transition-colors ${
					active
						? "border-[1.5px] border-[#e11d48]"
						: "border border-dashed border-transparent [.studio-text-frame:hover_&]:border-[#e11d48]/60"
				}`}
			/>

			{active ? (
				multiline ? (
					<textarea
						value={text}
						rows={Math.max(2, text.split("\n").length)}
						onChange={(e) => studio.setText(k, e.target.value)}
						onClick={(e) => e.stopPropagation()}
						className={`${className ?? ""} relative z-[2] w-full min-w-[6rem] resize-y bg-transparent p-0 outline-none`}
						style={style}
					/>
				) : (
					<input
						value={text}
						onChange={(e) => studio.setText(k, e.target.value)}
						onClick={(e) => e.stopPropagation()}
						className={`${className ?? ""} relative z-[2] w-full min-w-[3rem] bg-transparent p-0 outline-none`}
						style={style}
					/>
				)
			) : (
				<Tag className={className} style={style}>
					{text}
				</Tag>
			)}

			{active ? (
				<>
					<span className="pointer-events-none absolute -top-[18px] left-0 z-30 max-w-[14rem] truncate rounded-[2px] bg-[#e11d48] px-1.5 py-0.5 font-mono text-[9px] font-semibold leading-none text-white">
						{k} · {Math.round(lay.fontScale * 100)}%
					</span>
					<span
						title="拖移位置"
						className="absolute -top-[18px] right-0 z-30 cursor-grab rounded-[2px] bg-[#9f1239] px-1 py-0.5 text-[9px] leading-none text-white active:cursor-grabbing"
						onPointerDown={(e) => begin(e, "move")}
						onPointerMove={onMove}
						onPointerUp={end}
						onPointerCancel={end}
					>
						✥
					</span>
					{(
						[
							["-left-1 -top-1", "nwse"],
							["-right-1 -top-1", "nesw"],
							["-left-1 -bottom-1", "nesw"],
							["-right-1 -bottom-1", "nwse"],
						] as const
					).map(([pos, cur]) => (
						<span
							key={pos}
							role="presentation"
							title="拖角缩放字号"
							className={`${handle} ${pos}`}
							style={{ cursor: `${cur}-resize` }}
							onPointerDown={(e) => begin(e, "scale")}
							onPointerMove={onMove}
							onPointerUp={end}
							onPointerCancel={end}
						/>
					))}
				</>
			) : null}
		</span>
	);
}

export { DEFAULT_ELEMENT_LAYOUT };
