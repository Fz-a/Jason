import { GateLock } from "../components/GateLock";
import { StudioApp } from "./StudioApp";

export default function StudioPage() {
	return (
		<GateLock kicker="Studio" title="Content studio">
			<StudioApp />
		</GateLock>
	);
}
