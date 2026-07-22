<script lang="ts">
	import { columns, members, type LabelTone } from './fixtures';

	const byId = new Map(members.map((m) => [m.id, m]));

	const filters = [
		{ id: 'all', label: 'All' },
		{ id: 'mine', label: 'Mine' },
		{ id: 'due', label: 'Due this week' }
	] as const;
	type FilterId = (typeof filters)[number]['id'];
	type ViewId = 'board' | 'list';

	// Visual-specimen interaction state only; cards are not re-filtered.
	let activeFilter = $state<FilterId>('all');
	let activeView = $state<ViewId>('board');
	let query = $state('');

	const cardTotal = columns.reduce((n, col) => n + col.cards.length, 0);

	// Pastel stage dots: one per column, clearly distinguishable against the dark
	// indigo header. Paired with the column name so meaning never relies on color.
	const stageDot: Partial<Record<LabelTone, string>> = {
		slate: 'oklch(0.62 0.03 275)',
		blue: 'oklch(0.62 0.1 250)',
		amber: 'oklch(0.7 0.12 70)',
		green: 'oklch(0.62 0.1 152)'
	};

	// Pastel label chip backgrounds — slightly more saturated than the card face
	// so chip edges are visible on the pastel surface. All carry dark indigo text.
	const labelBg: Partial<Record<LabelTone, string>> = {
		violet: 'oklch(0.74 0.06 285)',
		teal: 'oklch(0.74 0.06 180)',
		blue: 'oklch(0.74 0.06 250)',
		slate: 'oklch(0.74 0.014 275)',
		indigo: 'oklch(0.74 0.06 270)',
		green: 'oklch(0.74 0.06 152)',
		pink: 'oklch(0.74 0.06 350)',
		amber: 'oklch(0.74 0.06 70)',
		rose: 'oklch(0.74 0.06 15)',
		red: 'oklch(0.74 0.06 25)',
		cyan: 'oklch(0.74 0.06 200)'
	};
</script>

<div class="board-root">
	<header class="app-bar">
		<div class="bar-row bar-left">
			<span class="project-chip">Aurora</span>
			<div class="title-block">
				<h1>Sprint 24 · Board</h1>
				<p class="subtitle">{columns.length} columns · {cardTotal} cards · updated 2m ago</p>
			</div>
			<ul class="team-avatars" aria-label="Team members">
				{#each members as m (m.id)}
					<li class="avatar" style="--h: {m.hue}" aria-label={m.name} title={m.name}>
						{m.initials}
					</li>
				{/each}
			</ul>
		</div>

		<div class="bar-row bar-right">
			<label class="search">
				<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
					<circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.7" />
					<path
						d="M11 11l3.2 3.2"
						fill="none"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
					/>
				</svg>
				<input
					type="search"
					placeholder="Search cards…"
					aria-label="Search cards"
					bind:value={query}
				/>
			</label>

			<div class="segmented filters" role="group" aria-label="Filter cards">
				{#each filters as f (f.id)}
					<button
						type="button"
						class="chip"
						aria-pressed={activeFilter === f.id}
						onclick={() => (activeFilter = f.id)}>{f.label}</button
					>
				{/each}
			</div>

			<div class="segmented view-toggle" role="group" aria-label="Board view">
				<button
					type="button"
					aria-pressed={activeView === 'board'}
					onclick={() => (activeView = 'board')}
				>
					Board
				</button>
				<button
					type="button"
					aria-pressed={activeView === 'list'}
					onclick={() => (activeView = 'list')}
				>
					List
				</button>
			</div>

			<!-- Visual-specimen-only affordance: renders the primary-action treatment
			     but performs no task creation. Like Search/Retry/dismiss/drag, it is
			     inert in the specimen; wire real behavior when reusing the treatment. -->
			<button type="button" class="primary">
				<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
					<path
						d="M8 2v12M2 8h12"
						fill="none"
						stroke="currentColor"
						stroke-width="1.9"
						stroke-linecap="round"
					/>
				</svg>
				New task
			</button>
		</div>
	</header>

	<main class="board-shell">
		<div class="error-banner" role="status" aria-live="polite">
			<svg class="error-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
				<path
					d="M8 1.6l6.4 11.4H1.6L8 1.6z"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linejoin="round"
				/>
				<path
					d="M8 6v3.4"
					fill="none"
					stroke="currentColor"
					stroke-width="1.7"
					stroke-linecap="round"
				/>
				<circle cx="8" cy="11.6" r="1" fill="currentColor" />
			</svg>
			<p>
				<strong>Sync paused.</strong> Couldn't reach the server. Recent changes may not be saved.
			</p>
			<div class="error-actions">
				<button type="button" class="error-retry">Retry</button>
				<button type="button" class="icon-btn error-dismiss" aria-label="Dismiss error">
					<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
						<path
							d="M3.5 3.5l9 9M12.5 3.5l-9 9"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</div>
		</div>

		<section class="board-body" aria-label="Kanban board">
			{#each columns as col (col.id)}
				<section class="column" style="--stage: {stageDot[col.accent] ?? 'oklch(0.62 0.03 275)'}">
					<header class="column-head">
						<span class="column-dot" aria-hidden="true"></span>
						<h2>{col.name}</h2>
						<span class="count"
							>{col.cards.length}<span class="sr-only">
								{col.cards.length === 1 ? 'card' : 'cards'}</span
							></span
						>
						<!-- Visual-specimen-only affordance: opens no menu and performs no
						     action; it demonstrates the column-level overflow control only. -->
						<button type="button" class="icon-btn" aria-label="More actions for {col.name}">
							<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
								<circle cx="3.5" cy="8" r="1.5" fill="currentColor" />
								<circle cx="8" cy="8" r="1.5" fill="currentColor" />
								<circle cx="12.5" cy="8" r="1.5" fill="currentColor" />
							</svg>
						</button>
					</header>

					<ul class="card-list">
						{#each col.cards as card (card.id)}
							<li>
								<article class="card" aria-labelledby="title-{card.id}">
									<div class="card-main">
										<div class="card-head">
											<span class="grip" aria-hidden="true" title="Drag to move">
												<svg viewBox="0 0 16 16" width="12" height="12">
													<circle cx="5.5" cy="4" r="1.25" fill="currentColor" />
													<circle cx="10.5" cy="4" r="1.25" fill="currentColor" />
													<circle cx="5.5" cy="8" r="1.25" fill="currentColor" />
													<circle cx="10.5" cy="8" r="1.25" fill="currentColor" />
													<circle cx="5.5" cy="12" r="1.25" fill="currentColor" />
													<circle cx="10.5" cy="12" r="1.25" fill="currentColor" />
												</svg>
											</span>
											<h3 class="card-title" id="title-{card.id}">{card.title}</h3>
										</div>

										{#if card.labels.length}
											<ul class="labels">
												{#each card.labels as l (`${l.name}-${l.tone}`)}
													<li
														class="label"
														style="--lb: {labelBg[l.tone] ?? 'oklch(0.74 0.014 275)'}"
													>
														{l.name}
													</li>
												{/each}
											</ul>
										{/if}

										{#if card.checklist}
											<p class="checklist">
												<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
													<path
														d="M3 4h10M3 8h10M3 12h7"
														fill="none"
														stroke="currentColor"
														stroke-width="1.6"
														stroke-linecap="round"
													/>
												</svg>
												<span class="mono">{card.checklist.done}/{card.checklist.total}</span>
												subtasks
											</p>
										{/if}
									</div>

									<footer class="card-foot">
										<span class="foot-meta">
											{#if card.priority}
												<span class="priority pri-{card.priority}">
													<span class="dot" aria-hidden="true"></span>
													{card.priority}
												</span>
											{/if}
											<span class="due {card.done ? 'is-done' : ''}">
												{#if card.done}
													<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
														<path
															d="M3.5 8.5l3 3 6-7"
															fill="none"
															stroke="currentColor"
															stroke-width="1.9"
															stroke-linecap="round"
															stroke-linejoin="round"
														/>
													</svg>
												{:else}
													<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
														<rect
															x="2.5"
															y="3.5"
															width="11"
															height="10"
															rx="1.8"
															fill="none"
															stroke="currentColor"
															stroke-width="1.5"
														/>
														<path
															d="M2.5 6.5h11M5.5 2v3M10.5 2v3"
															stroke="currentColor"
															stroke-width="1.5"
															stroke-linecap="round"
															fill="none"
														/>
													</svg>
												{/if}
												<span class="mono">{card.due}</span>
											</span>
										</span>

										<ul class="assignees" aria-label="Assignees">
											{#each card.assignees as id (id)}
												{@const m = byId.get(id)}
												{#if m}
													<li
														class="avatar sm"
														style="--h: {m.hue}"
														aria-label={m.name}
														title={m.name}
													>
														{m.initials}
													</li>
												{/if}
											{/each}
										</ul>
									</footer>
								</article>
							</li>
						{/each}

						{#if col.id === 'backlog'}
							<li class="skeleton-card" aria-hidden="true">
								<div class="skel skel-title"></div>
								<div class="skel-row">
									<div class="skel skel-label"></div>
									<div class="skel skel-label"></div>
								</div>
								<div class="skel skel-foot"></div>
							</li>
						{/if}

						{#if col.cards.length === 0}
							<li class="empty-col">
								<span class="empty-mark" aria-hidden="true"></span>
								<p>No cards yet</p>
							</li>
						{/if}

						<li>
							<!-- Visual-specimen-only affordance: demonstrates the pressed
							     "drop zone" treatment but creates no card. -->
							<button type="button" class="add-card">
								<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
									<path
										d="M8 2v12M2 8h12"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
									/>
								</svg>
								Add a card
							</button>
						</li>
					</ul>
				</section>
			{/each}
		</section>
	</main>
</div>

<style>
	/* Preview documents render outside the factory CSS boundary, so reset here. */
	:global(html, body) {
		margin: 0;
		min-height: 100%;
	}

	.board-root,
	.board-root *,
	.board-root *::before,
	.board-root *::after {
		box-sizing: border-box;
	}

	.board-root {
		/*
		 * Luminous Putty — dark claymorphism tokens (all OKLCH).
		 * Deep tinted-indigo canvas with bright opaque pastel-clay card faces.
		 * Depth from paired inset highlight/shadow + soft cast extrusion + a
		 * restrained low-radius glow used only as a secondary material cue.
		 * No pure black/white, no gradients, no backdrop blur.
		 */
		--canvas: oklch(0.21 0.05 272); /* deep tinted-indigo page background */
		--clay-dark: oklch(0.27 0.05 275); /* dark indigo clay: columns, app bar */
		--bar-bg: oklch(0.24 0.048 274); /* app bar dark clay (slightly deeper) */
		--surface: oklch(0.84 0.028 285); /* bright opaque pastel-clay card face */

		/* Ink on pastel surfaces (cards, controls) */
		--ink: oklch(0.24 0.035 278); /* dark indigo ink (~7:1 on surface) */
		--ink-soft: oklch(0.38 0.035 278); /* meta: due, labels, checklist (~4.5:1+) */
		--ink-faint: oklch(0.48 0.03 278); /* grip handle, decorative icons */

		/* Ink on dark surfaces (app bar, columns, error banner) */
		--ink-bright: oklch(0.9 0.025 285); /* light pastel text (~10:1 on dark clay) */
		--ink-bright-soft: oklch(0.7 0.035 285); /* meta on dark (~4.5:1+) */

		/* Accent */
		--accent: oklch(0.62 0.12 280); /* bright violet: focus ring on dark surfaces */
		--accent-fill: oklch(
			0.46 0.12 280
		); /* darker violet: primary fill (>=4.5:1 for near-white text) */
		--on-accent: oklch(0.95 0.015 285); /* near-white ink on accent fill (never #fff) */
		--accent-soft: oklch(0.42 0.07 280); /* darker violet for search inner-ring focus on pastel */

		/*
		 * Semantic tokens — bright decorative indicators separated from darker
		 * text-ink variants so every normal-size text role passes AA (>=4.5:1)
		 * on its actual opaque parent. Decorative dots keep the bright values;
		 * text uses the darker -ink variants.
		 */
		--danger: oklch(0.74 0.16 25); /* coral-red: error text/icon on dark surface (>=4.5:1) */
		--danger-soft: oklch(0.3 0.06 25); /* dark coral error surface */
		--done: oklch(0.72 0.14 152); /* bright green: decorative done checkmark/dot */
		--done-ink: oklch(0.36 0.1 152); /* dark green: done date text on pastel (>=4.5:1) */
		--pri-high: oklch(0.68 0.17 25); /* bright coral: decorative priority dot */
		--pri-high-ink: oklch(0.36 0.12 25); /* dark coral: high-priority text on pastel (>=4.5:1) */
		--pri-medium: oklch(0.72 0.14 65); /* bright amber: decorative priority dot */
		--pri-medium-ink: oklch(0.36 0.1 65); /* dark amber: medium-priority text on pastel (>=4.5:1) */

		/*
		 * Clay shadow recipes — the claymorphic signature.
		 * Each layer: inset upper-left highlight + inset lower-right shadow +
		 * outer cast drop shadow + restrained glow (secondary cue only).
		 * Tinted colors, never pure white/black.
		 */

		/* Pastel clay raised (cards — the luminous puffy faces) */
		--clay:
			inset 0 0 0 1.5px rgba(110, 100, 170, 0.16), inset 2px 2px 5px rgba(250, 245, 255, 0.55),
			inset -2px -2px 5px rgba(70, 65, 120, 0.12), 0 6px 14px rgba(12, 12, 35, 0.38),
			0 0 12px rgba(120, 100, 200, 0.06);
		/* Pastel clay raised, larger puff (hovered card) */
		--clay-hover:
			inset 0 0 0 1.5px rgba(110, 100, 170, 0.18), inset 2px 2px 5px rgba(250, 245, 255, 0.6),
			inset -2px -2px 5px rgba(70, 65, 120, 0.14), 0 10px 22px rgba(12, 12, 35, 0.45),
			0 0 16px rgba(120, 100, 200, 0.1);
		/* Pastel clay small (chips, controls, add-card, skeleton) */
		--clay-sm:
			inset 0 0 0 1px rgba(110, 100, 170, 0.12), inset 1px 1px 3px rgba(250, 245, 255, 0.5),
			inset -1px -1px 3px rgba(70, 65, 120, 0.1), 0 3px 8px rgba(12, 12, 35, 0.28),
			0 0 8px rgba(120, 100, 200, 0.05);
		/* Pressed pastel clay (selected chips, active toggle, search well) */
		--clay-pressed:
			inset 0 0 0 1px rgba(110, 100, 170, 0.2), inset 2px 2px 5px rgba(70, 65, 120, 0.18),
			inset -2px -2px 5px rgba(250, 245, 255, 0.35);
		/* Dark clay raised (columns, app bar, error banner) */
		--clay-dark-raise:
			inset 1.5px 1.5px 4px rgba(140, 130, 210, 0.12), inset -1.5px -1.5px 4px rgba(5, 5, 20, 0.4),
			0 5px 12px rgba(8, 8, 25, 0.4), 0 0 10px rgba(100, 80, 200, 0.05);
		/* Dark clay pressed (empty-state well, count badge, segmented track) */
		--clay-dark-press:
			inset 2px 2px 5px rgba(5, 5, 20, 0.5), inset -2px -2px 5px rgba(140, 130, 210, 0.08);
		/* Accent clay (primary button fill) */
		--clay-accent:
			inset 1.5px 1.5px 4px rgba(200, 190, 255, 0.3), inset -1.5px -1.5px 4px rgba(40, 30, 80, 0.3),
			0 4px 10px rgba(8, 8, 25, 0.35), 0 0 10px rgba(120, 100, 200, 0.12);

		--r-card: 14px;
		--r-control: 12px;

		--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		--font-mono:
			ui-monospace, 'SF Mono', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;

		min-height: 100vh;
		font-family: var(--font-sans);
		font-synthesis: none;
		color: var(--ink);
		background: var(--canvas);
		padding: clamp(0.9rem, 3vw, 1.4rem);
	}

	/* ---------- App bar (dark clay slab) ---------- */

	.app-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1rem;
		flex-wrap: wrap;
		padding: 0.9rem clamp(0.9rem, 2vw, 1.15rem);
		border-radius: var(--r-card);
		background: var(--bar-bg);
		box-shadow: var(--clay-dark-raise);
		margin-bottom: clamp(0.8rem, 2vw, 1.1rem);
	}

	.bar-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		min-width: 0;
	}

	.project-chip {
		display: inline-grid;
		place-items: center;
		height: 2rem;
		padding: 0 0.85rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: var(--ink);
		background: var(--surface);
		box-shadow: var(--clay-sm);
	}

	.title-block h1 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.2;
		color: var(--ink-bright);
	}

	.subtitle {
		margin: 0.15rem 0 0;
		font-size: 0.78rem;
		color: var(--ink-bright-soft);
	}

	.team-avatars {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.team-avatars li {
		margin-left: -8px;
	}

	.team-avatars li:first-child {
		margin-left: 0;
	}

	.avatar {
		width: 34px;
		height: 34px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--ink);
		background: oklch(0.68 0.08 var(--h, 285));
		box-shadow: var(--clay-sm);
	}

	.avatar.sm {
		width: 28px;
		height: 28px;
		font-size: 0.6rem;
	}

	/* ---------- Header controls (pastel clay on dark bar) ---------- */

	/* Search: a raised pastel clay pill on the dark bar. Focus shows a
	   contrasting dark-violet inner-ring groove (>=3:1) drawn inside the pastel
	   surface so it is visible regardless of the surrounding dark bar. */
	.search {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0 0.8rem;
		height: 44px;
		border-radius: var(--r-control);
		background: var(--surface);
		color: var(--ink-soft);
		box-shadow: var(--clay-sm);
	}

	.search input {
		width: 9rem;
		max-width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 0.86rem;
	}

	.search input::placeholder {
		color: var(--ink-soft);
	}

	/* The search ring uses a negative offset so it draws INSIDE the pastel
	   surface — an inner highlight groove that reads at >=3:1 against the
	   pastel face. A positive offset would seat the ring against the dark bar
	   where a single ring color can't satisfy both surfaces. */
	.search:focus-within {
		outline: 3px solid var(--accent-soft);
		outline-offset: -3px;
	}

	.search input:focus-visible {
		outline: none;
	}

	/* Segmented track: a pressed dark well in the bar. */
	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 3px;
		border-radius: var(--r-control);
		background: var(--canvas);
		box-shadow: var(--clay-dark-press);
	}

	.segmented button,
	.chip {
		display: inline-flex;
		align-items: center;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink);
		border: 0;
		background: var(--surface);
		padding: 0 0.85rem;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		border-radius: 9px;
		cursor: pointer;
		box-shadow: var(--clay-sm);
	}

	/* Active option = pressed into pastel clay (inverted inset). */
	.segmented button[aria-pressed='true'],
	.chip[aria-pressed='true'] {
		color: var(--ink);
		font-weight: 700;
		background: oklch(0.78 0.04 285);
		box-shadow: var(--clay-pressed);
	}

	/* Primary: the violet clay pill — the single saturated fill. */
	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: inherit;
		font-size: 0.84rem;
		font-weight: 700;
		color: var(--on-accent);
		border: 0;
		min-height: 44px;
		padding: 0 1.05rem;
		border-radius: var(--r-control);
		cursor: pointer;
		background: var(--accent-fill);
		box-shadow: var(--clay-accent);
	}

	/* ---------- Board shell ---------- */

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: clamp(0.8rem, 2vw, 1.1rem);
		padding: 0.75rem 0.9rem;
		border-radius: var(--r-card);
		background: var(--danger-soft);
		box-shadow: var(--clay-dark-raise);
	}

	.error-banner .error-icon {
		color: var(--danger);
		flex: none;
	}

	.error-banner p {
		margin: 0;
		flex: 1;
		font-size: 0.82rem;
		color: var(--ink-bright);
	}

	.error-banner strong {
		color: var(--danger);
	}

	.error-actions {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.error-retry {
		font: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--ink);
		background: var(--surface);
		border: 0;
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.95rem;
		border-radius: var(--r-control);
		cursor: pointer;
		box-shadow: var(--clay-sm);
	}

	.error-dismiss {
		color: var(--ink);
	}

	.board-body {
		display: flex;
		flex-direction: column;
		gap: clamp(0.8rem, 2vw, 1.1rem);
	}

	/* ---------- Columns (dark clay slabs) ---------- */

	.column {
		display: flex;
		flex-direction: column;
		padding: 0.85rem;
		border-radius: var(--r-card);
		background: var(--clay-dark);
		box-shadow: var(--clay-dark-raise);
	}

	.column-head {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.2rem 0.3rem 0.8rem;
	}

	.column-dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--stage);
		flex: none;
		box-shadow: 0 0 6px rgba(120, 100, 200, 0.2);
	}

	.column-head h2 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.count {
		position: relative;
		min-width: 1.5rem;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--ink-bright-soft);
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		background: var(--canvas);
		box-shadow: var(--clay-dark-press);
	}

	.icon-btn {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 9px;
		background: var(--surface);
		color: var(--ink-soft);
		cursor: pointer;
		box-shadow: var(--clay-sm);
	}

	@media (hover: hover) {
		.icon-btn:hover {
			color: var(--ink);
		}
	}

	.card-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	/* ---------- Cards (bright opaque pastel-clay puffs) ---------- */

	.card {
		padding: 0.8rem 0.85rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--clay);
	}

	.card-head {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
	}

	.grip {
		flex: none;
		margin-top: 0.15rem;
		color: var(--ink-faint);
		opacity: 0.5;
		cursor: grab;
	}

	@media (hover: hover) {
		.card:hover .grip {
			opacity: 1;
		}
	}

	.card-title {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 650;
		line-height: 1.35;
		color: var(--ink);
	}

	/* Labels: pastel chips with slightly more saturated face than the card.
	   Dark indigo text carries the meaning; tone is a secondary hue cue. */
	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin: 0.55rem 0 0;
		padding: 0;
		list-style: none;
	}

	.label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		padding: 0.16rem 0.55rem;
		border-radius: 999px;
		color: var(--ink);
		background: var(--lb);
		box-shadow: var(--clay-sm);
	}

	.checklist {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0.55rem 0 0;
		font-size: 0.74rem;
		color: var(--ink-soft);
	}

	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.65rem;
		padding-top: 0.6rem;
		border-top: 1px solid rgba(110, 100, 170, 0.15);
	}

	.foot-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
	}

	.priority {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: capitalize;
	}

	.priority .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	.priority.pri-high {
		color: var(--pri-high-ink);
	}

	.priority.pri-high .dot {
		background: var(--pri-high);
	}

	.priority.pri-medium {
		color: var(--pri-medium-ink);
	}

	.priority.pri-medium .dot {
		background: var(--pri-medium);
	}

	.due {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.74rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.due.is-done {
		color: var(--done-ink);
	}

	.assignees {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.assignees li {
		margin-left: -8px;
	}

	.assignees li:first-child {
		margin-left: 0;
	}

	/* Add-card: a raised pastel clay button. */
	.add-card {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		width: 100%;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-soft);
		border: 0;
		background: var(--surface);
		min-height: 44px;
		padding: 0.6rem;
		border-radius: var(--r-card);
		cursor: pointer;
		box-shadow: var(--clay-sm);
	}

	@media (hover: hover) {
		.add-card:hover {
			color: var(--ink);
		}
	}

	.empty-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.2rem 0.5rem;
		border-radius: var(--r-card);
		background: var(--canvas);
		color: var(--ink-bright-soft);
		font-size: 0.78rem;
		font-weight: 600;
		text-align: center;
		box-shadow: var(--clay-dark-press);
	}

	.empty-col p {
		margin: 0;
	}

	.empty-mark {
		width: 18px;
		height: 18px;
		border-radius: 6px;
		background: var(--clay-dark);
		box-shadow: var(--clay-dark-press);
		opacity: 0.8;
	}

	/* ---------- States: loading skeleton (pastel grooves, opacity pulse) ---------- */

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 0.8rem 0.85rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--clay-pressed);
	}

	.skel {
		border-radius: 5px;
		background: rgba(110, 100, 170, 0.14);
	}

	.skel-title {
		height: 13px;
		width: 72%;
	}

	.skel-row {
		display: flex;
		gap: 0.3rem;
	}

	.skel-label {
		height: 13px;
		width: 46px;
		border-radius: 999px;
	}

	.skel-foot {
		height: 11px;
		width: 36%;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.45;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.skel {
			animation: pulse 1.6s ease-in-out infinite;
		}
	}

	/* ---------- Monospace metrics ---------- */

	.mono {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
	}

	/* ---------- Visually hidden (accessible text) ---------- */

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* ---------- Focus + motion ---------- */

	/* Focus ring: --accent (bright violet, L 0.62) contrasts >=3:1 against the
	   dark surfaces (app bar, columns, error banner) where every button sits.
   The search uses its own inner-ring treatment (see above). The primary
   inherits this ring; at outline-offset 2px it seats against the dark bar. */
	.board-root :where(button, input):focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	.primary:focus-visible {
		outline-color: var(--accent);
	}

	/* Hover: clay puffs up — deeper extrusion shadow, brighter glow. The card face
	   AND every parent surface stay at their opaque resting background; only the
	   box-shadow changes. Text contrast on the unchanged opaque face is preserved.
	   Selected/pressed controls, the primary, and error actions are excluded so
	   their semantic styles win. Under prefers-reduced-motion the shadow still
	   changes (a shadow change is not motion) but instantly — the transition and
	   transform lifts below are gated behind reduced-motion. */
	@media (hover: hover) {
		.card:hover,
		.chip:not([aria-pressed='true']):hover,
		.segmented button:not([aria-pressed='true']):hover,
		.icon-btn:not(.error-dismiss):hover,
		.add-card:hover,
		.error-retry:hover,
		.project-chip:hover {
			box-shadow: var(--clay-hover);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.card,
		.chip,
		.segmented button,
		.primary,
		.add-card,
		.icon-btn,
		.error-retry,
		.project-chip,
		.label {
			transition:
				box-shadow 0.18s ease-out,
				background 0.18s ease-out,
				color 0.18s ease-out,
				transform 0.18s ease-out;
		}

		@media (hover: hover) {
			.card:hover {
				transform: translateY(-2px);
			}

			.primary:hover {
				box-shadow:
					inset 1.5px 1.5px 4px rgba(200, 190, 255, 0.35),
					inset -1.5px -1.5px 4px rgba(40, 30, 80, 0.35),
					0 6px 14px rgba(8, 8, 25, 0.4),
					0 0 14px rgba(120, 100, 200, 0.18);
				transform: translateY(-1px);
			}
		}

		.primary:active,
		.error-retry:active,
		.add-card:active,
		.chip:active,
		.segmented button:active {
			transform: translateY(0);
		}
	}

	/* ---------- Responsive ---------- */

	@media (min-width: 48rem) {
		.board-body {
			flex-direction: row;
			overflow-x: auto;
			padding-bottom: 0.5rem;
		}

		.column {
			flex: 0 0 17.5rem;
		}
	}

	.board-body {
		scrollbar-width: thin;
		scrollbar-color: oklch(0.35 0.04 275) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 10px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: oklch(0.35 0.04 275);
		border-radius: 999px;
	}
</style>
