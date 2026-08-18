<script lang="ts">
	let active = $state(false);
	let playing = $state(false);
	let timer = 0;

	function clash() {
		if (playing) return;
		playing = true;
		window.clearTimeout(timer);
		timer = window.setTimeout(() => {
			playing = false;
		}, 1500);
	}
</script>

<article class="folio-tile folio-bio folio-shadow-tile" style="--bento-delay: 160ms">
	<button
		type="button"
		class="folio-shadow-stage"
		class:is-active={active}
		class:is-playing={playing}
		aria-label="Shadow play — tap to clash"
		onmouseenter={() => (active = true)}
		onmouseleave={() => (active = false)}
		onclick={clash}
	>
		<svg class="folio-shadow-svg" viewBox="0 0 320 200" aria-hidden="true">
			<!-- Monkey King -->
			<g class="folio-wk">
				<path d="M78 52 L88 40 L98 52 Z" fill="#2a2118"></path>
				<circle cx="88" cy="62" r="14" fill="#2a2118"></circle>
				<circle cx="74" cy="62" r="4" fill="#2a2118"></circle>
				<circle cx="102" cy="62" r="4" fill="#2a2118"></circle>
				<rect x="78" y="76" width="20" height="46" rx="4" fill="#2a2118"></rect>
				<line x1="84" y1="122" x2="78" y2="152" stroke="#2a2118" stroke-width="7" stroke-linecap="round"></line>
				<line x1="94" y1="122" x2="100" y2="152" stroke="#2a2118" stroke-width="7" stroke-linecap="round"></line>
				<line
					class="folio-wk-staff"
					x1="98"
					y1="90"
					x2="150"
					y2="56"
					stroke="#2a2118"
					stroke-width="5"
					stroke-linecap="round"
				></line>
				<path
					class="folio-wk-tail"
					d="M78 100 C 58 108, 52 128, 62 142"
					fill="none"
					stroke="#2a2118"
					stroke-width="5"
					stroke-linecap="round"
				></path>
			</g>

			<!-- Wu Song -->
			<g class="folio-ws">
				<path d="M212 46 H236 L232 58 H216 Z" fill="#2a2118"></path>
				<circle cx="224" cy="66" r="13" fill="#2a2118"></circle>
				<rect x="214" y="80" width="20" height="48" rx="4" fill="#2a2118"></rect>
				<line x1="220" y1="128" x2="208" y2="156" stroke="#2a2118" stroke-width="7" stroke-linecap="round"></line>
				<line x1="230" y1="128" x2="248" y2="154" stroke="#2a2118" stroke-width="7" stroke-linecap="round"></line>
				<line
					class="folio-ws-staff"
					x1="214"
					y1="96"
					x2="166"
					y2="62"
					stroke="#2a2118"
					stroke-width="5"
					stroke-linecap="round"
				></line>
			</g>

			<!-- Clash FX -->
			<g class="folio-clash" aria-hidden="true">
				<circle class="folio-clash-ring r1" cx="160" cy="78" r="8" fill="none" stroke="#a8483c" stroke-width="2.5"></circle>
				<circle class="folio-clash-ring r2" cx="160" cy="78" r="8" fill="none" stroke="#2a2118" stroke-width="1.5"></circle>
				<circle class="folio-clash-core" cx="160" cy="78" r="5" fill="#a8483c"></circle>

				{#each [0, 45, 90, 135, 180, 225, 270, 315] as ang, i}
					<line
						class="folio-clash-ray"
						style={`--i: ${i}; --ang: ${ang}deg`}
						x1="160"
						y1="78"
						x2="160"
						y2="52"
						stroke={i % 2 === 0 ? "#a8483c" : "#2a2118"}
						stroke-width="2.2"
						stroke-linecap="round"
						transform={`rotate(${ang} 160 78)`}
					></line>
				{/each}

				{#each [[148, 66], [174, 70], [152, 92], [170, 88], [160, 58], [142, 82]] as [x, y], i}
					<circle
						class="folio-clash-dot"
						style={`--i: ${i}; --dx: ${(x - 160) * 2.2}px; --dy: ${(y - 78) * 2.2}px`}
						cx={x}
						cy={y}
						r={i % 2 === 0 ? 2.4 : 1.7}
						fill={i % 2 === 0 ? "#a8483c" : "#2a2118"}
					></circle>
				{/each}

				<!-- Speed lines -->
				<path
					class="folio-clash-slash s1"
					d="M132 58 L188 98"
					fill="none"
					stroke="#a8483c"
					stroke-width="2"
					stroke-linecap="round"
				></path>
				<path
					class="folio-clash-slash s2"
					d="M190 60 L134 100"
					fill="none"
					stroke="#2a2118"
					stroke-width="1.8"
					stroke-linecap="round"
				></path>
			</g>
		</svg>

		<span class="folio-shadow-hint" class:is-hidden={active || playing}>Clash</span>
	</button>
</article>
