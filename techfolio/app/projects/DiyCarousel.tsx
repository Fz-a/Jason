"use client";

import { gsap } from "gsap";
import Image from "next/image";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type PointerEvent as ReactPointerEvent,
} from "react";
import type { MakeDiyItem } from "./make-essay";

/** Shared mat — same size for every card; photos scale inside. */
const FRAME_ASPECT = 3 / 4;
const GAP_PX = 22;
const LOOP_SETS = 3;

function useVisibleCount() {
	const [count, setCount] = useState(3);

	useEffect(() => {
		const update = () => {
			const w = window.innerWidth;
			if (w < 640) setCount(1);
			else if (w < 1024) setCount(2);
			else setCount(3);
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	return count;
}

function CarouselCard({ item }: { item: MakeDiyItem }) {
	return (
		<figure className="group flex min-w-0 flex-col">
			<div
				className="relative flex w-full items-center justify-center overflow-hidden rounded-[1.15rem] bg-[#F4F1EC] sm:rounded-[1.35rem]"
				style={{ aspectRatio: FRAME_ASPECT }}
			>
				<Image
					src={item.image.src}
					alt={item.image.alt}
					width={item.image.width}
					height={item.image.height}
					sizes="(max-width: 640px) 82vw, (max-width: 1024px) 40vw, 260px"
					draggable={false}
					className="max-h-[82%] max-w-[82%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
				/>
			</div>
			<figcaption className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
				<p className="min-w-0 truncate text-[0.8rem] font-medium tracking-[-0.01em] text-[#162b26]">
					{item.title}
				</p>
				<span className="shrink-0 font-mono text-[0.68rem] tracking-[0.06em] text-[#8A9692]">
					{item.year}
				</span>
			</figcaption>
		</figure>
	);
}

type Slide = MakeDiyItem & { key: string };

export function DiyCarousel({ items }: { items: MakeDiyItem[] }) {
	const n = items.length;
	const visible = useVisibleCount();
	const [cardWidth, setCardWidth] = useState(0);
	const [dragging, setDragging] = useState(false);

	const shellRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const xRef = useRef(0);
	const indexRef = useRef(n); // start in middle copy
	const stepRef = useRef(0);
	const nRef = useRef(n);
	const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const wheelLock = useRef(false);

	const dragRef = useRef<{
		pointerId: number;
		startX: number;
		originX: number;
	} | null>(null);

	nRef.current = n;

	const slides: Slide[] = useMemo(() => {
		const out: Slide[] = [];
		for (let set = 0; set < LOOP_SETS; set++) {
			for (const item of items) {
				out.push({ ...item, key: `${set}-${item.id}` });
			}
		}
		return out;
	}, [items]);

	/** Keep logical index inside the middle copy [n, 2n). */
	const normalizeIndex = useCallback((i: number) => {
		if (nRef.current <= 0) return i;
		const len = nRef.current;
		let next = i;
		while (next < len) next += len;
		while (next >= len * 2) next -= len;
		return next;
	}, []);

	const applyX = useCallback((x: number, animate: boolean, onDone?: () => void) => {
		const track = trackRef.current;
		if (!track) return;
		xRef.current = x;
		if (animate) {
			gsap.to(track, {
				x,
				duration: 0.88,
				ease: "power3.out",
				overwrite: "auto",
				onComplete: onDone,
			});
		} else {
			gsap.set(track, { x });
			onDone?.();
		}
	}, []);

	const jumpNormalize = useCallback(() => {
		const len = nRef.current;
		if (len <= 0) return;
		const raw = indexRef.current;
		const mid = normalizeIndex(raw);
		if (mid === raw) return;
		indexRef.current = mid;
		const x = -mid * stepRef.current;
		applyX(x, false);
	}, [applyX, normalizeIndex]);

	const snapTo = useCallback(
		(nextIndex: number, animate = true) => {
			if (nRef.current <= 0) return;
			indexRef.current = nextIndex;
			const x = -nextIndex * stepRef.current;
			applyX(x, animate, () => {
				jumpNormalize();
			});
		},
		[applyX, jumpNormalize],
	);

	const snapNearest = useCallback(() => {
		const step = stepRef.current || 1;
		const nearest = Math.round(-xRef.current / step);
		snapTo(nearest, true);
	}, [snapTo]);

	const stepBy = useCallback(
		(dir: number) => {
			snapTo(indexRef.current + dir, true);
		},
		[snapTo],
	);

	useLayoutEffect(() => {
		const el = viewportRef.current;
		if (!el || n <= 0) return;

		const measure = () => {
			const w = el.clientWidth;
			const nextW = (w - GAP_PX * (visible - 1)) / visible;
			setCardWidth(nextW);
			stepRef.current = nextW + GAP_PX;
			indexRef.current = normalizeIndex(indexRef.current);
			applyX(-indexRef.current * stepRef.current, false);
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => ro.disconnect();
	}, [visible, n, applyX, normalizeIndex]);

	useEffect(() => {
		const shell = shellRef.current;
		if (!shell || n <= 1) return;

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			const dominant =
				Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			if (dominant === 0) return;

			if (!wheelLock.current && Math.abs(dominant) > 28) {
				wheelLock.current = true;
				stepBy(dominant > 0 ? 1 : -1);
				window.setTimeout(() => {
					wheelLock.current = false;
				}, 400);
				return;
			}
			if (wheelLock.current) return;

			applyX(xRef.current - dominant, false);
			if (snapTimer.current) clearTimeout(snapTimer.current);
			snapTimer.current = setTimeout(() => snapNearest(), 90);
		};

		shell.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			shell.removeEventListener("wheel", onWheel);
			if (snapTimer.current) clearTimeout(snapTimer.current);
		};
	}, [n, applyX, snapNearest, stepBy]);

	const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (e.button !== 0 || n <= 1) return;
		gsap.killTweensOf(trackRef.current);
		dragRef.current = {
			pointerId: e.pointerId,
			startX: e.clientX,
			originX: xRef.current,
		};
		setDragging(true);
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
		const drag = dragRef.current;
		if (!drag || drag.pointerId !== e.pointerId) return;
		applyX(drag.originX + (e.clientX - drag.startX), false);
	};

	const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
		const drag = dragRef.current;
		if (!drag || drag.pointerId !== e.pointerId) return;
		dragRef.current = null;
		setDragging(false);
		const dx = e.clientX - drag.startX;
		const step = stepRef.current || 1;
		const threshold = Math.max(40, step * 0.16);
		let next = Math.round(-xRef.current / step);
		if (dx <= -threshold) next = indexRef.current + 1;
		else if (dx >= threshold) next = indexRef.current - 1;
		snapTo(next, true);
		try {
			e.currentTarget.releasePointerCapture(e.pointerId);
		} catch {
			/* already released */
		}
	};

	if (n === 0) return null;

	return (
		<div ref={shellRef} className="relative outline-none">
			<div
				ref={viewportRef}
				className="relative touch-pan-y select-none overflow-hidden"
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				role="region"
				aria-roledescription="carousel"
				aria-label="DIY builds gallery"
			>
				<div
					ref={trackRef}
					className="flex will-change-transform"
					style={{
						gap: GAP_PX,
						cursor: dragging ? "grabbing" : "grab",
					}}
				>
					{slides.map((item) => (
						<div
							key={item.key}
							className="shrink-0"
							style={{
								width: cardWidth > 0 ? cardWidth : undefined,
								flexBasis:
									cardWidth > 0
										? undefined
										: `calc((100% - ${GAP_PX * (visible - 1)}px) / ${visible})`,
							}}
						>
							<CarouselCard item={item} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
