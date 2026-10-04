"use client";

import { GateLock } from "../components/GateLock";
import { PortfolioDeck } from "../components/PortfolioDeck";
import { PageLayoutRoot, usePageLayout } from "../lib/use-page-layout";

/** /Introduce — the full deck (every visible page section). */
export default function Introduce() {
	const pageLayout = usePageLayout();

	return (
		<GateLock kicker="Introduce" title="The full story">
			<PageLayoutRoot layout={pageLayout}>
				<PortfolioDeck
					layout={pageLayout}
					avatarVariant="introduce"
					cornerNav="back"
					sections={[
						"home",
						"agenda",
						"experience",
						"research",
						"goal",
						"next",
						"contact",
					]}
				/>
			</PageLayoutRoot>
		</GateLock>
	);
}
