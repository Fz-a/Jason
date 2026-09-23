"use client";

import { PortfolioDeck } from "../components/PortfolioDeck";
import { PageLayoutRoot, usePageLayout } from "../lib/use-page-layout";

/** /Introduce — the full deck (every visible page section). */
export default function Introduce() {
	const pageLayout = usePageLayout();

	return (
		<PageLayoutRoot layout={pageLayout}>
			<PortfolioDeck layout={pageLayout} avatarSrc="/avatar-source.jpg" />
		</PageLayoutRoot>
	);
}
