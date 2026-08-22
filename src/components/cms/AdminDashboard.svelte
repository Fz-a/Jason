<script lang="ts">
	import { onMount } from "svelte";
	import { FOLIO_SECTIONS } from "@/lib/cms/seed-nodes";

	let user = $state<{ username: string } | null>(null);
	let backend = $state<string | null>(null);
	let ready = $state(false);

	const sectionMeta: Record<string, string> = {
		knowledge: "Knowledge",
		projects: "Projects",
		works: "University",
		life: "DIY",
	};

	onMount(async () => {
		const res = await fetch("/api/auth/me/");
		const data = (await res.json()) as {
			authenticated?: boolean;
			backend?: string | null;
			user?: { username: string };
		};
		if (!data.authenticated) {
			window.location.assign("/admin/login/");
			return;
		}
		user = data.user ?? null;
		backend = data.backend ?? null;
		ready = true;
	});

	async function logout() {
		await fetch("/api/auth/logout/", { method: "POST" });
		window.location.assign("/admin/login/");
	}
</script>

{#if ready}
	<nav class="cms-nav">
		<a href="/">Site</a>
		<a href="/admin/">Dashboard</a>
		<a href="/admin/media/">Media</a>
		<span style="flex:1"></span>
		<span class="cms-note" style="margin:0">{user?.username} · {backend}</span>
		<button type="button" class="cms-btn cms-btn-danger" onclick={logout}>Log out</button>
	</nav>

	<div class="cms-card">
		<h1 class="cms-title">Folio CMS</h1>
		<p class="cms-note">
			Edit section trees on the public pages while logged in, or open a section below.
			Blog posts table is reserved for later.
		</p>
		<div class="cms-grid cms-grid-2">
			{#each FOLIO_SECTIONS as id}
				<a class="cms-card" href={`/${id}/`} style="text-decoration:none; padding:1rem">
					<strong>{sectionMeta[id] ?? id}</strong>
					<p class="cms-note" style="margin:0.35rem 0 0">Open public gallery to edit</p>
				</a>
			{/each}
			<a class="cms-card" href="/admin/media/" style="text-decoration:none; padding:1rem">
				<strong>Media library</strong>
				<p class="cms-note" style="margin:0.35rem 0 0">Upload covers to R2 / local store</p>
			</a>
			<div class="cms-card" style="padding:1rem; opacity:0.72">
				<strong>Blog</strong>
				<p class="cms-note" style="margin:0.35rem 0 0">Coming later (`posts` table ready)</p>
			</div>
		</div>
	</div>
{/if}
