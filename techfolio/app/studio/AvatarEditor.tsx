"use client";

import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	type ChangeEvent,
	type DragEvent,
	type PointerEvent as ReactPointerEvent,
} from "react";
import seedAvatar from "../../content/avatar.json";

export type AvatarSettings = {
	src: string;
	source?: string;
	scale: number;
	tx: number;
	ty: number;
	v?: number;
};

export type AvatarPreview = {
	src: string;
	scale: number;
	tx: number;
	ty: number;
};

export type AvatarEditorHandle = {
	save: () => void;
	pickFile: () => void;
};

const STORAGE_KEY = "techfolio-avatar-draft-v2";
const MIN_SCALE = 1;
const MAX_SCALE = 3.2;

function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}

function panLimit(scale: number) {
	return 18 + (scale - 1) * 42;
}

function normalize(
	raw: Partial<AvatarSettings> & { x?: number; y?: number },
): AvatarSettings {
	const scale = clamp(Number(raw.scale ?? seedAvatar.scale), MIN_SCALE, MAX_SCALE);
	const limit = panLimit(scale);
	let tx = raw.tx;
	let ty = raw.ty;
	if (tx == null && typeof raw.x === "number") tx = (50 - raw.x) * 0.55;
	if (ty == null && typeof raw.y === "number") ty = (50 - raw.y) * 0.55;
	return {
		src: raw.src ?? "/avatar.webp",
		source: raw.source,
		scale,
		tx: clamp(Number(tx ?? seedAvatar.tx), -limit, limit),
		ty: clamp(Number(ty ?? seedAvatar.ty), -limit, limit),
		v: raw.v,
	};
}

type Props = {
	embedded?: boolean;
	onPreviewChange?: (preview: AvatarPreview) => void;
	onTip?: (msg: string | null) => void;
};

export const AvatarEditor = forwardRef<AvatarEditorHandle, Props>(
	function AvatarEditor({ embedded = false, onPreviewChange, onTip }, ref) {
		const seed = normalize(seedAvatar);
		const [settings, setSettings] = useState<AvatarSettings>(seed);
		const [previewSrc, setPreviewSrc] = useState(seed.source ?? seed.src);
		const [fileName, setFileName] = useState<string | null>(null);
		const [uploadFile, setUploadFile] = useState<File | null>(null);
		const [draggingFile, setDraggingFile] = useState(false);
		const [tip, setTip] = useState<string | null>(null);
		const [ready, setReady] = useState(false);
		const [saving, setSaving] = useState(false);
		const drag = useRef<{
			px: number;
			py: number;
			otx: number;
			oty: number;
		} | null>(null);
		const frameRef = useRef<HTMLDivElement>(null);
		const fileRef = useRef<HTMLInputElement>(null);

		const flash = useCallback(
			(msg: string) => {
				setTip(msg);
				onTip?.(msg);
			},
			[onTip],
		);

		useEffect(() => {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (raw) {
					const parsed = normalize(JSON.parse(raw));
					setSettings(parsed);
					const editSrc = parsed.source ?? parsed.src;
					if (!editSrc.startsWith("blob:")) setPreviewSrc(editSrc);
				} else {
					setPreviewSrc(seed.source ?? seed.src);
				}
			} catch {
				/* ignore */
			}
			setReady(true);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useEffect(() => {
			if (!ready) return;
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		}, [settings, ready]);

		useEffect(() => {
			onPreviewChange?.({
				src: previewSrc,
				scale: settings.scale,
				tx: settings.tx,
				ty: settings.ty,
			});
		}, [previewSrc, settings.scale, settings.tx, settings.ty, onPreviewChange]);

		useEffect(() => {
			if (!tip) return;
			const t = window.setTimeout(() => {
				setTip(null);
				onTip?.(null);
			}, 3200);
			return () => window.clearTimeout(t);
		}, [tip, onTip]);

		const applyFile = (file: File) => {
			if (!file.type.startsWith("image/")) {
				flash("请选择图片文件（jpg / png / webp）");
				return;
			}
			const url = URL.createObjectURL(file);
			const probe = new window.Image();
			probe.onload = () => {
				setUploadFile(file);
				setFileName(file.name);
				setPreviewSrc(url);
				setSettings({
					src: "/avatar.webp",
					source: "/avatar-source.jpg",
					scale: 1.45,
					tx: 10,
					ty: -4,
				});
				const mp = (
					(probe.naturalWidth * probe.naturalHeight) /
					1e6
				).toFixed(1);
				flash(
					`已载入 ${probe.naturalWidth}×${probe.naturalHeight}（约 ${mp}MP）· 调好后点保存`,
				);
			};
			probe.onerror = () => flash("图片无法读取，请换一张再试");
			probe.src = url;
		};

		const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) applyFile(file);
			e.target.value = "";
		};

		const onDrop = (e: DragEvent) => {
			e.preventDefault();
			setDraggingFile(false);
			const file = e.dataTransfer.files?.[0];
			if (file) applyFile(file);
		};

		const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			drag.current = {
				px: e.clientX,
				py: e.clientY,
				otx: settings.tx,
				oty: settings.ty,
			};
		};

		const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
			const start = drag.current;
			if (!start || !frameRef.current) return;
			const rect = frameRef.current.getBoundingClientRect();
			const dx = e.clientX - start.px;
			const dy = e.clientY - start.py;
			const limit = panLimit(settings.scale);
			const nextTx = clamp(start.otx + (dx / rect.width) * 100, -limit, limit);
			const nextTy = clamp(start.oty + (dy / rect.height) * 100, -limit, limit);
			setSettings((s) => ({ ...s, tx: nextTx, ty: nextTy }));
		};

		const onPointerUp = () => {
			drag.current = null;
		};

		const onWheel = useCallback((e: WheelEvent) => {
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.06 : 0.06;
			setSettings((s) => {
				const scale = clamp(
					Number((s.scale + delta).toFixed(2)),
					MIN_SCALE,
					MAX_SCALE,
				);
				const limit = panLimit(scale);
				return {
					...s,
					scale,
					tx: clamp(s.tx, -limit, limit),
					ty: clamp(s.ty, -limit, limit),
				};
			});
		}, []);

		useEffect(() => {
			const el = frameRef.current;
			if (!el) return;
			el.addEventListener("wheel", onWheel, { passive: false });
			return () => el.removeEventListener("wheel", onWheel);
		}, [onWheel]);

		const nudge = (dtx: number, dty: number) => {
			setSettings((s) => {
				const limit = panLimit(s.scale);
				return {
					...s,
					tx: clamp(s.tx + dtx, -limit, limit),
					ty: clamp(s.ty + dty, -limit, limit),
				};
			});
		};

		const saveAll = async () => {
			setSaving(true);
			try {
				const payload = {
					src: "/avatar.webp",
					source: "/avatar-source.jpg",
					scale: Number(settings.scale.toFixed(2)),
					tx: Number(settings.tx.toFixed(1)),
					ty: Number(settings.ty.toFixed(1)),
				};
				const form = new FormData();
				form.set("settings", JSON.stringify(payload));
				if (uploadFile) {
					form.set("image", uploadFile, uploadFile.name || "upload.jpg");
				}

				const res = await fetch("/api/avatar/", {
					method: "POST",
					body: form,
				});
				const data = (await res.json()) as {
					ok: boolean;
					error?: string;
					settings?: AvatarSettings;
				};

				if (!res.ok || !data.ok) {
					flash(data.error ?? "保存失败，请确认本地 pnpm dev 正在运行");
					return;
				}

				if (data.settings) {
					const next = normalize(data.settings);
					setSettings(next);
					const bust = data.settings.v ?? Date.now();
					setPreviewSrc(`${next.source ?? "/avatar-source.jpg"}?v=${bust}`);
				}
				setUploadFile(null);
				setFileName(null);
				flash("已保存清晰头像，去首页刷新即可");
			} catch {
				flash("保存失败：开发服务器未开启或接口不可用");
			} finally {
				setSaving(false);
			}
		};

		useImperativeHandle(ref, () => ({
			save: () => void saveAll(),
			pickFile: () => fileRef.current?.click(),
		}));

		const imgStyle = {
			transform: `translate(${settings.tx}%, ${settings.ty}%) scale(${settings.scale})`,
			transformOrigin: "center center",
		} as const;

		return (
			<div
				className={
					embedded
						? "flex h-full flex-col gap-5 overflow-y-auto p-5 sm:p-7"
						: "mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-7 sm:px-6"
				}
			>
				{!embedded ? (
					<div className="text-center">
						<h1 className="text-[1.25rem] font-extrabold tracking-tight text-[#162b26]">
							头像
						</h1>
						<p className="mt-1.5 text-[0.84rem] text-[#5A6B67]">
							尽量上传原图/高清照片，保存后会自动导出清晰且体积小的网页头像
						</p>
					</div>
				) : (
					<div>
						<h2 className="text-[1.05rem] font-extrabold text-[#162b26]">
							编辑头像
						</h2>
						<p className="mt-1 text-[0.78rem] text-[#6A7A76]">
							拖动圆内画面 · 滚轮或下方按钮缩放
						</p>
					</div>
				)}

				<input
					ref={fileRef}
					type="file"
					accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
					className="hidden"
					onChange={onFileInput}
				/>

				{!embedded ? (
					<button
						type="button"
						onClick={() => fileRef.current?.click()}
						onDragEnter={(e) => {
							e.preventDefault();
							setDraggingFile(true);
						}}
						onDragOver={(e) => {
							e.preventDefault();
							setDraggingFile(true);
						}}
						onDragLeave={() => setDraggingFile(false)}
						onDrop={onDrop}
						className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-7 transition ${
							draggingFile
								? "border-[#0F4C45] bg-[#0F4C45]/10"
								: "border-[#0F4C45]/25 bg-white/80 hover:border-[#0F4C45]/45 hover:bg-white"
						}`}
					>
						<span className="text-[0.95rem] font-bold text-[#0F4C45]">
							{fileName ? "换一张图" : "点击选择图片"}
						</span>
						<span className="text-[0.78rem] text-[#6A7A76]">
							或把照片拖到这里 · JPG / PNG
						</span>
						{fileName ? (
							<span className="mt-1 max-w-full truncate rounded-full bg-[#0F4C45]/10 px-3 py-1 text-[0.72rem] font-medium text-[#0F4C45]">
								当前：{fileName}
							</span>
						) : null}
					</button>
				) : null}

				<div
					className="flex flex-1 flex-col items-center justify-center gap-3"
					onDragEnter={(e) => {
						e.preventDefault();
						setDraggingFile(true);
					}}
					onDragOver={(e) => {
						e.preventDefault();
						setDraggingFile(true);
					}}
					onDragLeave={() => setDraggingFile(false)}
					onDrop={onDrop}
				>
					<div
						ref={frameRef}
						onPointerDown={onPointerDown}
						onPointerMove={onPointerMove}
						onPointerUp={onPointerUp}
						onPointerCancel={onPointerUp}
						className={`relative aspect-square cursor-grab overflow-hidden rounded-full bg-[#F0EBE3] shadow-[0_16px_40px_rgba(22,43,38,0.12)] ring-4 ring-white active:cursor-grabbing ${
							embedded ? "w-[min(100%,360px)]" : "w-[min(100%,300px)]"
						} ${draggingFile ? "ring-[#0F4C45]/40" : ""}`}
						style={{ touchAction: "none" }}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={previewSrc}
							alt="Avatar preview"
							draggable={false}
							className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
							style={imgStyle}
						/>
					</div>
					<p className="text-[0.72rem] text-[#8A9692]">
						{fileName ? `当前：${fileName}` : "可直接把图片拖到圆上"}
					</p>
				</div>

				<div className="rounded-2xl border border-[#0F4C45]/10 bg-white/80 px-4 py-4">
					<div className="flex items-center justify-between text-[0.78rem] font-semibold text-[#0F4C45]">
						<span>缩放</span>
						<span>{settings.scale.toFixed(2)}×</span>
					</div>
					<input
						type="range"
						min={MIN_SCALE}
						max={MAX_SCALE}
						step={0.01}
						value={settings.scale}
						onChange={(e) => {
							const scale = Number(e.target.value);
							const limit = panLimit(scale);
							setSettings((s) => ({
								...s,
								scale,
								tx: clamp(s.tx, -limit, limit),
								ty: clamp(s.ty, -limit, limit),
							}));
						}}
						className="mt-2 w-full accent-[#0F4C45]"
					/>
					<div className="mt-3 grid grid-cols-3 gap-2">
						<button
							type="button"
							onClick={() => nudge(-4, 0)}
							className="rounded-full border border-[#0F4C45]/18 py-2 text-[0.8rem] font-semibold text-[#0F4C45]"
						>
							← 左移
						</button>
						<button
							type="button"
							onClick={() => nudge(0, -4)}
							className="rounded-full border border-[#0F4C45]/18 py-2 text-[0.8rem] font-semibold text-[#0F4C45]"
						>
							↑ 上移
						</button>
						<button
							type="button"
							onClick={() => nudge(4, 0)}
							className="rounded-full border border-[#0F4C45]/18 py-2 text-[0.8rem] font-semibold text-[#0F4C45]"
						>
							右移 →
						</button>
						<button
							type="button"
							onClick={() =>
								setSettings((s) => ({
									...s,
									scale: clamp(
										Number((s.scale - 0.1).toFixed(2)),
										MIN_SCALE,
										MAX_SCALE,
									),
								}))
							}
							className="rounded-full border border-[#0F4C45]/18 py-2 text-[0.8rem] font-semibold text-[#0F4C45]"
						>
							缩小
						</button>
						<button
							type="button"
							onClick={() => nudge(0, 4)}
							className="rounded-full border border-[#0F4C45]/18 py-2 text-[0.8rem] font-semibold text-[#0F4C45]"
						>
							↓ 下移
						</button>
						<button
							type="button"
							onClick={() =>
								setSettings((s) => ({
									...s,
									scale: clamp(
										Number((s.scale + 0.1).toFixed(2)),
										MIN_SCALE,
										MAX_SCALE,
									),
								}))
							}
							className="rounded-full border border-[#0F4C45]/18 py-2 text-[0.8rem] font-semibold text-[#0F4C45]"
						>
							放大
						</button>
					</div>
				</div>

				{!embedded ? (
					<>
						<button
							type="button"
							disabled={saving}
							onClick={() => void saveAll()}
							className="w-full rounded-full bg-[#043439] py-3.5 text-[0.92rem] font-bold text-white disabled:opacity-60"
						>
							{saving ? "保存中…" : "保存"}
						</button>
						<button
							type="button"
							onClick={() => {
								const next = normalize(seedAvatar);
								setSettings(next);
								setPreviewSrc(next.source ?? next.src);
								setUploadFile(null);
								setFileName(null);
								flash("已恢复");
							}}
							className="text-center text-[0.75rem] text-[#8A9692] underline-offset-2 hover:underline"
						>
							恢复站点当前头像
						</button>
					</>
				) : null}

				{!embedded && tip ? (
					<div className="fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-full bg-[#0F4C45] px-4 py-2.5 text-center text-[0.78rem] font-semibold text-white">
						{tip}
					</div>
				) : null}
			</div>
		);
	},
);
