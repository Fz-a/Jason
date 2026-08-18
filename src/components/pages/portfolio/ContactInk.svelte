<script lang="ts">
	interface Props {
		guestbookHref: string;
		mailto?: string;
		title?: string;
	}

	let {
		guestbookHref,
		mailto = "",
		title = "留墨",
	}: Props = $props();

	let open = $state(false);
	let name = $state("");
	let message = $state("");
	let sentHint = $state(false);
	let panel = $state<HTMLDivElement | null>(null);

	function show() {
		open = true;
		sentHint = false;
		document.documentElement.classList.add("folio-modal-open");
		queueMicrotask(() => panel?.focus());
	}

	function hide() {
		open = false;
		document.documentElement.classList.remove("folio-modal-open");
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === "Escape" && open) hide();
	}

	function submit(e: Event) {
		e.preventDefault();
		const body = message.trim();
		if (!body) return;

		const who = name.trim() || "访客";
		const subject = encodeURIComponent(`【留墨】来自 ${who}`);
		const text = encodeURIComponent(
			`雅号：${who}\n\n${body}\n\n—— 来自作品集首页笺纸`,
		);

		if (mailto) {
			const addr = mailto.replace(/^mailto:/i, "");
			window.location.href = `mailto:${addr}?subject=${subject}&body=${text}`;
			sentHint = true;
			return;
		}

		window.location.href = guestbookHref;
	}
</script>

<svelte:window onkeydown={onKey} />

<article class="folio-tile folio-contact folio-contact-ink" style="--bento-delay: 200ms">
	<button type="button" class="folio-contact-hit" onclick={show} aria-haspopup="dialog">
		<span class="folio-contact-wash" aria-hidden="true"></span>
		<svg class="folio-contact-cloud" viewBox="0 0 120 48" aria-hidden="true">
			<path
				d="M8 34c8-14 22-22 38-18 6-10 20-14 32-8 14-8 30-2 36 12 10 2 16 10 14 18H8z"
				fill="currentColor"
			></path>
		</svg>

		<div class="folio-contact-copy">
			<span class="folio-contact-title">{title}</span>
			<span class="folio-contact-mark" aria-hidden="true"></span>
			<span class="folio-contact-cta">点此投笺</span>
		</div>
		<span class="folio-contact-seal" aria-hidden="true">笺</span>
	</button>
</article>

{#if open}
	<div
		class="folio-ink-modal"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) hide();
		}}
	>
		<div
			class="folio-ink-panel"
			role="dialog"
			aria-modal="true"
			aria-labelledby="folio-ink-title"
			tabindex="-1"
			bind:this={panel}
		>
			<div class="folio-ink-paper" aria-hidden="true"></div>
			<div class="folio-ink-ruled" aria-hidden="true"></div>

			<button type="button" class="folio-ink-close" onclick={hide} aria-label="关闭">
				<span>合</span>
			</button>

			<header class="folio-ink-head">
				<div class="folio-ink-head-text">
					<p class="folio-ink-kicker">Guestbook · 笺</p>
					<h2 id="folio-ink-title" class="folio-ink-title">{title}</h2>
					<p class="folio-ink-sub">片言寸笺，幸勿吝墨</p>
				</div>
				<span class="folio-ink-stamp" aria-hidden="true">墨</span>
			</header>

			<form class="folio-ink-form" onsubmit={submit}>
				<label class="folio-ink-field">
					<span class="folio-ink-label">雅号</span>
					<input
						type="text"
						name="name"
						autocomplete="nickname"
						placeholder="怎么称呼你"
						bind:value={name}
						maxlength="40"
					/>
				</label>
				<label class="folio-ink-field is-tall">
					<span class="folio-ink-label">墨迹</span>
					<textarea
						name="message"
						rows="5"
						placeholder="一句问好，或一点建议…"
						required
						bind:value={message}
						maxlength="2000"
					></textarea>
				</label>

				<div class="folio-ink-actions">
					<button type="submit" class="folio-ink-submit">
						<span class="folio-ink-submit-seal" aria-hidden="true">投</span>
						<span>投笺</span>
					</button>
					<a class="folio-ink-board" href={guestbookHref}>完整留言板</a>
				</div>

				{#if sentHint}
					<p class="folio-ink-hint">已唤起邮箱。投递后，便可合上这张笺纸。</p>
				{/if}
			</form>
		</div>
	</div>
{/if}
