<script lang="ts">
	import { onMount } from "svelte";

	let password = $state("");
	let error = $state("");
	let loading = $state(false);
	let checking = $state(true);
	let passwordEl = $state<HTMLInputElement | null>(null);

	onMount(async () => {
		try {
			const res = await fetch("/api/auth/me/");
			const data = (await res.json()) as { authenticated?: boolean };
			if (data.authenticated) {
				const next = new URLSearchParams(window.location.search).get("next");
				window.location.assign(next && next.startsWith("/") ? next : "/admin/");
				return;
			}
		} catch {
			/* show form */
		}
		checking = false;
		queueMicrotask(() => passwordEl?.focus());
	});

	async function submit(e: Event) {
		e.preventDefault();
		error = "";
		loading = true;
		try {
			const res = await fetch("/api/auth/login/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});
			const data = (await res.json()) as { error?: string };
			if (!res.ok) {
				error = data.error === "Invalid credentials" ? "口令不对" : data.error || "登录失败";
				return;
			}
			const next = new URLSearchParams(window.location.search).get("next");
			window.location.assign(next && next.startsWith("/") ? next : "/admin/");
		} catch {
			error = "网络异常，请重试";
		} finally {
			loading = false;
		}
	}
</script>

{#if checking}
	<div class="cms-login">
		<p class="cms-login-status">核对会话…</p>
	</div>
{:else}
	<div class="cms-login">
		<form class="cms-login-sheet" onsubmit={submit}>
			<span class="cms-login-mark" aria-hidden="true"></span>
			<p class="cms-login-kicker">Folio · Gate</p>
			<h1 class="cms-login-title">编辑入口</h1>
			<p class="cms-login-lead">输入口令后即可改树、传图。</p>

			<label class="cms-login-field">
				<span class="cms-login-label">口令</span>
				<input
					bind:this={passwordEl}
					type="password"
					bind:value={password}
					autocomplete="current-password"
					required
					placeholder="••••••••"
				/>
			</label>

			{#if error}
				<p class="cms-login-error" role="alert">{error}</p>
			{/if}

			<button type="submit" class="cms-login-submit" disabled={loading || !password}>
				{loading ? "验证中…" : "进入"}
			</button>

			<a class="cms-login-back" href="/">返回作品集</a>
		</form>
	</div>
{/if}
