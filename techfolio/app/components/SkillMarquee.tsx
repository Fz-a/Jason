"use client";

import { useLocale } from "../lib/i18n";

type SkillGroup = {
	titleKey: string;
	items: string[];
};

const GROUPS: SkillGroup[] = [
	{
		titleKey: "skills.hardware",
		items: [
			"PCB Design",
			"Altium",
			"MCU",
			"Sensors",
			"Power Management",
		],
	},
	{
		titleKey: "skills.embedded",
		items: ["ESP32", "STM32", "C / C++", "RTOS", "UART", "I²C", "SPI"],
	},
	{
		titleKey: "skills.robotics",
		items: [
			"ROS",
			"SLAM",
			"LiDAR",
			"AGV",
			"MQTT",
			"Sensor Integration",
		],
	},
	{
		titleKey: "skills.ai",
		items: [
			"LLM",
			"ASR",
			"TTS",
			"Computer Vision",
			"AI Interaction",
		],
	},
	{
		titleKey: "skills.uav",
		items: [
			"UAV",
			"RTK",
			"GNSS",
			"LoRa",
			"Drone Communication",
			"Low-Altitude Apps",
		],
	},
];

export function SkillMarquee() {
	const { t } = useLocale();

	return (
		<section
			id="skills"
			aria-label={t("skills.label")}
			className="scroll-mt-10 bg-[#F7F1E8] pb-10 pt-4 sm:scroll-mt-14 sm:pb-12 sm:pt-6"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("skills.label")}
				</p>

				<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
					{GROUPS.map((group) => (
						<div key={group.titleKey} className="min-w-0">
							<h3 className="text-[0.78rem] font-extrabold tracking-tight text-[#162b26]">
								{t(group.titleKey)}
							</h3>
							<ul className="mt-2.5 space-y-1.5">
								{group.items.map((name) => (
									<li
										key={name}
										className="text-[0.8rem] leading-5 text-[#4A5C58]"
									>
										{name}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
