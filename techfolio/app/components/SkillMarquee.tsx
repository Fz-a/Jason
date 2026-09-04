"use client";

import type { ReactNode } from "react";
import { useLocale } from "../lib/i18n";

type IconKind =
	| "cube"
	| "draft"
	| "orbit"
	| "circuit"
	| "chip"
	| "board"
	| "bot"
	| "eye"
	| "code"
	| "plot"
	| "mesh";

type SkillItem = {
	id: string;
	name: string;
	icon: IconKind;
};

/**
 * Placeholder stack — replace / reorder later with your real skills.
 * Keep `id` stable when renaming for future i18n.
 */
export const SKILL_ITEMS: SkillItem[] = [
	{ id: "inventor", name: "Inventor", icon: "cube" },
	{ id: "fusion360", name: "Fusion 360", icon: "orbit" },
	{ id: "sketchup", name: "SketchUp", icon: "cube" },
	{ id: "solidworks", name: "SolidWorks", icon: "cube" },
	{ id: "autocad", name: "AutoCAD", icon: "draft" },
	{ id: "kicad", name: "KiCad", icon: "circuit" },
	{ id: "altium", name: "Altium", icon: "circuit" },
	{ id: "stm32", name: "STM32", icon: "chip" },
	{ id: "arduino", name: "Arduino", icon: "board" },
	{ id: "ros2", name: "ROS 2", icon: "bot" },
	{ id: "opencv", name: "OpenCV", icon: "eye" },
	{ id: "python", name: "Python", icon: "code" },
	{ id: "cpp", name: "C / C++", icon: "code" },
	{ id: "matlab", name: "MATLAB", icon: "plot" },
	{ id: "gazebo", name: "Gazebo", icon: "bot" },
	{ id: "blender", name: "Blender", icon: "mesh" },
];

function SkillIcon({ kind }: { kind: IconKind }) {
	const common = {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 1.5,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
		"aria-hidden": true as const,
		className: "skill-marquee__icon",
	};

	const paths: Record<IconKind, ReactNode> = {
		cube: (
			<>
				<path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" />
				<path d="M12 12v8.5M12 12 20 8M12 12 4 8" />
			</>
		),
		draft: (
			<>
				<path d="M4 19h16" />
				<path d="M7 16 14.5 4.5l3 1.7L10 17.8 7 16Z" />
				<path d="M12.2 7.2 15.8 9.2" />
			</>
		),
		orbit: (
			<>
				<circle cx="12" cy="12" r="2.2" />
				<path d="M12 4.5a12 7.2 0 0 1 0 15 12 7.2 0 0 1 0-15Z" />
				<path d="M5.2 8.2a12 7.2 60 0 1 13.6 7.6 12 7.2 60 0 1-13.6-7.6Z" />
			</>
		),
		circuit: (
			<>
				<circle cx="6" cy="6" r="1.6" />
				<circle cx="18" cy="6" r="1.6" />
				<circle cx="6" cy="18" r="1.6" />
				<circle cx="18" cy="18" r="1.6" />
				<path d="M7.6 6H16.4M6 7.6V16.4M18 7.6V16.4M7.6 18H16.4" />
				<path d="M12 6v4M12 14v4M6 12h4M14 12h4" />
			</>
		),
		chip: (
			<>
				<rect x="7" y="7" width="10" height="10" rx="1.2" />
				<path d="M10 10h4v4h-4z" />
				<path d="M9 4.5v2.5M12 4.5v2.5M15 4.5v2.5M9 17v2.5M12 17v2.5M15 17v2.5M4.5 9h2.5M4.5 12h2.5M4.5 15h2.5M17 9h2.5M17 12h2.5M17 15h2.5" />
			</>
		),
		board: (
			<>
				<rect x="4.5" y="6" width="15" height="12" rx="1.5" />
				<path d="M8 6V4.5M12 6V4.5M16 6V4.5M8 19.5V18M12 19.5V18M16 19.5V18" />
				<circle cx="9" cy="12" r="1.2" />
				<path d="M12.5 10.5h4v3h-4z" />
			</>
		),
		bot: (
			<>
				<rect x="6.5" y="9" width="11" height="9" rx="2" />
				<path d="M12 6.5V9M9 6.5h6" />
				<circle cx="9.8" cy="13.2" r="1" />
				<circle cx="14.2" cy="13.2" r="1" />
				<path d="M4.5 12.5h2M17.5 12.5h2" />
			</>
		),
		eye: (
			<>
				<path d="M3.5 12s3.2-5.5 8.5-5.5S20.5 12 20.5 12s-3.2 5.5-8.5 5.5S3.5 12 3.5 12Z" />
				<circle cx="12" cy="12" r="2.2" />
			</>
		),
		code: (
			<>
				<path d="M8.5 8 4.5 12l4 4" />
				<path d="M15.5 8l4 4-4 4" />
				<path d="M13.2 7.5 10.8 16.5" />
			</>
		),
		plot: (
			<>
				<path d="M5 19V5" />
				<path d="M5 19h14" />
				<path d="M8 15.5 11.2 11l2.6 2.4L17.5 8" />
			</>
		),
		mesh: (
			<>
				<path d="M12 4.5 19 9v6l-7 4.5L5 15V9l7-4.5Z" />
				<path d="M12 4.5v15M5 9l7 4 7-4M5 15l7-4 7 4" />
			</>
		),
	};

	return <svg {...common}>{paths[kind]}</svg>;
}

function MarqueeRow({
	items,
	direction,
	offset,
}: {
	items: SkillItem[];
	direction: "left" | "right";
	offset?: boolean;
}) {
	const loop = [...items, ...items];
	return (
		<div
			className={`skill-marquee__viewport${offset ? " skill-marquee__viewport--offset" : ""}`}
		>
			<div
				className={`skill-marquee__track skill-marquee__track--${direction}`}
				aria-hidden="true"
			>
				{loop.map((item, i) => (
					<span key={`${item.id}-${i}`} className="skill-marquee__cell">
						<span className="skill-marquee__chip">
							<SkillIcon kind={item.icon} />
							<span className="skill-marquee__mark">{item.name}</span>
						</span>
					</span>
				))}
			</div>
		</div>
	);
}

export function SkillMarquee() {
	const { t } = useLocale();
	const rowA = SKILL_ITEMS.filter((_, i) => i % 2 === 0);
	const rowB = SKILL_ITEMS.filter((_, i) => i % 2 === 1);

	return (
		<section
			id="skills"
			aria-label={t("skills.label")}
			className="skill-marquee"
		>
			<div className="skill-marquee__rule" aria-hidden="true" />

			<div className="skill-marquee__body">
				<p className="skill-marquee__label">{t("skills.label")}</p>

				<div className="skill-marquee__rows">
					<MarqueeRow items={rowA} direction="left" />
					<MarqueeRow items={rowB} direction="right" offset />
				</div>

				<ul className="sr-only">
					{SKILL_ITEMS.map((item) => (
						<li key={item.id}>{item.name}</li>
					))}
				</ul>
			</div>

			<div className="skill-marquee__rule" aria-hidden="true" />
		</section>
	);
}
