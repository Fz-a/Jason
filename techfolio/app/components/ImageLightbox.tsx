"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type LightboxImage = {
	src: string;
	alt: string;
	width: number;
	height: number;
	caption?: string;
};

export function ImageLightbox({
	image,
	open,
	onClose,
}: {
	image: LightboxImage | null;
	open: boolean;
	onClose: () => void;
}) {
	const [scale, setScale] = useState(1);
	const scaleRef = useRef(1);
	const rafRef = useRef(0);

	const applyScale = useCallback((next: number) => {
		const clamped = Math.min(4, Math.max(0.5, next));
		scaleRef.current = clamped;
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = requestAnimationFrame(() => {
			setScale(clamped);
			rafRef.current = 0;
		});
	}, []);

	useEffect(() => {
		if (!open) {
			scaleRef.current = 1;
			setScale(1);
			return;
		}

		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			e.preventDefault();
			e.stopImmediatePropagation();
			onClose();
		};

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			const step = e.deltaY > 0 ? -0.08 : 0.08;
			applyScale(scaleRef.current + step);
		};

		window.addEventListener("keydown", onKey, true);
		window.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			window.removeEventListener("keydown", onKey, true);
			window.removeEventListener("wheel", onWheel);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [open, onClose, applyScale]);

	if (!open || !image) return null;

	return (
		<div
			className="fixed inset-0 z-[80] flex items-center justify-center bg-[#162b26]/55 backdrop-blur-md"
			role="dialog"
			aria-modal="true"
			aria-label={image.alt || "Image preview"}
			onClick={onClose}
		>
			{/* Invisible hit target: only the image itself stops close */}
			<div
				className="relative max-h-[90svh] max-w-[92vw]"
				style={{
					transform: `scale(${scale})`,
					transformOrigin: "center center",
					willChange: "transform",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<Image
					src={image.src}
					alt={image.alt}
					width={image.width}
					height={image.height}
					quality={90}
					sizes="92vw"
					draggable={false}
					priority
					className="pointer-events-none h-auto max-h-[90svh] w-auto max-w-[92vw] select-none object-contain"
				/>
			</div>
		</div>
	);
}

export function ZoomableFrame({
	image,
	children,
	className = "",
}: {
	image: LightboxImage;
	children: ReactNode;
	className?: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={`group/zoom cursor-zoom-in border-0 bg-transparent p-0 text-left ${className}`}
				aria-label={`Enlarge ${image.alt || "image"}`}
			>
				{children}
			</button>
			<ImageLightbox
				image={image}
				open={open}
				onClose={() => setOpen(false)}
			/>
		</>
	);
}
