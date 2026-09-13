"use client";

import type { ReactNode } from "react";
import { useLocale } from "../lib/i18n";

const UNI = [
	"path.uni.circuit",
	"path.uni.wearable",
	"path.uni.opencv",
	"path.uni.gesture",
	"path.uni.embedded",
] as const;

const PRO = [
	"path.pro.robotics",
	"path.pro.agv",
	"path.pro.ai",
	"path.pro.rtk",
	"path.pro.system",
] as const;

const BRING = [
	{ title: "path.bring.1.title", body: "path.bring.1.body" },
	{ title: "path.bring.2.title", body: "path.bring.2.body" },
	{ title: "path.bring.3.title", body: "path.bring.3.body" },
	{ title: "path.bring.4.title", body: "path.bring.4.body" },
	{ title: "path.bring.5.title", body: "path.bring.5.body" },
] as const;

const APPS = [
	"path.app.uav",
	"path.app.delivery",
	"path.app.systems",
] as const;

const RESEARCH = [
	"path.research.item1",
	"path.research.item2",
	"path.research.item3",
] as const;

function StageLabel({ children }: { children: ReactNode }) {
	return (
		<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/55">
			{children}
		</p>
	);
}

function Converge() {
	return (
		<div className="my-5 flex flex-col items-center gap-1 sm:my-6" aria-hidden>
			<span className="h-5 w-px bg-[#0F4C45]/22" />
			<span className="text-[0.7rem] text-[#0F4C45]/40">↓</span>
			<span className="h-2 w-px bg-[#0F4C45]/22" />
		</div>
	);
}

export function EngineeringPath() {
	const { t } = useLocale();

	return (
		<section
			id="path"
			className="scroll-mt-10 bg-[#F7F1E8] pb-10 pt-4 sm:scroll-mt-14 sm:pb-12 sm:pt-6"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("path.kicker")}
				</p>
				<h2 className="mt-3 text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.85rem]">
					{t("path.title")}
				</h2>
				<p className="mt-2.5 max-w-[38rem] text-[0.88rem] leading-7 text-[#3E514D] sm:text-[0.92rem]">
					{t("path.blurb")}
				</p>

				{/* 01 · Experience */}
				<div className="mt-8 sm:mt-9">
					<StageLabel>{t("path.exp.kicker")}</StageLabel>
					<h3 className="mt-1.5 text-[1.05rem] font-extrabold tracking-tight text-[#162b26]">
						{t("path.exp.title")}
					</h3>
					<p className="mt-1.5 max-w-[36rem] text-[0.82rem] leading-6 text-[#4A5C58]">
						{t("path.exp.body")}
					</p>

					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
						<div className="rounded-[1.05rem] border border-[#0F4C45]/10 bg-[#FFFCFA] px-4 py-4 sm:px-5 sm:py-5">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/50">
								{t("path.uni.kicker")}
							</p>
							<p className="mt-1 text-[0.95rem] font-bold text-[#162b26]">
								{t("path.uni.title")}
							</p>
							<ul className="mt-3 space-y-1.5">
								{UNI.map((key) => (
									<li
										key={key}
										className="flex items-center gap-2 text-[0.84rem] text-[#4A5C58]"
									>
										<span
											aria-hidden
											className="h-1 w-1 shrink-0 rounded-full bg-[#0F4C45]/45"
										/>
										{t(key)}
									</li>
								))}
							</ul>
						</div>

						<div className="rounded-[1.05rem] border border-[#0F4C45]/10 bg-[#FFFCFA] px-4 py-4 sm:px-5 sm:py-5">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/50">
								{t("path.pro.kicker")}
							</p>
							<p className="mt-1 text-[0.95rem] font-bold text-[#162b26]">
								{t("path.pro.title")}
							</p>
							<ul className="mt-3 space-y-1.5">
								{PRO.map((key) => (
									<li
										key={key}
										className="flex items-center gap-2 text-[0.84rem] text-[#4A5C58]"
									>
										<span
											aria-hidden
											className="h-1 w-1 shrink-0 rounded-full bg-[#0F4C45]/45"
										/>
										{t(key)}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				<Converge />

				{/* 02 · Connection */}
				<div className="rounded-[1.05rem] border border-[#0F4C45]/10 bg-[#FFFCFA] px-4 py-5 sm:px-6 sm:py-6">
					<StageLabel>{t("path.conn.kicker")}</StageLabel>
					<h3 className="mt-1.5 text-[1.05rem] font-extrabold tracking-tight text-[#162b26]">
						{t("path.conn.title")}
					</h3>
					<p className="mt-1.5 max-w-[36rem] text-[0.82rem] leading-6 text-[#4A5C58]">
						{t("path.conn.body")}
					</p>
					<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{BRING.map((item) => (
							<div
								key={item.title}
								className="rounded-xl border border-[#0F4C45]/08 bg-[#F7F1E8]/70 px-3.5 py-3"
							>
								<p className="text-[0.82rem] font-bold text-[#162b26]">
									{t(item.title)}
								</p>
								<p className="mt-1 text-[0.74rem] leading-5 text-[#4A5C58]">
									{t(item.body)}
								</p>
							</div>
						))}
					</div>
				</div>

				<Converge />

				{/* 03 · Target */}
				<div className="rounded-[1.05rem] border border-[#0F4C45]/14 bg-[#043439] px-4 py-5 text-white sm:px-6 sm:py-6">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/55">
						{t("path.target.kicker")}
					</p>
					<h3 className="mt-1.5 text-[1.15rem] font-extrabold tracking-tight sm:text-[1.3rem]">
						{t("path.target.title")}
					</h3>
					<p className="mt-2 max-w-[36rem] text-[0.84rem] leading-6 text-white/75">
						{t("path.target.body")}
					</p>
					<div className="mt-5 flex flex-wrap gap-2">
						{APPS.map((key) => (
							<span
								key={key}
								className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[0.72rem] font-semibold text-white/85"
							>
								{t(key)}
							</span>
						))}
					</div>
				</div>

				<Converge />

				{/* 04 · Research Direction */}
				<div className="rounded-[1.05rem] border border-[#0F4C45]/12 bg-[#FFFCFA] px-4 py-5 sm:px-6 sm:py-6">
					<StageLabel>{t("path.research.kicker")}</StageLabel>
					<h3 className="mt-1.5 text-[1.05rem] font-extrabold tracking-tight text-[#162b26]">
						{t("path.research.title")}
					</h3>
					<p className="mt-1.5 max-w-[38rem] text-[0.84rem] leading-6 text-[#4A5C58]">
						{t("path.research.body")}
					</p>
					<ul className="mt-4 space-y-2">
						{RESEARCH.map((key) => (
							<li
								key={key}
								className="flex gap-2.5 text-[0.84rem] leading-6 text-[#3E514D]"
							>
								<span
									aria-hidden
									className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C45]"
								/>
								{t(key)}
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
