"use client";

import { PortfolioDeck } from "./components/PortfolioDeck";
import { PageLayoutRoot, usePageLayout } from "./lib/use-page-layout";

/** Homepage: intro hero, the Work showcase, and contact. Full deck lives at /Introduce. */
export default function Home() {
	const pageLayout = usePageLayout();

	return (
		<PageLayoutRoot layout={pageLayout}>
			<PortfolioDeck
				layout={pageLayout}
				sections={["home", "experience", "contact"]}
				contactVariant="feature"
			/>
		</PageLayoutRoot>
	);
}
