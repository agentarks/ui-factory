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

	// Whisper-chroma stage dots: nearly monochrome, a faint hue cue paired with the
	// column name (meaning never relies on color alone). Backlog slate / In Progress
	// blue / In Review amber / Done green — all at chroma 0.04.
	const stageDot: Partial<Record<LabelTone, string>> = {
		slate: 'oklch(0.52 0.02 260)',
		blue: 'oklch(0.52 0.05 250)',
		amber: 'oklch(0.6 0.05 70)',
		green: 'oklch(0.54 0.05 152)'
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
				<section class="column" style="--stage: {stageDot[col.accent] ?? 'oklch(0.52 0.02 260)'}">
					<header class="column-head">
						<span class="column-dot" aria-hidden="true"></span>
						<h2>{col.name}</h2>
						<span
							class="count"
							aria-label="{col.cards.length} {col.cards.length === 1 ? 'card' : 'cards'}"
							>{col.cards.length}</span
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
													<li class="label">{l.name}</li>
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
												{card.checklist.done}/{card.checklist.total} subtasks
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
												{card.due}
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
		 * Hairline-Ringed Neumorphism tokens — all OKLCH.
		 * Cool-gray monochrome base; surfaces match the canvas (the neumorphic
		 * signature). Depth comes only from paired light/dark extrusion shadows.
		 * No pure white, no pure black, no gradients, no backdrop blur.
		 */
		--canvas: oklch(0.9 0.006 255); /* neumorphic base; raised surfaces share it */
		--surface: oklch(0.9 0.006 255); /* cards, columns, controls (same as canvas) */
		--ink: oklch(0.26 0.014 255); /* AA-dark cool-gray ink (~7:1 on surface) */
		--ink-soft: oklch(0.37 0.014 255); /* meta: due, counts, checklist (~5:1) */
		--ink-faint: oklch(0.5 0.012 255); /* grip handle, decorative icons */
		--hair: oklch(0.8 0.008 255); /* 1px inner hairline ring on resting surfaces */
		--hair-strong: oklch(0.72 0.012 255); /* ring on selected/raised controls */
		--accent: oklch(0.42 0.016 255); /* monochrome dark focus/selection accent */
		--on-accent: oklch(0.96 0.004 255); /* near-white ink on dark fills (never #fff) */
		--hover-shadow:
			4px 4px 12px rgba(38, 72, 168, 0.42), -3px -3px 7px rgba(248, 250, 254, 0.9); /* cool-cobalt lower-right hover shadow + preserved near-light upper-left */
		--danger: oklch(0.48 0.13 25); /* muted clay-red error ink */
		--danger-soft: oklch(0.88 0.03 25); /* pale clay error surface */
		--done: oklch(0.45 0.1 152); /* muted green done */
		--pri-high: oklch(0.48 0.12 25); /* muted clay-red high priority */
		--pri-medium: oklch(0.48 0.09 65); /* muted amber medium priority */

		/*
		 * Paired extrusion shadows: a tinted near-white light from the upper-left
		 * and a dark cool-gray shade to the lower-right. Tinted, never #fff/#000.
		 * Inset (`--press*`) variants are the complementary pressed states.
		 */
		--raise-sm: 3px 3px 6px rgba(86, 92, 112, 0.26), -3px -3px 6px rgba(248, 250, 254, 0.9);
		--raise: 5px 5px 10px rgba(86, 92, 112, 0.28), -5px -5px 10px rgba(248, 250, 254, 0.92);
		--raise-lg: 8px 8px 16px rgba(86, 92, 112, 0.3), -8px -8px 16px rgba(248, 250, 254, 0.94);
		--press:
			inset 3px 3px 6px rgba(86, 92, 112, 0.28), inset -3px -3px 6px rgba(248, 250, 254, 0.9);
		--press-sm:
			inset 2px 2px 4px rgba(86, 92, 112, 0.24), inset -2px -2px 4px rgba(248, 250, 254, 0.88);

		/* The 1px darker inner hairline ring, composed with extrusion via box-shadow. */
		--ring: inset 0 0 0 1px var(--hair);
		--ring-strong: inset 0 0 0 1px var(--hair-strong);

		--r-card: 12px;
		--r-control: 10px;

		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		font-synthesis: none;
		color: var(--ink);
		background: var(--canvas);
		/* Canvas padding gives the floating slabs room to cast their dual shadows. */
		padding: clamp(0.9rem, 3vw, 1.4rem);
	}

	/* ---------- App bar (floating raised slab) ---------- */

	.app-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1rem;
		flex-wrap: wrap;
		padding: 0.9rem clamp(0.9rem, 2vw, 1.15rem);
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--raise), var(--ring);
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
		padding: 0 0.75rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: var(--ink);
		background: var(--surface);
		box-shadow: var(--raise-sm), var(--ring);
	}

	.title-block h1 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	.subtitle {
		margin: 0.15rem 0 0;
		font-size: 0.78rem;
		color: var(--ink-soft);
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
		/* Whisper-chroma per-person hue at L 0.45 keeps near-white initials at AA. */
		color: var(--on-accent);
		background: oklch(0.45 0.05 var(--h, 255));
		/* Crisp neumorphic ring separates overlaps against the surface. */
		box-shadow:
			var(--raise-sm),
			inset 0 0 0 1px oklch(0.4 0.02 var(--h, 255));
	}

	.avatar.sm {
		width: 28px;
		height: 28px;
		font-size: 0.6rem;
	}

	/* ---------- Header controls ---------- */

	/* The search field is a pressed-in well (classic neumorphic input). The
	   container shows a contrasting dark `:focus-within` ring so keyboard focus
	   is unmistakable on the low-contrast surface; the <input> stays the
	   semantic focus target, its own redundant outline suppressed. */
	.search {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0 0.8rem;
		height: 44px;
		border-radius: var(--r-control);
		background: var(--surface);
		color: var(--ink-soft);
		box-shadow: var(--press-sm), var(--ring);
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

	.search:focus-within {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	.search input:focus-visible {
		outline: none;
	}

	/* Segmented tracks: a raised slab holding one pressed-in option. */
	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 2px;
		border-radius: var(--r-control);
		background: var(--surface);
		box-shadow: var(--raise-sm), var(--ring);
	}

	.segmented button,
	.chip {
		display: inline-flex;
		align-items: center;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-soft);
		border: 0;
		background: transparent;
		padding: 0 0.85rem;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		border-radius: 8px;
		cursor: pointer;
	}

	/* Active option = pressed into the track (inset) + the stronger hairline ring. */
	.segmented button[aria-pressed='true'],
	.chip[aria-pressed='true'] {
		color: var(--ink);
		font-weight: 700;
		background: var(--surface);
		box-shadow: var(--press-sm), var(--ring-strong);
	}

	/* Primary action: the one inverted dark fill in the monochrome system. */
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
		background: var(--accent);
		box-shadow:
			var(--raise-sm),
			inset 0 0 0 1px oklch(0.36 0.016 255);
	}

	/* ---------- Board shell ---------- */
	/* Columns float directly on the canvas to cast their dual shadows; the shell
	   itself needs no background or surface. */

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: clamp(0.8rem, 2vw, 1.1rem);
		padding: 0.75rem 0.9rem;
		border-radius: var(--r-card);
		background: var(--danger-soft);
		box-shadow: var(--raise-sm), var(--ring);
	}

	.error-banner .error-icon {
		color: var(--danger);
		flex: none;
	}

	.error-banner p {
		margin: 0;
		flex: 1;
		font-size: 0.82rem;
		color: var(--ink);
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
		color: var(--danger);
		background: var(--surface);
		border: 0;
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.95rem;
		border-radius: var(--r-control);
		cursor: pointer;
		box-shadow:
			var(--raise-sm),
			inset 0 0 0 1px oklch(0.82 0.04 25);
	}

	.error-dismiss {
		color: var(--danger);
	}

	.board-body {
		display: flex;
		flex-direction: column;
		gap: clamp(0.8rem, 2vw, 1.1rem);
	}

	/* ---------- Columns (raised slabs + hairline ring) ---------- */

	.column {
		display: flex;
		flex-direction: column;
		padding: 0.85rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--raise-sm), var(--ring);
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
		box-shadow: inset 0 0 0 1px rgba(86, 92, 112, 0.2);
	}

	.column-head h2 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ink);
	}

	.count {
		min-width: 1.5rem;
		text-align: center;
		font-size: 0.74rem;
		font-weight: 700;
		color: var(--ink-soft);
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		background: var(--surface);
		box-shadow: var(--press-sm), var(--ring);
	}

	.icon-btn {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: var(--r-control);
		background: var(--surface);
		color: var(--ink-soft);
		cursor: pointer;
		box-shadow: var(--ring);
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

	/* ---------- Cards (raised slabs + hairline ring) ---------- */

	.card {
		padding: 0.8rem 0.85rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--raise-sm), var(--ring);
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

	/* Labels: monochrome pressed-in pills + dark ink. Meaning lives in the text. */
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
		color: var(--ink-soft);
		background: var(--surface);
		box-shadow: var(--press-sm), var(--ring);
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
		/* A pressed groove replaces the flat hairline divider. */
		box-shadow:
			inset 0 1px 0 rgba(86, 92, 112, 0.08),
			inset 0 -1px 0 rgba(248, 250, 254, 0.5);
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
		color: var(--pri-high);
	}

	.priority.pri-high .dot {
		background: var(--pri-high);
	}

	.priority.pri-medium {
		color: var(--pri-medium);
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
		color: var(--done);
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

	/* Add-card: a shallow pressed well signals the drop zone. */
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
		box-shadow: var(--press-sm), var(--ring);
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
		background: var(--surface);
		color: var(--ink-soft);
		font-size: 0.78rem;
		font-weight: 600;
		text-align: center;
		box-shadow: var(--press), var(--ring);
	}

	.empty-col p {
		margin: 0;
	}

	.empty-mark {
		width: 18px;
		height: 18px;
		border-radius: 5px;
		background: var(--surface);
		box-shadow: var(--press-sm), var(--ring-strong);
		opacity: 0.8;
	}

	/* ---------- States: loading skeleton (inset grooves, opacity pulse) ---------- */

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 0.8rem 0.85rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--press-sm), var(--ring);
	}

	.skel {
		border-radius: 5px;
		background: rgba(86, 92, 112, 0.1);
		box-shadow: inset 0 0 0 1px rgba(86, 92, 112, 0.05);
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
			animation: pulse 1.4s ease-in-out infinite;
		}
	}

	/* ---------- Focus + motion ---------- */

	.board-root :where(button, input):focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	/* The primary's focus outline renders against the surrounding app-bar surface
	   (outline-offset seats it outside the dark fill), so the dark accent ring —
	   the same indicator every other control uses — is the one that reads at
	   >=3:1 here. A near-white ring would sit on the near-white surface and vanish. */
	.primary:focus-visible {
		outline-color: var(--accent);
	}

	/* Shadow-only hover feedback — the hovered element's face AND every parent
	   surface stay at their neutral resting background; only the cast/extrusion
	   shadow changes, gaining a clearly contrasting cool-cobalt lower-right
	   highlight while the near-light upper-left shadow and the 1px hairline ring
	   are preserved (the ring is re-applied alongside --hover-shadow). Selected/
	   pressed controls, the primary, and error actions are excluded so their
	   semantic styles win. Native CSS only. Under prefers-reduced-motion the
	   shadow still changes (a shadow change is not motion) but instantly — the
	   0.16s fade and transform lifts below are gated behind reduced-motion. */
	@media (hover: hover) {
		.card:hover,
		.chip:not([aria-pressed='true']):hover,
		.segmented button:not([aria-pressed='true']):hover,
		.icon-btn:not(.error-dismiss):hover,
		.add-card:hover {
			box-shadow: var(--hover-shadow), var(--ring);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.card,
		.chip,
		.segmented button,
		.primary,
		.add-card,
		.icon-btn,
		.error-retry {
			transition:
				box-shadow 0.16s ease,
				background 0.16s ease,
				color 0.16s ease,
				transform 0.16s ease;
		}

		@media (hover: hover) {
			.card:hover {
				transform: translateY(-1px);
			}

			.primary:hover {
				box-shadow:
					var(--raise),
					inset 0 0 0 1px oklch(0.36 0.016 255);
				transform: translateY(-1px);
			}

			.error-retry:hover {
				box-shadow:
					var(--raise-sm),
					inset 0 0 0 1px oklch(0.82 0.04 25);
			}
		}

		.primary:active,
		.error-retry:active,
		.add-card:active {
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
		scrollbar-color: oklch(0.78 0.008 255) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 10px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: oklch(0.78 0.008 255);
		border-radius: 999px;
	}
</style>
