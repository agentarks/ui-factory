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

	// Bright pastel stage dots on dark headers — paired with the column name
	// so meaning never relies on color.
	const stageDot: Partial<Record<LabelTone, string>> = {
		slate: 'oklch(0.62 0.03 275)',
		blue: 'oklch(0.62 0.1 250)',
		amber: 'oklch(0.7 0.12 70)',
		green: 'oklch(0.62 0.1 152)'
	};

	// Pastel dot indicators for label chips — decorative only, always paired
	// with text. Label backgrounds stay dark indigo; only the dot carries hue.
	const labelDot: Partial<Record<LabelTone, string>> = {
		violet: 'oklch(0.65 0.12 285)',
		teal: 'oklch(0.65 0.12 180)',
		blue: 'oklch(0.65 0.12 250)',
		slate: 'oklch(0.62 0.02 275)',
		indigo: 'oklch(0.65 0.12 270)',
		green: 'oklch(0.65 0.12 152)',
		pink: 'oklch(0.65 0.12 350)',
		amber: 'oklch(0.7 0.12 70)',
		rose: 'oklch(0.65 0.12 15)',
		red: 'oklch(0.65 0.12 25)',
		cyan: 'oklch(0.65 0.12 200)'
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
														style="--dot: {labelDot[l.tone] ?? 'oklch(0.62 0.02 275)'}"
													>
														<span class="label-dot" aria-hidden="true"></span>
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
		 * Matches the selected reference: dark indigo canvas, dark bar,
		 * medium-dark indigo card/control faces, light lavender text.
		 * Depth from paired inset highlight/dark shadow + restrained glow.
		 * No near-white surfaces, no pure black/white, no gradients, no blur.
		 */
		--canvas: oklch(0.22 0.055 272);
		--bar-bg: oklch(0.17 0.05 273);
		--surface: oklch(0.3 0.058 275);
		--surface-hover: oklch(0.33 0.06 275);

		--ink: oklch(0.88 0.025 285);
		--ink-soft: oklch(0.7 0.04 285);
		--ink-faint: oklch(0.5 0.03 285);

		--accent: oklch(0.65 0.09 280);
		--accent-fill: oklch(0.46 0.1 280);
		--on-accent: oklch(0.92 0.02 285);
		--accent-soft: oklch(0.42 0.07 280);

		--danger: oklch(0.72 0.16 25);
		--danger-soft: oklch(0.25 0.05 25);
		--done: oklch(0.72 0.14 152);
		--pri-high: oklch(0.72 0.16 25);
		--pri-medium: oklch(0.75 0.14 65);

		/* Clay shadow: dark lower inset + lavender upper inset + thin violet
		   border + restrained glow + dark downward cast. */
		--clay:
			inset 0 -2px 4px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(140, 130, 210, 0.2),
			inset 0 0 0 1.5px rgba(110, 100, 170, 0.3), 0 0 10px rgba(100, 80, 200, 0.12),
			0 3px 8px rgba(0, 0, 0, 0.3);
		--clay-sm:
			inset 0 -1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(140, 130, 210, 0.15),
			inset 0 0 0 1px rgba(110, 100, 170, 0.25), 0 0 6px rgba(100, 80, 200, 0.08),
			0 2px 4px rgba(0, 0, 0, 0.2);
		--clay-pressed:
			inset 0 2px 4px rgba(0, 0, 0, 0.35), inset 0 -1px 2px rgba(140, 130, 210, 0.1),
			inset 0 0 0 1px rgba(110, 100, 170, 0.2);
		--clay-hover:
			inset 0 -2px 4px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(140, 130, 210, 0.25),
			inset 0 0 0 1.5px rgba(110, 100, 170, 0.35), 0 0 14px rgba(100, 80, 200, 0.16),
			0 5px 12px rgba(0, 0, 0, 0.35);
		--clay-accent:
			inset 0 -2px 4px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(180, 170, 240, 0.25),
			inset 0 0 0 1.5px rgba(120, 110, 190, 0.35), 0 0 10px rgba(100, 80, 200, 0.18),
			0 3px 8px rgba(0, 0, 0, 0.3);

		--r-card: 9px;
		--r-control: 8px;
		--r-header: 7px;
		--r-board: 10px;

		--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		--font-mono:
			ui-monospace, 'SF Mono', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;

		min-height: 100vh;
		font-family: var(--font-sans);
		font-synthesis: none;
		color: var(--ink);
		background: var(--canvas);
		padding: clamp(0.75rem, 2.5vw, 1.1rem);
	}

	/* ---------- App bar (dark indigo slab) ---------- */

	.app-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 0.75rem;
		flex-wrap: wrap;
		padding: 0.65rem clamp(0.65rem, 1.5vw, 0.85rem);
		border-radius: var(--r-board);
		background: var(--bar-bg);
		box-shadow: var(--clay);
		margin-bottom: clamp(0.6rem, 1.5vw, 0.85rem);
	}

	.bar-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		min-width: 0;
	}

	.project-chip {
		display: inline-grid;
		place-items: center;
		height: 1.75rem;
		padding: 0 0.65rem;
		border-radius: var(--r-control);
		font-size: 0.76rem;
		font-weight: 700;
		color: var(--ink);
		background: var(--surface);
		box-shadow: var(--clay-sm);
	}

	.title-block h1 {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.2;
		color: var(--ink);
	}

	.subtitle {
		margin: 0.1rem 0 0;
		font-size: 0.72rem;
		color: var(--ink-soft);
	}

	.team-avatars {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.team-avatars li {
		margin-left: -6px;
	}

	.team-avatars li:first-child {
		margin-left: 0;
	}

	.avatar {
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		font-size: 0.66rem;
		font-weight: 700;
		color: var(--on-accent);
		background: oklch(0.48 0.09 var(--h, 285));
		box-shadow: var(--clay-sm);
	}

	.avatar.sm {
		width: 24px;
		height: 24px;
		font-size: 0.54rem;
	}

	/* ---------- Header controls (dark indigo pills) ---------- */

	.search {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0 0.65rem;
		height: 44px;
		border-radius: var(--r-control);
		background: var(--surface);
		color: var(--ink-soft);
		box-shadow: var(--clay-sm);
	}

	.search input {
		width: 8rem;
		max-width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 0.82rem;
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

	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 3px;
		border-radius: var(--r-control);
		background: var(--bar-bg);
		box-shadow: var(--clay-pressed);
	}

	.segmented button,
	.chip {
		display: inline-flex;
		align-items: center;
		font: inherit;
		font-size: 0.76rem;
		font-weight: 600;
		color: var(--ink);
		border: 3px solid transparent;
		background: var(--surface);
		background-clip: padding-box;
		padding: 0 0.7rem;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		border-radius: 6px;
		cursor: pointer;
		box-shadow: var(--clay-sm);
	}

	.segmented button[aria-pressed='true'],
	.chip[aria-pressed='true'] {
		color: var(--on-accent);
		font-weight: 700;
		background: var(--accent-fill);
		box-shadow: var(--clay-pressed);
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--on-accent);
		border: 0;
		min-height: 44px;
		padding: 0 0.9rem;
		border-radius: var(--r-control);
		cursor: pointer;
		background: var(--accent-fill);
		box-shadow: var(--clay-accent);
	}

	/* ---------- Board shell ---------- */

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: clamp(0.6rem, 1.5vw, 0.85rem);
		padding: 0.6rem 0.75rem;
		border-radius: var(--r-board);
		background: var(--danger-soft);
		box-shadow: var(--clay);
	}

	.error-banner .error-icon {
		color: var(--danger);
		flex: none;
	}

	.error-banner p {
		margin: 0;
		flex: 1;
		font-size: 0.78rem;
		color: var(--ink);
	}

	.error-banner strong {
		color: var(--danger);
	}

	.error-actions {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.error-retry {
		font: inherit;
		font-size: 0.76rem;
		font-weight: 700;
		color: var(--ink);
		background: var(--surface);
		border: 0;
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.8rem;
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
		gap: clamp(0.6rem, 1.5vw, 0.85rem);
	}

	/* ---------- Columns (transparent/open — no raised shell) ---------- */

	.column {
		display: flex;
		flex-direction: column;
		background: transparent;
	}

	.column-head {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.6rem;
		border-radius: var(--r-header);
		background: var(--surface);
		box-shadow: var(--clay-sm);
		margin-bottom: 0.5rem;
	}

	.column-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--stage);
		flex: none;
		box-shadow: 0 0 5px rgba(120, 100, 200, 0.3);
	}

	.column-head h2 {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--ink);
	}

	.count {
		position: relative;
		min-width: 1.3rem;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 600;
		color: var(--ink-soft);
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		background: var(--canvas);
		box-shadow: var(--clay-pressed);
	}

	.icon-btn {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 4px solid transparent;
		border-radius: 6px;
		background: var(--surface);
		background-clip: padding-box;
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
		gap: 0.45rem;
	}

	/* ---------- Cards (medium-dark indigo putty) ---------- */

	.card {
		padding: 0.6rem 0.65rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--clay);
	}

	.card-head {
		display: flex;
		align-items: flex-start;
		gap: 0.35rem;
	}

	.grip {
		flex: none;
		margin-top: 0.1rem;
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
		font-size: 0.82rem;
		font-weight: 650;
		line-height: 1.3;
		color: var(--ink);
	}

	/* Labels: tiny dark pills with a pastel dot indicator. */
	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.4rem 0 0;
		padding: 0;
		list-style: none;
	}

	.label {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.62rem;
		font-weight: 600;
		color: var(--ink-soft);
		background: oklch(0.26 0.04 275);
		padding: 0.1rem 0.4rem;
		border-radius: 5px;
		box-shadow: var(--clay-sm);
	}

	.label-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--dot);
		flex: none;
	}

	.checklist {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		margin: 0.4rem 0 0;
		font-size: 0.7rem;
		color: var(--ink-soft);
	}

	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
		margin-top: 0.45rem;
		padding-top: 0.4rem;
		border-top: 1px solid rgba(110, 100, 170, 0.18);
	}

	.foot-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-width: 0;
	}

	.priority {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: capitalize;
	}

	.priority .dot {
		width: 6px;
		height: 6px;
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
		gap: 0.25rem;
		font-size: 0.7rem;
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
		margin-left: -6px;
	}

	.assignees li:first-child {
		margin-left: 0;
	}

	.add-card {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		width: 100%;
		font: inherit;
		font-size: 0.76rem;
		font-weight: 600;
		color: var(--ink-soft);
		border: 0;
		background: var(--surface);
		min-height: 44px;
		padding: 0.5rem;
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
		gap: 0.4rem;
		padding: 0.9rem 0.5rem;
		border-radius: var(--r-card);
		background: var(--surface);
		color: var(--ink-soft);
		font-size: 0.74rem;
		font-weight: 600;
		text-align: center;
		box-shadow: var(--clay-pressed);
	}

	.empty-col p {
		margin: 0;
	}

	.empty-mark {
		width: 16px;
		height: 16px;
		border-radius: 5px;
		background: var(--canvas);
		box-shadow: var(--clay-pressed);
		opacity: 0.8;
	}

	/* ---------- Loading skeleton ---------- */

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 0.6rem 0.65rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--clay-pressed);
	}

	.skel {
		border-radius: 4px;
		background: rgba(140, 130, 210, 0.12);
	}

	.skel-title {
		height: 11px;
		width: 72%;
	}

	.skel-row {
		display: flex;
		gap: 0.25rem;
	}

	.skel-label {
		height: 11px;
		width: 40px;
		border-radius: 999px;
	}

	.skel-foot {
		height: 10px;
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
		font-size: 0.68rem;
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

	.board-root :where(button, input):focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	.primary:focus-visible {
		outline-color: var(--accent);
	}

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
				transform: translateY(-1px);
			}

			.primary:hover {
				box-shadow:
					inset 0 -2px 4px rgba(0, 0, 0, 0.3),
					inset 0 2px 4px rgba(180, 170, 240, 0.3),
					inset 0 0 0 1.5px rgba(120, 110, 190, 0.4),
					0 0 14px rgba(100, 80, 200, 0.22),
					0 5px 12px rgba(0, 0, 0, 0.35);
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
			flex: 0 0 16rem;
		}
	}

	.board-body {
		scrollbar-width: thin;
		scrollbar-color: oklch(0.4 0.04 275) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 8px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: oklch(0.4 0.04 275);
		border-radius: 999px;
	}
</style>
