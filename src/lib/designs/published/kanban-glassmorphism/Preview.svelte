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

	const toneAccent: Record<LabelTone, string> = {
		violet: 'oklch(0.55 0.17 290)',
		teal: 'oklch(0.55 0.1 195)',
		blue: 'oklch(0.55 0.15 250)',
		slate: 'oklch(0.55 0.02 270)',
		indigo: 'oklch(0.55 0.16 275)',
		green: 'oklch(0.55 0.13 150)',
		pink: 'oklch(0.6 0.18 350)',
		amber: 'oklch(0.66 0.14 70)',
		rose: 'oklch(0.6 0.16 15)',
		red: 'oklch(0.57 0.19 25)',
		cyan: 'oklch(0.6 0.12 220)'
	};
</script>

<div class="board-root">
	<header class="glass board-header">
		<div class="header-left">
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

		<div class="header-right">
			<label class="search">
				<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
					<circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.6" />
					<path
						d="M11 11l3.2 3.2"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
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
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path
						d="M8 2v12M2 8h12"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
				New task
			</button>
		</div>
	</header>

	<section class="board-body" aria-label="Kanban board">
		{#each columns as col (col.id)}
			<section class="glass column" style="--accent: {toneAccent[col.accent]}">
				<header class="column-head">
					<span class="column-dot" aria-hidden="true"></span>
					<h2>{col.name}</h2>
					<span class="count" aria-label="{col.cards.length} cards">{col.cards.length}</span>
					<button type="button" class="icon-btn" aria-label="More actions for {col.name}">
						<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
							<circle cx="3.5" cy="8" r="1.4" fill="currentColor" />
							<circle cx="8" cy="8" r="1.4" fill="currentColor" />
							<circle cx="12.5" cy="8" r="1.4" fill="currentColor" />
						</svg>
					</button>
				</header>

				<ul class="card-list">
					{#each col.cards as card (card.id)}
						<li>
							<article class="card">
								<div class="card-main">
									<h3 class="card-title">{card.title}</h3>

									{#if card.labels.length}
										<ul class="labels">
											{#each card.labels as l (`${l.name}-${l.tone}`)}
												<li class="label tone-{l.tone}">{l.name}</li>
											{/each}
										</ul>
									{/if}

									{#if card.checklist}
										<p class="checklist">
											<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
												<path
													d="M3 4h10M3 8h10M3 12h7"
													fill="none"
													stroke="currentColor"
													stroke-width="1.5"
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
												<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
													<path
														d="M3.5 8.5l3 3 6-7"
														fill="none"
														stroke="currentColor"
														stroke-width="1.8"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
												</svg>
											{:else}
												<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
													<rect
														x="2.5"
														y="3.5"
														width="11"
														height="10"
														rx="1.6"
														fill="none"
														stroke="currentColor"
														stroke-width="1.4"
													/>
													<path
														d="M2.5 6.5h11M5.5 2v3M10.5 2v3"
														stroke="currentColor"
														stroke-width="1.4"
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

					{#if col.cards.length === 0}
						<li class="empty-col">
							<span class="empty-mark" aria-hidden="true"></span>
							<p>No cards yet</p>
						</li>
					{/if}

					<li>
						<button type="button" class="add-card">
							<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
								<path
									d="M8 2v12M2 8h12"
									fill="none"
									stroke="currentColor"
									stroke-width="1.7"
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
		--ink: oklch(0.26 0.035 285);
		--ink-soft: oklch(0.42 0.03 285);
		--ink-faint: oklch(0.46 0.03 285);
		--accent-strong: oklch(0.5 0.17 285);
		--hair: rgba(255, 255, 255, 0.6);
		--on-accent: oklch(0.99 0.004 285);
		--field-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);

		position: relative;
		min-height: 100vh;
		padding: clamp(1rem, 2.5vw, 2rem);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		font-synthesis: none;
		color: var(--ink);
		background:
			radial-gradient(at 16% 20%, oklch(0.7 0.2 290) 0px, transparent 55%),
			radial-gradient(at 84% 12%, oklch(0.78 0.18 350) 0px, transparent 52%),
			radial-gradient(at 78% 80%, oklch(0.74 0.16 230) 0px, transparent 55%),
			radial-gradient(at 22% 86%, oklch(0.78 0.15 165) 0px, transparent 52%),
			linear-gradient(135deg, oklch(0.62 0.17 275), oklch(0.66 0.16 320) 48%, oklch(0.72 0.16 355));
	}

	.glass {
		background: rgba(255, 255, 255, 0.55);
		-webkit-backdrop-filter: blur(18px) saturate(180%);
		backdrop-filter: blur(18px) saturate(180%);
		border: 1px solid var(--hair);
		box-shadow: var(--field-shadow);
	}

	@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
		/* ponytail: opaque fallback where backdrop-filter is unsupported */
		.glass {
			background: rgba(255, 255, 255, 0.88);
		}

		.card {
			background: rgba(255, 255, 255, 0.82);
		}
	}

	/* ---------- Header ---------- */

	.board-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.85rem 1.1rem;
		border-radius: 22px;
	}

	.header-left,
	.header-right {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		flex-wrap: wrap;
	}

	.project-chip {
		display: inline-grid;
		place-items: center;
		height: 2rem;
		padding: 0 0.7rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--on-accent);
		background: linear-gradient(135deg, oklch(0.52 0.17 290), oklch(0.5 0.18 340));
		box-shadow: 0 3px 10px oklch(0.5 0.17 310 / 0.45);
	}

	.title-block h1 {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 750;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	.subtitle {
		margin: 0.15rem 0 0;
		font-size: 0.76rem;
		color: var(--ink-soft);
	}

	.team-avatars {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0 0 0 0.5rem;
		border-left: 1px solid rgba(255, 255, 255, 0.5);
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
		color: var(--on-accent);
		background: oklch(0.46 0.13 var(--h, 285));
		border: 2px solid rgba(255, 255, 255, 0.75);
		box-shadow: 0 2px 6px rgba(31, 38, 135, 0.25);
	}

	.avatar.sm {
		width: 26px;
		height: 26px;
		font-size: 0.6rem;
		border-width: 2px;
	}

	/* ---------- Header controls ---------- */

	.search {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.6rem;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.4);
		border: 1px solid var(--hair);
		color: var(--ink-soft);
	}

	.search input {
		width: 8.5rem;
		min-height: 40px;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 0.85rem;
	}

	.search input::placeholder {
		color: var(--ink-faint);
	}

	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 2px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.35);
		border: 1px solid var(--hair);
	}

	.segmented button,
	.chip {
		display: inline-flex;
		align-items: center;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ink-soft);
		border: 0;
		background: transparent;
		padding: 0 0.7rem;
		min-height: 36px;
		border-radius: 9px;
		cursor: pointer;
	}

	.chip {
		background: rgba(255, 255, 255, 0.42);
		border: 1px solid var(--hair);
	}

	.segmented button[aria-pressed='true'],
	.chip[aria-pressed='true'] {
		color: var(--on-accent);
		background: var(--accent-strong);
		box-shadow: 0 2px 8px oklch(0.5 0.17 285 / 0.4);
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: inherit;
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--on-accent);
		border: 0;
		min-height: 40px;
		padding: 0.5rem 0.95rem;
		border-radius: 11px;
		cursor: pointer;
		background: linear-gradient(135deg, oklch(0.54 0.18 292), oklch(0.54 0.17 340));
		box-shadow: 0 6px 18px oklch(0.52 0.17 310 / 0.5);
	}

	/* ---------- Board + columns ---------- */

	.board-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.column {
		display: flex;
		flex-direction: column;
		padding: 0.85rem 0.8rem;
		border-radius: 20px;
	}

	.column-head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.2rem 0.25rem 0.75rem;
	}

	.column-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 4px color-mix(in oklch, var(--accent) 22%, transparent);
	}

	.column-head h2 {
		margin: 0;
		font-size: 0.92rem;
		font-weight: 700;
	}

	.count {
		min-width: 1.4rem;
		text-align: center;
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--ink-soft);
		padding: 0.05rem 0.4rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.5);
		border: 1px solid var(--hair);
	}

	.icon-btn {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border: 0;
		border-radius: 9px;
		background: transparent;
		color: var(--ink-soft);
		cursor: pointer;
	}

	.icon-btn:hover {
		background: rgba(255, 255, 255, 0.45);
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

	/* ---------- Cards ---------- */

	/* Cards are a distinct frosted z-layer above the columns: a lighter blur than the
	   columns reads as thinner, closer glass. Tuned for showcase fidelity; the GPU cost
	   of blurring ~9 cards is acceptable for a single-page design specimen. */
	.card {
		padding: 0.7rem 0.8rem;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.62);
		-webkit-backdrop-filter: blur(6px) saturate(150%);
		backdrop-filter: blur(6px) saturate(150%);
		border: 1px solid rgba(255, 255, 255, 0.7);
		box-shadow: 0 4px 14px rgba(31, 38, 135, 0.12);
	}

	.card-title {
		margin: 0;
		font-size: 0.88rem;
		font-weight: 620;
		line-height: 1.35;
		color: var(--ink);
	}

	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.label {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		padding: 0.12rem 0.45rem;
		border-radius: 999px;
	}

	.checklist {
		display: flex;
		align-items: center;
		gap: 0.32rem;
		margin: 0.5rem 0 0;
		font-size: 0.72rem;
		color: var(--ink-soft);
	}

	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.6rem;
		padding-top: 0.55rem;
		border-top: 1px solid rgba(255, 255, 255, 0.55);
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
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: capitalize;
	}

	.priority .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	.priority.pri-high {
		color: oklch(0.46 0.16 25);
	}

	.priority.pri-high .dot {
		background: oklch(0.57 0.19 25);
	}

	.priority.pri-medium {
		color: oklch(0.46 0.12 70);
	}

	.priority.pri-medium .dot {
		background: oklch(0.7 0.15 70);
	}

	.due {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.due.is-done {
		color: oklch(0.42 0.13 150);
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
		gap: 0.35rem;
		width: 100%;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ink-soft);
		border: 1px dashed rgba(255, 255, 255, 0.7);
		background: rgba(255, 255, 255, 0.28);
		min-height: 44px;
		padding: 0.6rem;
		border-radius: 12px;
		cursor: pointer;
	}

	.add-card:hover {
		color: var(--ink);
		background: rgba(255, 255, 255, 0.45);
	}

	.empty-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.45rem;
		padding: 1.1rem 0.5rem;
		border: 1px dashed rgba(255, 255, 255, 0.55);
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.2);
		color: var(--ink-faint);
		font-size: 0.74rem;
		text-align: center;
	}

	.empty-mark {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1.5px dashed currentColor;
		opacity: 0.7;
	}

	/* ---------- Label tones (AA ink on light frosted tint) ---------- */

	.tone-violet {
		background: rgba(124, 92, 255, 0.16);
		color: #3a2a92;
	}
	.tone-teal {
		background: rgba(20, 150, 150, 0.16);
		color: #135f5f;
	}
	.tone-blue {
		background: rgba(56, 120, 240, 0.16);
		color: #1f4fb0;
	}
	.tone-slate {
		background: rgba(90, 100, 120, 0.18);
		color: #3a4252;
	}
	.tone-indigo {
		background: rgba(99, 102, 241, 0.16);
		color: #352f96;
	}
	.tone-green {
		background: rgba(34, 160, 90, 0.16);
		color: #14592f;
	}
	.tone-pink {
		background: rgba(225, 70, 150, 0.16);
		color: #932a66;
	}
	.tone-amber {
		background: rgba(200, 140, 20, 0.18);
		color: #75510a;
	}
	.tone-rose {
		background: rgba(220, 80, 110, 0.16);
		color: #8d2440;
	}
	.tone-red {
		background: rgba(210, 55, 55, 0.16);
		color: #8a2424;
	}
	.tone-cyan {
		background: rgba(20, 160, 200, 0.16);
		color: #0f5266;
	}

	/* ---------- Focus + motion ---------- */

	.board-root :where(button, input):focus-visible {
		outline: 2px solid var(--accent-strong);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: no-preference) {
		.card,
		.chip,
		.segmented button,
		.primary,
		.add-card,
		.icon-btn {
			transition:
				transform 0.18s ease,
				box-shadow 0.18s ease,
				background 0.18s ease;
		}

		.card:hover {
			transform: translateY(-2px);
			box-shadow: 0 10px 22px rgba(31, 38, 135, 0.22);
		}

		.primary:hover {
			transform: translateY(-1px);
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
			flex: 0 0 17rem;
		}
	}

	.board-body {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.4) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 10px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.4);
		border-radius: 999px;
	}
</style>
