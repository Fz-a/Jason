"use client";

import { useLocale } from "../lib/i18n";

/** The one address the site publishes everywhere. */
export const CONTACT_EMAIL = "1106467336@qq.com";

/** Shared so the deck's compact slide and the full block never drift apart. */
export const SOCIAL_LINKS = [
	{ label: "GitHub", href: "https://github.com/Fz-a" },
	{ label: "Gitee", href: "https://gitee.com/Fz_z" },
	{ label: "CSDN", href: "https://blog.csdn.net/Fz_a" },
];

function GitHubIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="h-4 w-4"
			fill="currentColor"
		>
			<path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.2-3.37-1.2-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.09 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.36 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.71 1.03 1.62 1.03 2.74 0 3.96-2.34 4.82-4.57 5.08.36.32.69.95.69 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
		</svg>
	);
}

function GiteeIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="h-[1.05rem] w-[1.05rem]"
			fill="currentColor"
		>
			<path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z" />
		</svg>
	);
}

function CsdnIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="h-4 w-4"
			fill="currentColor"
		>
			<text
				x="12"
				y="16.5"
				textAnchor="middle"
				fontSize="12"
				fontWeight="700"
				fontFamily="Arial, sans-serif"
				fill="currentColor"
			>
				C
			</text>
		</svg>
	);
}

function SocialIcon({ label }: { label: string }) {
	switch (label) {
		case "GitHub":
			return <GitHubIcon />;
		case "Gitee":
			return <GiteeIcon />;
		case "CSDN":
			return <CsdnIcon />;
		default:
			return null;
	}
}

function EmailIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="h-4 w-4"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.9"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 6.5h16v11H4z" />
			<path d="m4.5 7 7.5 6 7.5-6" />
		</svg>
	);
}

function LocationIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="h-4 w-4"
			fill="currentColor"
		>
			<path d="M12 2.75A6.25 6.25 0 0 0 5.75 9c0 4.35 5.18 10.72 5.4 10.99a1.1 1.1 0 0 0 1.7 0c.22-.27 5.4-6.64 5.4-10.99A6.25 6.25 0 0 0 12 2.75Zm0 8.9A2.65 2.65 0 1 1 12 6.35a2.65 2.65 0 0 1 0 5.3Z" />
		</svg>
	);
}

/**
 * Contact block. Used as the deck's `#contact` slide and on the standalone
 * /contact page, so both stay in sync. The caller owns the outer <section>.
 */
export function ContactSection() {
	const { t } = useLocale();

	return (
		<div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-8 px-6 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(260px,0.6fr)] lg:gap-12 lg:px-12 xl:max-w-[1160px] xl:gap-14 xl:px-14">
			<div className="max-w-[610px]">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem] lg:text-[0.78rem]">
					{t("contact.kicker")}
				</p>

				<h2 className="mt-3.5 max-w-[10ch] text-[1.75rem] font-extrabold leading-[1.12] tracking-normal sm:text-[2.15rem] lg:text-[2.55rem]">
					{t("contact.title")}
				</h2>

				<p className="mt-4 max-w-[31rem] text-[0.88rem] leading-6.5 text-[#3E514D] lg:text-[0.94rem] lg:leading-[1.72rem]">
					{t("contact.body")}
				</p>

				<div className="mt-6 flex flex-wrap gap-2.5">
					<a
						href={`mailto:${CONTACT_EMAIL}`}
						className="rounded-full bg-[#043439] px-5 py-2 text-[0.82rem] font-semibold text-white transition hover:opacity-90 lg:px-6 lg:py-2.5 lg:text-[0.88rem]"
					>
						{t("contact.emailMe")}
					</a>
				</div>
			</div>

			<aside className="lg:pt-5">
				<div className="rounded-[1.15rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-4.5 shadow-[0_16px_34px_rgba(22,43,38,0.05)] sm:p-5">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#0F4C45] sm:text-[0.74rem]">
						{t("contact.connect")}
					</p>

					<div className="mt-5 space-y-4 text-[#162b26]">
						<div className="flex items-start gap-3">
							<span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] text-[#0F4C45]">
								<EmailIcon />
							</span>

							<div>
								<p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#6B7B77]">
									{t("contact.email")}
								</p>
								<a
									href={`mailto:${CONTACT_EMAIL}`}
									className="mt-1.5 block text-[0.9rem] font-semibold text-[#162b26] transition hover:text-[#0F4C45] sm:text-[0.95rem]"
								>
									{CONTACT_EMAIL}
								</a>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] text-[#0F4C45]">
								<LocationIcon />
							</span>

							<div>
								<p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#6B7B77]">
									{t("contact.locationLabel")}
								</p>
								<p className="mt-1.5 text-[0.9rem] font-semibold sm:text-[0.95rem]">
									{t("contact.location")}
								</p>
							</div>
						</div>

						<div className="border-t border-[#0F4C45]/10 pt-4">
							<p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#6B7B77]">
								{t("contact.profiles")}
							</p>

							<div className="mt-3 flex items-center gap-2.5">
								{SOCIAL_LINKS.map((link) => (
									<a
										key={link.label}
										href={link.href}
										target="_blank"
										rel="noreferrer"
										aria-label={link.label}
										className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] text-[#0F4C45] transition hover:-translate-y-0.5 hover:bg-[#0F4C45] hover:text-white"
									>
										<SocialIcon label={link.label} />
									</a>
								))}
							</div>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}
