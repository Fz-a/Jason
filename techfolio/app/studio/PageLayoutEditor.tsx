"use client";

import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type DragEvent,
} from "react";
import { AgendaSection } from "../components/AgendaSection";
import { GoalSection } from "../components/GoalSection";
import { ResearchFitNext } from "../components/ResearchFitNext";
import { ResearchSection } from "../components/ResearchSection";
import { CopyOverrideProvider, getDict, type Locale } from "../lib/i18n";
import {
	DEFAULT_ELEMENT_LAYOUT,
	PAGE_SECTIONS,
	defaultPageLayout,
	elementLayoutOf,
	normalizePageLayout,
	type ElementLayout,
	type PageLayoutFile,
	type PageSectionId,
} from "../lib/page-layout";
import { StudioEditProvider } from "../lib/studio-edit";
import { LayoutText } from "../lib/use-page-layout";
import pageLayoutSeed from "../../content/page-layout.json";

const META = Object.fromEntries(PAGE_SECTIONS.map((s) => [s.id, s])) as Record<
	PageSectionId,
	(typeof PAGE_SECTIONS)[number]
>;

function PreviewHome() {
	return (
		<section className="story-slide bg-[#F7F1E8]">
			<div className="story-slide__body flex items-center px-10 lg:px-14">
				<div className="mx-auto w-full max-w-[900px]">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]">
						<LayoutText k="hero.hello" /> · <LayoutText k="hero.role" />
					</p>
					<h1 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-tight text-[#162b26]">
						<LayoutText k="hero.headline" multiline />
					</h1>
					<p className="mt-5 max-w-[28rem] text-[1rem] leading-7 text-[#3E514D]">
						<LayoutText k="hero.blurb" multiline />
					</p>
					<p className="mt-8 text-[0.85rem] font-semibold text-[#043439]">
						<LayoutText k="hero.contact" />
					</p>
				</div>
			</div>
		</section>
	);
}

function PreviewExperience() {
	return (
		<section className="story-slide bg-[#F7F1E8]">
			<div className="story-slide__body flex items-center justify-center px-10">
				<div className="max-w-[36rem] text-center">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						<LayoutText k="core.kicker" />
					</p>
					<p className="mt-3 text-[2.2rem] font-extrabold tracking-tight text-[#162b26]">
						<LayoutText k="core.title" />
					</p>
					<p className="mt-3 text-[0.95rem] text-[#4A5C58]">
						<LayoutText k="core.blurb" multiline />
					</p>
				</div>
			</div>
		</section>
	);
}

function PreviewContact() {
	return (
		<section className="story-slide bg-[#F7F1E8]">
			<div className="story-slide__body flex flex-col items-center justify-center text-center">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					<LayoutText k="contact.kicker" />
				</p>
				<p className="mt-4 text-[1.25rem] font-extrabold text-[#162b26]">
					Jason Chen
				</p>
				<p className="mt-2 text-[0.95rem] text-[#4A5C58]">
					<LayoutText k="hero.role" />
				</p>
				<p className="mt-6 text-[0.85rem] font-semibold text-[#0F4C45]">
					<LayoutText k="nav.cv" />
				</p>
			</div>
		</section>
	);
}

function SectionPreview({ id }: { id: PageSectionId }) {
	switch (id) {
		case "home":
			return <PreviewHome />;
		case "agenda":
			return <AgendaSection onNavigate={() => {}} />;
		case "experience":
			return <PreviewExperience />;
		case "research":
			return <ResearchSection />;
		case "goal":
			return <GoalSection />;
		case "next":
			return <ResearchFitNext />;
		case "contact":
			return <PreviewContact />;
		default:
			return null;
	}
}

type Props = {
	onTip?: (msg: string | null) => void;
};

export function PageLayoutEditor({ onTip }: Props) {
	const [layout, setLayout] = useState<PageLayoutFile>(() =>
		normalizePageLayout(pageLayoutSeed),
	);
	const [locale, setLocale] = useState<Locale>("en");
	const [sectionId, setSectionId] = useState<PageSectionId>("goal");
	const [activeKey, setActiveKey] = useState<string | null>(null);
	const [previewScale, setPreviewScale] = useState(0.52);
	const [saving, setSaving] = useState(false);
	const [ready, setReady] = useState(false);
	const dragId = useRef<PageSectionId | null>(null);
	const dirty = useRef(false);

	const baseDict = useMemo(() => getDict(locale), [locale]);
	const overrides = layout.copy[locale] ?? {};
	const sectionMeta = META[sectionId];

	const getText = useCallback(
		(key: string) => overrides[key] ?? baseDict[key] ?? key,
		[overrides, baseDict],
	);

	const getElement = useCallback(
		(key: string) => elementLayoutOf(layout, key),
		[layout],
	);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch("/api/page-layout/");
				if (!res.ok) throw new Error("load failed");
				const data = normalizePageLayout(await res.json());
				if (!cancelled) {
					setLayout(data);
					setReady(true);
				}
			} catch {
				if (!cancelled) {
					setLayout(defaultPageLayout());
					setReady(true);
					onTip?.("版型配置读取失败，已用默认");
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [onTip]);

	const setText = (key: string, value: string) => {
		dirty.current = true;
		setLayout((prev) => {
			const bag = { ...(prev.copy[locale] ?? {}) };
			const base = baseDict[key] ?? "";
			if (value === base) delete bag[key];
			else bag[key] = value;
			return { ...prev, copy: { ...prev.copy, [locale]: bag } };
		});
	};

	const patchElement = (key: string, patch: Partial<ElementLayout>) => {
		dirty.current = true;
		setLayout((prev) => ({
			...prev,
			elements: {
				...prev.elements,
				[key]: { ...elementLayoutOf(prev, key), ...patch },
			},
		}));
	};

	const resetElement = (key: string) => {
		dirty.current = true;
		setLayout((prev) => {
			const elements = { ...prev.elements };
			delete elements[key];
			return { ...prev, elements };
		});
	};

	const reorder = (from: PageSectionId, to: PageSectionId) => {
		if (from === to) return;
		dirty.current = true;
		setLayout((prev) => {
			const order = [...prev.order];
			const fi = order.indexOf(from);
			const ti = order.indexOf(to);
			if (fi < 0 || ti < 0) return prev;
			order.splice(fi, 1);
			order.splice(ti, 0, from);
			return { ...prev, order };
		});
	};

	const toggleHidden = (id: PageSectionId) => {
		dirty.current = true;
		setLayout((prev) => {
			const hidden = prev.hidden.includes(id)
				? prev.hidden.filter((x) => x !== id)
				: [...prev.hidden, id];
			return { ...prev, hidden };
		});
	};

	const save = async () => {
		setSaving(true);
		try {
			const res = await fetch("/api/page-layout/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(layout),
			});
			if (!res.ok) throw new Error("save failed");
			dirty.current = false;
			onTip?.("已写入 — 回站刷新查看");
		} catch {
			onTip?.("写入失败（需本地 dev）");
		} finally {
			setSaving(false);
		}
	};

	const onDragStart = (id: PageSectionId) => (e: DragEvent) => {
		dragId.current = id;
		e.dataTransfer.effectAllowed = "move";
	};
	const onDragOver = (e: DragEvent) => {
		e.preventDefault();
	};
	const onDrop = (to: PageSectionId) => (e: DragEvent) => {
		e.preventDefault();
		if (dragId.current) reorder(dragId.current, to);
		dragId.current = null;
	};

	const activeLay = activeKey
		? elementLayoutOf(layout, activeKey)
		: DEFAULT_ELEMENT_LAYOUT;
	const isHidden = layout.hidden.includes(sectionId);
	const copyOverrides = useMemo(() => ({ ...overrides }), [overrides]);

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#0F4C45]/10 px-3 py-2">
				<div className="flex items-center gap-0.5 rounded-full bg-[#0F4C45]/[0.06] p-0.5">
					{(
						[
							["en", "EN"],
							["zh-Hans", "简"],
							["zh-Hant", "繁"],
						] as const
					).map(([id, label]) => (
						<button
							key={id}
							type="button"
							onClick={() => setLocale(id)}
							className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold ${
								locale === id
									? "bg-[#043439] text-white"
									: "text-[#0F4C45]/70"
							}`}
						>
							{label}
						</button>
					))}
				</div>
				<label className="flex items-center gap-2 text-[0.68rem] text-[#6A7A76]">
					预览
					<input
						type="range"
						min={0.35}
						max={0.75}
						step={0.01}
						value={previewScale}
						onChange={(e) => setPreviewScale(Number(e.target.value))}
						className="w-24 accent-[#043439]"
					/>
					<span className="font-mono">{Math.round(previewScale * 100)}%</span>
				</label>
				<span className="hidden text-[0.68rem] text-[#8A9692] md:inline">
					{ready
						? "点预览里的文字 → 红框选中 · 拖角放大 · ✥ 平移 · 直接改字"
						: "加载中…"}
				</span>
				<div className="ml-auto flex gap-1">
					<button
						type="button"
						onClick={() => {
							setLayout(defaultPageLayout());
							dirty.current = true;
						}}
						className="rounded-full px-2.5 py-1 text-[0.7rem] font-semibold text-[#0F4C45] hover:bg-white/70"
					>
						重置
					</button>
					<button
						type="button"
						disabled={saving}
						onClick={() => void save()}
						className="rounded-full bg-[#043439] px-3 py-1 text-[0.7rem] font-semibold text-white disabled:opacity-50"
					>
						{saving ? "写入中…" : "写入"}
					</button>
				</div>
			</div>

			<div className="flex min-h-0 flex-1">
				<aside className="hidden w-[11rem] shrink-0 flex-col border-r border-[#0F4C45]/10 bg-[#F7F1E8]/50 lg:flex">
					<p className="px-3 pt-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/45">
						主界
					</p>
					<ul className="mt-2 space-y-0.5 overflow-y-auto px-2 pb-3">
						{layout.order.map((id, i) => {
							const on = sectionId === id;
							const hidden = layout.hidden.includes(id);
							return (
								<li key={id}>
									<button
										type="button"
										draggable
										onDragStart={onDragStart(id)}
										onDragOver={onDragOver}
										onDrop={onDrop(id)}
										onClick={() => {
											setSectionId(id);
											setActiveKey(null);
										}}
										className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left ${
											on
												? "bg-[#043439] text-white"
												: "text-[#162b26] hover:bg-white/80"
										} ${hidden ? "opacity-40" : ""}`}
									>
										<span className="font-mono text-[0.55rem] opacity-50">
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className="truncate text-[0.78rem] font-semibold">
											{META[id].label}
										</span>
									</button>
								</li>
							);
						})}
					</ul>
				</aside>

				{/* Live page preview — InDesign style */}
				<div
					className="studio-indesign-preview min-w-0 flex-1 overflow-auto bg-[#c8c0b4]"
					onClick={() => setActiveKey(null)}
				>
					<div className="flex justify-center px-4 py-6">
						<div
							className="relative overflow-hidden rounded-md shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
							style={
								{
									width: `${100 / previewScale}%`,
									height: `${100 / previewScale}svh`,
									maxHeight: `${100 / previewScale}svh`,
									transform: `scale(${previewScale})`,
									transformOrigin: "top center",
								} as CSSProperties
							}
							onClick={(e) => e.stopPropagation()}
						>
							<CopyOverrideProvider overrides={copyOverrides}>
								<StudioEditProvider
									activeKey={activeKey}
									setActiveKey={setActiveKey}
									getElement={getElement}
									patchElement={patchElement}
									getText={getText}
									setText={setText}
								>
									<div
										className="h-full [&_[data-studio-el]]:pointer-events-auto [&_a]:pointer-events-none [&_button]:pointer-events-none"
										style={{ height: "100svh" }}
									>
										{/* Re-enable studio frames + goal stage nav */}
										<style>{`
											.studio-indesign-preview [data-studio-el] { pointer-events: auto !important; }
											.studio-indesign-preview .goal-split__nav { pointer-events: auto !important; }
										`}</style>
										<SectionPreview id={sectionId} />
									</div>
								</StudioEditProvider>
							</CopyOverrideProvider>
						</div>
					</div>
				</div>

				<aside className="flex w-[15.5rem] shrink-0 flex-col border-l border-[#0F4C45]/10 bg-white/85 xl:w-[17rem]">
					<div className="border-b border-[#0F4C45]/10 px-3 py-3">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/45">
							{sectionMeta.label}
						</p>
						{activeKey ? (
							<>
								<p className="mt-1 truncate font-mono text-[0.7rem] text-[#e11d48]">
									{activeKey}
								</p>
								<button
									type="button"
									onClick={() => resetElement(activeKey)}
									className="mt-2 rounded-full bg-[#0F4C45]/[0.06] px-2.5 py-1 text-[0.68rem] font-semibold text-[#0F4C45]"
								>
									复位此组件
								</button>
							</>
						) : (
							<p className="mt-2 text-[0.78rem] leading-5 text-[#6A7A76]">
								在预览里点任意文字，会出现红框，像 InDesign 一样改。
							</p>
						)}
						<button
							type="button"
							onClick={() => toggleHidden(sectionId)}
							className="mt-3 rounded-full bg-[#0F4C45]/[0.06] px-2.5 py-1 text-[0.68rem] font-semibold text-[#0F4C45]"
						>
							{isHidden ? "显示此屏" : "隐藏此屏"}
						</button>
					</div>

					{activeKey ? (
						<div className="space-y-4 overflow-y-auto px-3 py-3">
							<label className="block">
								<span className="flex justify-between text-[0.68rem] text-[#6A7A76]">
									<span>字号</span>
									<span className="font-mono">
										{Math.round(activeLay.fontScale * 100)}%
									</span>
								</span>
								<input
									type="range"
									min={0.55}
									max={2.4}
									step={0.01}
									value={activeLay.fontScale}
									onChange={(e) =>
										patchElement(activeKey, {
											fontScale: Number(e.target.value),
										})
									}
									className="mt-1.5 w-full accent-[#e11d48]"
								/>
							</label>
							<label className="block">
								<span className="flex justify-between text-[0.68rem] text-[#6A7A76]">
									<span>左右</span>
									<span className="font-mono">
										{activeLay.offsetX.toFixed(1)}
									</span>
								</span>
								<input
									type="range"
									min={-12}
									max={12}
									step={0.25}
									value={activeLay.offsetX}
									onChange={(e) =>
										patchElement(activeKey, {
											offsetX: Number(e.target.value),
										})
									}
									className="mt-1.5 w-full accent-[#e11d48]"
								/>
							</label>
							<label className="block">
								<span className="flex justify-between text-[0.68rem] text-[#6A7A76]">
									<span>上下</span>
									<span className="font-mono">
										{activeLay.offsetY.toFixed(1)}
									</span>
								</span>
								<input
									type="range"
									min={-12}
									max={12}
									step={0.25}
									value={activeLay.offsetY}
									onChange={(e) =>
										patchElement(activeKey, {
											offsetY: Number(e.target.value),
										})
									}
									className="mt-1.5 w-full accent-[#e11d48]"
								/>
							</label>
						</div>
					) : (
						<div className="px-3 py-3">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#0F4C45]/40">
								此屏组件
							</p>
							<ul className="mt-2 space-y-0.5">
								{sectionMeta.fields.map((f) => (
									<li key={f.key}>
										<button
											type="button"
											onClick={() => setActiveKey(f.key)}
											className="w-full truncate rounded-md px-2 py-1.5 text-left text-[0.72rem] text-[#162b26] hover:bg-[#0F4C45]/[0.06]"
										>
											{f.label}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
				</aside>
			</div>
		</div>
	);
}
