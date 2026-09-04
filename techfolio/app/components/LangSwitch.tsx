"use client";

import { LOCALE_OPTIONS, useLocale, type Locale } from "../lib/i18n";

export function LangSwitch({ className = "" }: { className?: string }) {
	const { locale, setLocale, t } = useLocale();

	return (
		<div
			className={`lang-switch inline-flex items-center rounded-full border border-[#0F4C45]/18 bg-[#F7F1E8]/92 p-0.5 shadow-[0_6px_16px_rgba(22,43,38,0.06)] backdrop-blur-md ${className}`}
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
						className={`min-w-[1.55rem] rounded-full px-1.5 py-1 text-[0.6rem] font-bold tracking-[0.02em] transition duration-300 sm:min-w-[1.7rem] sm:px-2 sm:py-1 sm:text-[0.64rem] ${
							active
								? "bg-[#0F4C45] text-[#F7F1E8] shadow-[0_4px_10px_rgba(15,76,69,0.22)]"
								: "text-[#0F4C45]/70 hover:bg-[#0F4C45]/10 hover:text-[#0F4C45]"
						}`}
					>
						{option.short}
					</button>
				);
			})}
		</div>
	);
}
