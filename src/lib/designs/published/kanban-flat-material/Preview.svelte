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

	// Semantic stage color per column accent (disciplined, never a side-stripe).
	const stageDot: Partial<Record<LabelTone, string>> = {
		slate: 'oklch(0.52 0.02 260)',
		blue: 'oklch(0.52 0.14 255)',
		amber: 'oklch(0.62 0.14 65)',
		green: 'oklch(0.54 0.12 152)'
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
				<section class="column" style="--stage: {stageDot[col.accent] ?? 'oklch(0.52 0.02 260)'}">
					<header class="column-head">
						<span class="column-dot" aria-hidden="true"></span>
						<h2>{col.name}</h2>
						<span
							class="count"
							aria-label="{col.cards.length} {col.cards.length === 1 ? 'card' : 'cards'}"
							>{col.cards.length}</span
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
													<li class="label tone-{l.tone}">{l.name}</li>
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
		/* Flat / Material tokens — all OKLCH, no pure black/white, no gradients. */
		--canvas: oklch(0.96 0.015 250); /* pale blue canvas */
		--app-bar: oklch(0.42 0.134 260); /* deep cobalt */
		--app-bar-2: oklch(0.47 0.124 260); /* raised cobalt surface */
		--surface: oklch(0.985 0.004 250); /* solid near-white */
		--surface-2: oklch(0.965 0.008 250); /* tinted surface */
		--ink: oklch(0.28 0.03 260); /* dark navy ink */
		--ink-soft: oklch(0.45 0.025 260);
		--ink-faint: oklch(0.52 0.022 260);
		--primary: oklch(0.45 0.144 260); /* cobalt primary action */
		--primary-press: oklch(0.4 0.144 260);
		--on-bar: oklch(0.99 0.004 250); /* near-white text on cobalt (never #fff) */
		--hair: oklch(0.9 0.01 250); /* hairline on near-white surfaces */
		--danger: oklch(0.5 0.19 25);
		--danger-soft: oklch(0.96 0.03 25);

		/* Crisp layered 4dp/8dp-style elevation (navy shadows, not pure black). */
		--shadow-1: 0 1px 2px rgba(15, 23, 42, 0.1), 0 1px 3px rgba(15, 23, 42, 0.08);
		--shadow-2: 0 1px 3px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.08);
		--shadow-4: 0 2px 4px rgba(15, 23, 42, 0.1), 0 4px 8px rgba(15, 23, 42, 0.1);
		--shadow-8: 0 4px 8px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.1);
		--bar-shadow: 0 2px 6px rgba(15, 23, 42, 0.22), 0 1px 2px rgba(15, 23, 42, 0.28);

		--r-card: 12px;
		--r-control: 8px;

		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		font-synthesis: none;
		color: var(--ink);
		background: var(--canvas);
	}

	/* ---------- App bar (full-bleed deep cobalt chrome) ---------- */

	.app-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1rem;
		flex-wrap: wrap;
		padding: 0.85rem clamp(1rem, 3vw, 1.5rem);
		background: var(--app-bar);
		color: var(--on-bar);
		box-shadow: var(--bar-shadow);
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
		padding: 0 0.7rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: var(--primary);
		background: var(--surface);
		box-shadow: var(--shadow-1);
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
		color: var(--on-bar);
		opacity: 0.82;
	}

	.team-avatars {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0 0 0 0.5rem;
		border-left: 1px solid rgba(255, 255, 255, 0.22);
	}

	.team-avatars li {
		margin-left: -10px;
	}

	.avatar {
		width: 34px;
		height: 34px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--on-bar);
		background: oklch(0.5 0.09 var(--h, 260));
		/* crisp ring separates overlaps against the bar */
		box-shadow: 0 0 0 2px var(--app-bar);
	}

	.avatar.sm {
		width: 28px;
		height: 28px;
		font-size: 0.62rem;
		box-shadow: 0 0 0 2px var(--surface);
	}

	/* ---------- Header controls ---------- */

	.search {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0 0.7rem;
		height: 44px;
		border-radius: var(--r-control);
		background: var(--surface);
		color: var(--ink-soft);
		box-shadow: var(--shadow-1);
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
		color: var(--ink-faint);
	}

	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 2px;
		border-radius: var(--r-control);
		background: rgba(255, 255, 255, 0.16);
	}

	.segmented button,
	.chip {
		display: inline-flex;
		align-items: center;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--on-bar);
		border: 0;
		background: transparent;
		padding: 0 0.8rem;
		min-width: 44px;
		min-height: 38px;
		justify-content: center;
		border-radius: 6px;
		cursor: pointer;
	}

	.segmented button[aria-pressed='true'],
	.chip[aria-pressed='true'] {
		color: var(--primary);
		background: var(--surface);
		font-weight: 700;
		box-shadow: var(--shadow-1);
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: inherit;
		font-size: 0.84rem;
		font-weight: 700;
		color: var(--primary);
		border: 0;
		min-height: 44px;
		padding: 0 1rem;
		border-radius: var(--r-control);
		cursor: pointer;
		background: var(--surface);
		box-shadow: var(--shadow-2);
	}

	/* ---------- Board shell ---------- */

	.board-shell {
		padding: clamp(1rem, 3vw, 1.5rem);
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 1rem;
		padding: 0.7rem 0.9rem;
		border-radius: var(--r-card);
		background: var(--danger-soft);
		box-shadow: var(--shadow-1);
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
		color: var(--on-bar);
		background: var(--danger);
		border: 0;
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.95rem;
		border-radius: var(--r-control);
		cursor: pointer;
	}

	.error-dismiss {
		color: var(--danger);
	}

	.board-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* ---------- Columns ---------- */

	.column {
		display: flex;
		flex-direction: column;
		padding: 0.85rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--shadow-2);
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
		padding: 0.05rem 0.45rem;
		border-radius: 999px;
		background: var(--surface-2);
	}

	.icon-btn {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: var(--r-control);
		background: transparent;
		color: var(--ink-soft);
		cursor: pointer;
	}

	.icon-btn:hover {
		background: var(--surface-2);
		color: var(--ink);
	}

	.card-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	/* ---------- Cards (solid surfaces, crisp elevation) ---------- */

	.card {
		padding: 0.75rem 0.85rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--shadow-1);
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

	.card:hover .grip {
		opacity: 1;
	}

	.card-title {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 650;
		line-height: 1.35;
		color: var(--ink);
	}

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
		padding: 0.14rem 0.5rem;
		border-radius: 999px;
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
		border-top: 1px solid var(--hair);
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
		color: oklch(0.45 0.18 25);
	}

	.priority.pri-high .dot {
		background: oklch(0.52 0.19 25);
	}

	.priority.pri-medium {
		color: oklch(0.45 0.13 65);
	}

	.priority.pri-medium .dot {
		background: oklch(0.6 0.14 65);
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
		color: oklch(0.42 0.13 152);
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
		border: 1px dashed oklch(0.78 0.02 260);
		background: transparent;
		min-height: 44px;
		padding: 0.6rem;
		border-radius: var(--r-card);
		cursor: pointer;
	}

	.add-card:hover {
		color: var(--ink);
		background: var(--surface-2);
	}

	.empty-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.2rem 0.5rem;
		border: 1px dashed oklch(0.78 0.02 260);
		border-radius: var(--r-card);
		background: var(--surface-2);
		color: var(--ink-soft);
		font-size: 0.78rem;
		font-weight: 600;
		text-align: center;
	}

	.empty-col p {
		margin: 0;
	}

	.empty-mark {
		width: 18px;
		height: 18px;
		border-radius: 4px;
		border: 2px solid currentColor;
		opacity: 0.55;
	}

	/* ---------- Label tones (solid pale tint + dark ink, AA) ---------- */

	.tone-violet {
		background: oklch(0.93 0.025 290);
		color: oklch(0.4 0.08 290);
	}
	.tone-teal {
		background: oklch(0.93 0.025 190);
		color: oklch(0.4 0.06 190);
	}
	.tone-blue {
		background: oklch(0.93 0.028 250);
		color: oklch(0.4 0.08 250);
	}
	.tone-slate {
		background: oklch(0.93 0.014 255);
		color: oklch(0.4 0.025 255);
	}
	.tone-indigo {
		background: oklch(0.93 0.028 275);
		color: oklch(0.4 0.08 275);
	}
	.tone-green {
		background: oklch(0.93 0.03 150);
		color: oklch(0.4 0.08 150);
	}
	.tone-pink {
		background: oklch(0.93 0.025 350);
		color: oklch(0.42 0.08 350);
	}
	.tone-amber {
		background: oklch(0.93 0.04 70);
		color: oklch(0.42 0.08 70);
	}
	.tone-rose {
		background: oklch(0.93 0.025 15);
		color: oklch(0.42 0.08 15);
	}
	.tone-red {
		background: oklch(0.93 0.03 25);
		color: oklch(0.42 0.09 25);
	}
	.tone-cyan {
		background: oklch(0.93 0.025 220);
		color: oklch(0.4 0.06 220);
	}

	/* ---------- States: loading skeleton (gradient-free opacity pulse) ---------- */

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 0.75rem 0.85rem;
		border-radius: var(--r-card);
		background: var(--surface);
		box-shadow: var(--shadow-1);
	}

	.skel {
		border-radius: 6px;
		background: oklch(0.9 0.012 250);
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
		outline: 3px solid var(--on-bar);
		outline-offset: 2px;
	}

	.app-bar :where(button, input, .search):focus-visible {
		outline-color: var(--surface);
	}

	.board-shell :where(button, input):focus-visible {
		outline-color: var(--primary);
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

		.card:hover {
			box-shadow: var(--shadow-8);
			transform: translateY(-2px);
		}

		.primary:hover {
			box-shadow: var(--shadow-4);
			transform: translateY(-1px);
		}

		.primary:active {
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
		scrollbar-color: oklch(0.8 0.02 260) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 10px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: oklch(0.8 0.02 260);
		border-radius: 999px;
	}
</style>
