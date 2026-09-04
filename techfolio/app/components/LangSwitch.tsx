"use client";

import { LOCALE_OPTIONS, useLocale, type Locale } from "../lib/i18n";

export function LangSwitch({ className = "" }: { className?: string }) {
	const { locale, setLocale, t } = useLocale();

	return (
		<div
			className={`lang-switch inline-flex items-center rounded-full border border-[#0F4C45]/20 bg-[#F7F1E8]/95 p-1 shadow-[0_10px_28px_rgba(22,43,38,0.08)] backdrop-blur-md ${className}`}
			role="group"
			aria-label={t("lang.label")}
		>
			{LOCALE_OPTIONS.map((option) => {
				const active = locale === option.id;
				return (
					<button
						key={option.id}
						type="button"
						title={option.title}
						aria-pressed={active}
						onClick={() => setLocale(option.id as Locale)}
						className={`min-w-[2.15rem] rounded-full px-2.5 py-1.5 text-[0.72rem] font-bold tracking-[0.04em] transition duration-300 sm:min-w-[2.35rem] sm:px-3 sm:py-2 sm:text-[0.78rem] ${
							active
								? "bg-[#0F4C45] text-[#F7F1E8] shadow-[0_8px_18px_rgba(15,76,69,0.28)]"
								: "text-[#0F4C45]/75 hover:bg-[#0F4C45]/10 hover:text-[#0F4C45]"
						}`}
					>
						{option.short}
					</button>
				);
			})}
		</div>
	);
}
