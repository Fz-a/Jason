import Link from "next/link";
import type { ProjectDetail } from "./project-data";

export function ProjectContinue({
	next,
}: {
	next: ProjectDetail | null;
}) {
	const href = next ? `/projects/${next.slug}/` : "/#contact";
	const label = next ? next.shortTitle : "Contact";
	const kicker = "Next";

	return (
		<nav
			aria-label={next ? "Continue to next chapter" : "Continue to contact"}
			className="mt-12 flex justify-end border-t border-[#0F4C45]/08 pt-6 sm:mt-14 sm:pt-7"
		>
			<Link
				href={href}
				className="group inline-flex items-baseline gap-2.5 text-[#162b26] transition-colors duration-300 hover:text-[#0F4C45]"
			>
				<span className="font-mono text-[0.6rem] tracking-[0.2em] text-[#8A9692] transition-colors duration-300 group-hover:text-[#0F4C45]/70">
					{kicker}
				</span>
				<span className="text-[0.95rem] font-semibold tracking-tight sm:text-[1rem]">
					{label}
				</span>
				<span
					aria-hidden
					className="translate-x-0 text-[0.95rem] text-[#8A9692] transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-[#0F4C45]"
				>
					→
				</span>
			</Link>
		</nav>
	);
}
