"use client";

import { useLocale } from "../lib/i18n";

/** Tool / stack names as quiet partner-style wordmarks. Edit freely. */
export const SKILL_MARKS = [
	"Inventor",
	"Fusion 360",
	"SketchUp",
	"SolidWorks",
	"AutoCAD",
	"KiCad",
	"Altium",
	"STM32",
	"Arduino",
	"ROS 2",
	"OpenCV",
	"Python",
	"C / C++",
	"MATLAB",
	"Gazebo",
	"Blender",
] as const;

export function SkillMarquee() {
	const { t } = useLocale();
	const loop = [...SKILL_MARKS, ...SKILL_MARKS];

	return (
		<section
			id="skills"
			aria-label={t("skills.label")}
			className="skill-marquee"
		>
			<div className="skill-marquee__rule" aria-hidden="true" />

			<div className="skill-marquee__body">
				<p className="skill-marquee__label">{t("skills.label")}</p>

				<div className="skill-marquee__viewport">
					<div className="skill-marquee__track" aria-hidden="true">
						{loop.map((name, i) => (
							<span key={`${name}-${i}`} className="skill-marquee__cell">
								<span className="skill-marquee__mark">{name}</span>
								<span className="skill-marquee__sep" aria-hidden="true" />
							</span>
						))}
					</div>
				</div>

				<ul className="sr-only">
					{SKILL_MARKS.map((name) => (
						<li key={name}>{name}</li>
					))}
				</ul>
			</div>

			<div className="skill-marquee__rule" aria-hidden="true" />
		</section>
	);
}
