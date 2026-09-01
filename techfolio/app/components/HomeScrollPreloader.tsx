"use client";

import { useEffect, useRef } from "react";
import {
	getDetailDeepImageUrls,
	getDetailWarmImageUrls,
	getHomeCardImageUrls,
	preloadImages,
} from "../lib/image-preload";

/**
 * On the homepage: once the user starts scrolling, warm project-card and
 * detail-page images in the background so later pages open without blank waits.
 */
export function HomeScrollPreloader() {
	const startedRef = useRef(false);
	const deepStartedRef = useRef(false);

	useEffect(() => {
		let cancelled = false;

		const runWarm = async () => {
			if (startedRef.current || cancelled) return;
			startedRef.current = true;

			const homeCards = getHomeCardImageUrls();
			const warm = getDetailWarmImageUrls();

			await preloadImages(homeCards, 4);
			if (cancelled) return;
			await preloadImages(warm, 3);
		};

		const runDeep = async () => {
			if (deepStartedRef.current || cancelled) return;
			deepStartedRef.current = true;
			await preloadImages(getDetailDeepImageUrls(), 2);
		};

		const onFirstScroll = () => {
			void runWarm();
			window.removeEventListener("scroll", onFirstScroll);
			window.removeEventListener("touchmove", onFirstScroll);
			window.removeEventListener("wheel", onFirstScroll);
		};

		window.addEventListener("scroll", onFirstScroll, { passive: true });
		window.addEventListener("touchmove", onFirstScroll, { passive: true });
		window.addEventListener("wheel", onFirstScroll, { passive: true });

		const projects = document.getElementById("projects");
		let observer: IntersectionObserver | null = null;

		if (projects && "IntersectionObserver" in window) {
			observer = new IntersectionObserver(
				(entries) => {
					if (!entries.some((entry) => entry.isIntersecting)) return;
					void runWarm();
					void runDeep();
					observer?.disconnect();
				},
				{ rootMargin: "240px 0px" },
			);
			observer.observe(projects);
		}

		// Gentle idle warm of homepage cards even before scroll (low priority).
		let idleId: number | ReturnType<typeof setTimeout> | undefined;
		const scheduleIdle =
			typeof window.requestIdleCallback === "function"
				? () =>
						window.requestIdleCallback(
							() => {
								if (!startedRef.current) {
									void preloadImages(getHomeCardImageUrls(), 2);
								}
							},
							{ timeout: 2500 },
						)
				: () =>
						window.setTimeout(() => {
							if (!startedRef.current) {
								void preloadImages(getHomeCardImageUrls(), 2);
							}
						}, 1800);

		idleId = scheduleIdle();

		return () => {
			cancelled = true;
			window.removeEventListener("scroll", onFirstScroll);
			window.removeEventListener("touchmove", onFirstScroll);
			window.removeEventListener("wheel", onFirstScroll);
			observer?.disconnect();
			if (typeof idleId === "number") {
				if (typeof window.cancelIdleCallback === "function") {
					window.cancelIdleCallback(idleId);
				}
				window.clearTimeout(idleId);
			}
		};
	}, []);

	return null;
}
