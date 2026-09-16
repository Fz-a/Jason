"use client";

import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type CSSProperties,
	type ElementType,
	type ReactNode,
} from "react";
import { CopyOverrideProvider, useLocale } from "./i18n";
import { StudioTextFrame, useStudioEdit } from "./studio-edit";
import {
	DEFAULT_ELEMENT_LAYOUT,
	elementStyle,
	normalizePageLayout,
	sectionLayoutOf,
	sectionStyle,
	visibleOrder,
	type ElementLayout,
	type PageLayoutFile,
	type PageSectionId,
} from "./page-layout";
import pageLayoutSeed from "../../content/page-layout.json";

const ElementLayoutContext = createContext<Record<string, ElementLayout>>({});

export function usePageLayout() {
	const [layout, setLayout] = useState<PageLayoutFile>(() =>
		normalizePageLayout(pageLayoutSeed),
	);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch("/api/page-layout/");
				if (!res.ok) return;
				const data = normalizePageLayout(await res.json());
				if (!cancelled) setLayout(data);
			} catch {
				/* keep seed */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	return layout;
}

export function PageLayoutRoot({
	layout,
	children,
}: {
	layout: PageLayoutFile;
	children: ReactNode;
}) {
	const overrides = layout.copy.en ?? {};
	const elements = layout.elements ?? {};
	return (
		<CopyOverrideProvider overrides={overrides}>
			<ElementLayoutContext.Provider value={elements}>
				{children}
			</ElementLayoutContext.Provider>
		</CopyOverrideProvider>
	);
}

export function useElementLayout(key: string): ElementLayout {
	const map = useContext(ElementLayoutContext);
	const studio = useStudioEdit();
	return useMemo(() => {
		if (studio?.enabled) return studio.getElement(key);
		return { ...DEFAULT_ELEMENT_LAYOUT, ...map[key] };
	}, [map, key, studio]);
}

/**
 * Live site / Studio: text that carries element layout.
 * In Studio preview → InDesign-style selectable frame on the real page.
 */
export function LayoutText({
	k,
	className = "",
	as: Tag = "span",
	multiline = false,
}: {
	k: string;
	className?: string;
	as?: ElementType;
	multiline?: boolean;
}) {
	const { t } = useLocale();
	const studio = useStudioEdit();
	const lay = useElementLayout(k);
	const style = elementStyle(lay) as CSSProperties;
	const cls = multiline ? `${className} whitespace-pre-line`.trim() : className;

	if (studio?.enabled) {
		return (
			<StudioTextFrame
				k={k}
				multiline={multiline}
				className={cls}
				style={style}
				as={Tag}
			/>
		);
	}

	return (
		<Tag className={cls} style={style}>
			{t(k)}
		</Tag>
	);
}

export function PageSectionFrame({
	id,
	layout,
	children,
}: {
	id: PageSectionId;
	layout: PageLayoutFile;
	children: ReactNode;
}) {
	if (layout.hidden.includes(id)) return null;
	const lay = sectionLayoutOf(layout, id);
	const style = {
		...sectionStyle(lay),
		zoom: lay.scale !== 1 ? lay.scale : undefined,
	} as CSSProperties;

	return (
		<div data-page-section={id} className="page-section-frame" style={style}>
			{children}
		</div>
	);
}

export function orderedVisible(layout: PageLayoutFile): PageSectionId[] {
	return visibleOrder(layout);
}
