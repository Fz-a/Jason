"use client";

import { useLocale } from "../lib/i18n";

const ROLES = [
	{
		roleKey: "exp.zongheng.role",
		companyKey: "exp.zongheng.company",
		tagsKey: "exp.zongheng.tags",
	},
	{
		roleKey: "exp.cvte.role",
		companyKey: "exp.cvte.company",
		tagsKey: "exp.cvte.tags",
	},
	{
		roleKey: "exp.moore.role",
		companyKey: "exp.moore.company",
		tagsKey: "exp.moore.tags",
	},
] as const;

export function ExperienceStrip() {
	const { t } = useLocale();

	return (
		<section
			id="experience"
			className="scroll-mt-10 bg-[#F7F1E8] pb-8 pt-4 sm:scroll-mt-14 sm:pb-10 sm:pt-6"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("exp.kicker")}
				</p>
				<h2 className="mt-3 text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.85rem]">
					{t("exp.title")}
				</h2>

				<ul className="mt-6 divide-y divide-[#0F4C45]/10 border-y border-[#0F4C45]/10">
					{ROLES.map((row) => (
						<li
							key={row.companyKey}
							className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:py-5"
						>
							<div className="min-w-0">
								<p className="text-[0.95rem] font-extrabold text-[#162b26]">
									{t(row.companyKey)}
								</p>
								<p className="mt-0.5 text-[0.82rem] font-semibold text-[#0F4C45]">
									{t(row.roleKey)}
								</p>
							</div>
							<p className="text-[0.78rem] leading-5 text-[#6A7A76] sm:max-w-[22rem] sm:text-right">
								{t(row.tagsKey)}
							</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
