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

	// Column accent dots pull from the disciplined mid-century palette:
	// slate→warm khaki, blue→teal, amber→mustard, green→sage-teal.
	const toneAccent: Record<LabelTone, string> = {
		violet: 'oklch(0.5 0.07 290)',
		teal: 'oklch(0.5 0.09 195)',
		blue: 'oklch(0.5 0.09 210)',
		slate: 'oklch(0.5 0.025 70)',
		indigo: 'oklch(0.5 0.07 275)',
		green: 'oklch(0.45 0.08 170)',
		pink: 'oklch(0.55 0.13 350)',
		amber: 'oklch(0.62 0.14 75)',
		rose: 'oklch(0.55 0.14 35)',
		red: 'oklch(0.5 0.15 28)',
		cyan: 'oklch(0.5 0.08 200)'
	};
</script>

<div class="board-root">
	<header class="board-header">
		<span class="header-starburst" aria-hidden="true"></span>

		<div class="header-left">
			<span class="project-chip">
				<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
					<polygon
						points="8,1 8.8,5.1 11.5,1.9 10.1,5.9 14.1,4.5 10.9,7.2 15,8 10.9,8.8 14.1,11.5 10.1,10.1 11.5,14.1 8.8,10.9 8,15 7.2,10.9 4.5,14.1 5.9,10.1 1.9,11.5 5.1,8.8 1,8 5.1,7.2 1.9,4.5 5.9,5.9 4.5,1.9 7.2,5.1"
						fill="currentColor"
					/>
				</svg>
				Aurora
			</span>
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
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
				New task
			</button>
		</div>
	</header>

	<div class="error-banner" role="status" aria-live="polite">
		<svg class="error-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
			<path d="M8 1.6l6.4 11.4H1.6L8 1.6z" fill="oklch(0.85 0.06 65)" />
			<path
				d="M8 1.6l6.4 11.4H1.6L8 1.6z"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linejoin="miter"
			/>
			<path
				d="M8 6v3.4"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
			/>
			<rect x="7.2" y="11" width="1.6" height="1.6" fill="currentColor" />
		</svg>
		<p>
			<strong>Sync paused.</strong> Couldn't reach the server. Recent changes may not be saved.
		</p>
		<div class="error-actions">
			<button type="button" class="error-retry">Retry</button>
			<button type="button" class="icon-btn error-dismiss" aria-label="Dismiss error">
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
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
			<section class="column" style="--accent: {toneAccent[col.accent]}">
				<header class="column-head">
					<span class="column-mark" aria-hidden="true">
						<span class="column-mark-back"></span>
						<span class="column-mark-dot"></span>
					</span>
					<h2>{col.name}</h2>
					<span
						class="count"
						aria-label="{col.cards.length} {col.cards.length === 1 ? 'card' : 'cards'}"
						>{col.cards.length}</span
					>
					<button type="button" class="icon-btn" aria-label="More actions for {col.name}">
						<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
							<rect x="2.5" y="7" r="1.4" width="2" height="2" fill="currentColor" />
							<rect x="7" y="7" width="2" height="2" fill="currentColor" />
							<rect x="11.5" y="7" width="2" height="2" fill="currentColor" />
						</svg>
					</button>
				</header>

				<ul class="card-list">
					{#each col.cards as card (card.id)}
						<li>
							<article class="card" aria-labelledby="title-{card.id}">
								<div class="card-main">
									<div class="card-head">
										<span class="grip" aria-hidden="true">
											<svg viewBox="0 0 16 16" width="11" height="11">
												<rect x="3" y="3" width="2.4" height="2.4" fill="currentColor" />
												<rect x="10.6" y="3" width="2.4" height="2.4" fill="currentColor" />
												<rect x="3" y="6.8" width="2.4" height="2.4" fill="currentColor" />
												<rect x="10.6" y="6.8" width="2.4" height="2.4" fill="currentColor" />
												<rect x="3" y="10.6" width="2.4" height="2.4" fill="currentColor" />
												<rect x="10.6" y="10.6" width="2.4" height="2.4" fill="currentColor" />
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
											<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
												<rect
													x="2.5"
													y="2.5"
													width="11"
													height="11"
													fill="none"
													stroke="currentColor"
													stroke-width="1.5"
												/>
												<path
													d="M5 8.5l2 2 4-4.5"
													fill="none"
													stroke="currentColor"
													stroke-width="1.6"
													stroke-linecap="round"
													stroke-linejoin="round"
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
													<circle
														cx="8"
														cy="8"
														r="6.5"
														fill="none"
														stroke="currentColor"
														stroke-width="1.5"
													/>
													<path
														d="M5 8.5l2 2 4-4.5"
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
							<span class="empty-mark" aria-hidden="true">
								<svg viewBox="0 0 16 16" width="22" height="22">
									<polygon
										points="8,2 8.96,5.7 12.2,3.8 10.3,7 14,8 10.3,9 12.2,12.2 9,10.3 8,14 7,10.3 3.8,12.2 5.7,9 2,8 5.7,7 3.8,3.8 7,5.7"
										fill="none"
										stroke="currentColor"
										stroke-width="1.3"
										stroke-linejoin="miter"
									/>
								</svg>
							</span>
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
									stroke-width="2"
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
		/* Warm parchment + espresso ink. No pure black/white anywhere. */
		--parchment: oklch(0.94 0.028 80);
		--parchment-deep: oklch(0.9 0.035 75);
		--surface: oklch(0.97 0.018 80);
		--card: oklch(0.99 0.008 80);
		--ink: oklch(0.28 0.035 50);
		--ink-soft: oklch(0.42 0.032 50);
		--ink-faint: oklch(0.46 0.03 60);
		--rule: oklch(0.82 0.025 70);
		--rule-strong: oklch(0.7 0.035 65);

		/* Disciplined mid-century signature palette. */
		--mustard: oklch(0.62 0.14 75);
		--mustard-deep: oklch(0.45 0.12 62); /* AA button fill + focus ring */
		--teal: oklch(0.5 0.09 195);
		--teal-deep: oklch(0.38 0.07 195); /* done/check ink */
		--coral: oklch(0.55 0.14 35);
		--coral-deep: oklch(0.45 0.15 28); /* high-priority ink */

		--on-accent: oklch(0.97 0.018 80); /* cream on deep accents */
		--serif:
			ui-serif, 'Iowan Old Style', 'Palatino Linotype', P052, Palatino, 'Source Serif 4', serif;
		--sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

		position: relative;
		min-height: 100vh;
		padding: clamp(1rem, 2.5vw, 2rem);
		font-family: var(--sans);
		font-synthesis: none;
		color: var(--ink);
		background:
			radial-gradient(at 100% 0%, var(--parchment-deep) 0px, transparent 45%),
			radial-gradient(at 0% 100%, var(--parchment-deep) 0px, transparent 42%), var(--parchment);
	}

	/* ---------- Header ---------- */

	.board-header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1rem 1.2rem;
		border: 2px solid var(--ink);
		background: var(--surface);
		box-shadow: 6px 6px 0 var(--ink);
		overflow: hidden;
	}

	/* Faint corner starburst watermark — the "composition" illustration moment. */
	.header-starburst {
		position: absolute;
		top: -28px;
		right: -28px;
		width: 150px;
		height: 150px;
		pointer-events: none;
		opacity: 0.12;
		background: var(--mustard);
		-webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><polygon points='8,1 8.8,5.1 11.5,1.9 10.1,5.9 14.1,4.5 10.9,7.2 15,8 10.9,8.8 14.1,11.5 10.1,10.1 11.5,14.1 8.8,10.9 8,15 7.2,10.9 4.5,14.1 5.9,10.1 1.9,11.5 5.1,8.8 1,8 5.1,7.2 1.9,4.5 5.9,5.9 4.5,1.9 7.2,5.1'/></svg>")
			center / contain no-repeat;
		mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><polygon points='8,1 8.8,5.1 11.5,1.9 10.1,5.9 14.1,4.5 10.9,7.2 15,8 10.9,8.8 14.1,11.5 10.1,10.1 11.5,14.1 8.8,10.9 8,15 7.2,10.9 4.5,14.1 5.9,10.1 1.9,11.5 5.1,8.8 1,8 5.1,7.2 1.9,4.5 5.9,5.9 4.5,1.9 7.2,5.1'/></svg>")
			center / contain no-repeat;
	}

	.header-left,
	.header-right {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		flex-wrap: wrap;
		position: relative;
		z-index: 1;
	}

	.project-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		height: 2rem;
		padding: 0 0.75rem 0 0.55rem;
		border: 2px solid var(--ink);
		color: var(--on-accent);
		background: var(--mustard-deep);
		font-family: var(--sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		box-shadow: 3px 3px 0 var(--ink);
	}

	.title-block h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.15;
	}

	.subtitle {
		margin: 0.2rem 0 0;
		font-family: var(--sans);
		font-size: 0.78rem;
		color: var(--ink-soft);
		letter-spacing: 0.01em;
	}

	.team-avatars {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0 0 0 0.6rem;
		border-left: 2px solid var(--rule);
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
		font-family: var(--sans);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--on-accent);
		background: oklch(0.42 0.08 var(--h, 60));
		border: 2px solid var(--ink);
		box-shadow: 2px 2px 0 var(--ink);
	}

	.avatar.sm {
		width: 28px;
		height: 28px;
		font-size: 0.62rem;
		box-shadow: 1.5px 1.5px 0 var(--ink);
	}

	/* ---------- Header controls ---------- */

	.search {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.6rem;
		border: 2px solid var(--ink);
		background: var(--card);
		color: var(--ink-soft);
		box-shadow: 2px 2px 0 var(--ink);
	}

	.search input {
		width: 8.5rem;
		min-height: 44px;
		border: 0;
		background: transparent;
		color: var(--ink);
		font-family: var(--sans);
		font-size: 0.85rem;
	}

	.search input::placeholder {
		color: var(--ink-faint);
	}

	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 3px;
		border: 2px solid var(--ink);
		background: var(--card);
		box-shadow: 2px 2px 0 var(--ink);
	}

	.segmented button,
	.chip {
		display: inline-flex;
		align-items: center;
		font-family: var(--sans);
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--ink);
		border: 0;
		background: transparent;
		padding: 0 0.8rem;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		cursor: pointer;
	}

	.chip {
		background: var(--parchment);
	}

	.segmented button[aria-pressed='true'],
	.chip[aria-pressed='true'] {
		color: var(--on-accent);
		background: var(--mustard-deep);
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--sans);
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--on-accent);
		border: 2px solid var(--ink);
		min-height: 44px;
		padding: 0.5rem 1rem;
		background: var(--mustard-deep);
		box-shadow: 3px 3px 0 var(--ink);
		cursor: pointer;
	}

	/* ---------- Board + columns ---------- */

	.board-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.25rem;
	}

	.column {
		display: flex;
		flex-direction: column;
		padding: 0.9rem 0.85rem;
		border: 2px solid var(--ink);
		background: var(--surface);
		box-shadow: 5px 5px 0 var(--ink);
	}

	.column-head {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.1rem 0.2rem 0.85rem;
		border-bottom: 2px solid var(--rule);
		margin-bottom: 0.75rem;
	}

	/* Concentric cut-paper circle: a back-disc offset behind a front-disc. */
	.column-mark {
		position: relative;
		width: 16px;
		height: 16px;
		flex: none;
	}

	.column-mark-back,
	.column-mark-dot {
		position: absolute;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1.5px solid var(--ink);
	}

	.column-mark-back {
		top: 0;
		left: 0;
		background: var(--ink);
		opacity: 0.85;
	}

	.column-mark-dot {
		top: 3px;
		left: 3px;
		background: var(--accent);
	}

	.column-head h2 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.02rem;
		font-weight: 700;
	}

	.count {
		min-width: 1.6rem;
		text-align: center;
		font-family: var(--sans);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--ink);
		padding: 0.1rem 0.45rem;
		border: 1.5px solid var(--ink);
		background: var(--card);
	}

	.icon-btn {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		background: transparent;
		color: var(--ink-soft);
		cursor: pointer;
	}

	.icon-btn:hover {
		color: var(--ink);
		background: var(--parchment-deep);
	}

	.card-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	/* ---------- Cards ---------- */

	.card {
		padding: 0.75rem 0.85rem;
		border: 1.5px solid var(--rule-strong);
		background: var(--card);
		box-shadow: 3px 3px 0 var(--rule-strong);
	}

	.card-title {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--ink);
	}

	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.32rem;
		margin: 0.55rem 0 0;
		padding: 0;
		list-style: none;
	}

	.label {
		font-family: var(--sans);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		padding: 0.18rem 0.5rem;
		border: 1.5px solid currentColor;
	}

	.checklist {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0.55rem 0 0;
		font-family: var(--sans);
		font-size: 0.74rem;
		color: var(--ink-soft);
	}

	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.65rem;
		padding-top: 0.55rem;
		border-top: 1.5px solid var(--rule);
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
		gap: 0.32rem;
		font-family: var(--sans);
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.priority .dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		border: 1.5px solid currentColor;
	}

	.priority.pri-high {
		color: var(--coral-deep);
	}

	.priority.pri-high .dot {
		background: var(--coral-deep);
	}

	.priority.pri-medium {
		color: oklch(0.42 0.1 62);
	}

	.priority.pri-medium .dot {
		background: var(--mustard);
	}

	.due {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--sans);
		font-size: 0.74rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.due.is-done {
		color: var(--teal-deep);
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
		font-family: var(--sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--ink-soft);
		border: 2px dashed var(--rule-strong);
		background: transparent;
		min-height: 44px;
		padding: 0.6rem;
		cursor: pointer;
	}

	.add-card:hover {
		color: var(--ink);
		background: var(--parchment-deep);
		border-color: var(--ink);
	}

	.empty-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		padding: 1.25rem 0.5rem;
		border: 2px dashed var(--rule-strong);
		color: var(--ink-faint);
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.82rem;
		text-align: center;
	}

	.empty-mark {
		color: var(--mustard-deep);
		display: inline-flex;
	}

	/* ---------- Label tones: pale parchment tint + dark espresso ink, AA ---------- */

	.tone-violet {
		background: oklch(0.92 0.025 290);
		color: oklch(0.36 0.07 290);
	}
	.tone-teal {
		background: oklch(0.92 0.025 190);
		color: oklch(0.36 0.07 190);
	}
	.tone-blue {
		background: oklch(0.92 0.028 230);
		color: oklch(0.36 0.08 230);
	}
	.tone-slate {
		background: oklch(0.92 0.014 70);
		color: oklch(0.38 0.025 70);
	}
	.tone-indigo {
		background: oklch(0.92 0.028 275);
		color: oklch(0.36 0.08 275);
	}
	.tone-green {
		background: oklch(0.92 0.03 165);
		color: oklch(0.36 0.07 165);
	}
	.tone-pink {
		background: oklch(0.92 0.025 350);
		color: oklch(0.38 0.08 350);
	}
	.tone-amber {
		background: oklch(0.92 0.04 75);
		color: oklch(0.38 0.09 62);
	}
	.tone-rose {
		background: oklch(0.92 0.025 15);
		color: oklch(0.38 0.09 28);
	}
	.tone-red {
		background: oklch(0.92 0.03 25);
		color: oklch(0.38 0.1 28);
	}
	.tone-cyan {
		background: oklch(0.92 0.025 200);
		color: oklch(0.36 0.07 200);
	}

	/* ---------- States: drag affordance, loading skeleton, error ---------- */

	.card-head {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
	}

	.grip {
		flex: none;
		margin-top: 0.2rem;
		color: var(--ink-faint);
		opacity: 0.6;
	}

	.card:hover .grip {
		opacity: 1;
		color: var(--ink-soft);
	}

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		padding: 0.75rem 0.85rem;
		border: 1.5px solid var(--rule);
		background: var(--parchment-deep);
	}

	.skel {
		background: repeating-linear-gradient(
			90deg,
			oklch(0.82 0.03 70),
			oklch(0.88 0.025 75),
			oklch(0.82 0.03 70)
		);
		background-size: 200% 100%;
	}

	.skel-title {
		height: 13px;
		width: 70%;
	}

	.skel-row {
		display: flex;
		gap: 0.3rem;
	}

	.skel-label {
		height: 14px;
		width: 50px;
	}

	.skel-foot {
		height: 11px;
		width: 38%;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.skel {
			animation: shimmer 1.4s ease-in-out infinite;
		}
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-top: 1rem;
		padding: 0.7rem 0.95rem;
		border: 2px solid var(--coral-deep);
		background: oklch(0.92 0.04 30);
		box-shadow: 4px 4px 0 var(--ink);
	}

	.error-banner .error-icon {
		color: var(--coral-deep);
		flex: none;
	}

	.error-banner p {
		margin: 0;
		flex: 1;
		font-family: var(--sans);
		font-size: 0.82rem;
		color: var(--ink);
	}

	.error-banner strong {
		font-family: var(--serif);
		color: var(--coral-deep);
	}

	.error-actions {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.error-retry {
		font-family: var(--sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--on-accent);
		background: var(--coral-deep);
		border: 2px solid var(--ink);
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.95rem;
		box-shadow: 2px 2px 0 var(--ink);
		cursor: pointer;
	}

	.error-dismiss {
		color: var(--ink-soft);
		box-shadow: none;
		background: transparent;
	}

	/* ---------- Focus + motion ---------- */

	.board-root :where(button, input):focus-visible {
		outline: 3px solid var(--mustard-deep);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: no-preference) {
		.card,
		.chip,
		.segmented button,
		.primary,
		.icon-btn,
		.error-retry {
			transition:
				transform 0.18s ease,
				box-shadow 0.18s ease,
				background 0.18s ease,
				color 0.18s ease;
		}

		.card:hover {
			transform: translate(-2px, -2px);
			box-shadow: 5px 5px 0 var(--ink);
		}

		.primary:hover,
		.error-retry:hover {
			transform: translate(-1px, -1px);
		}

		.chip:hover,
		.segmented button:hover {
			background: var(--parchment-deep);
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
		scrollbar-color: var(--rule-strong) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 12px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: var(--rule-strong);
		border: 3px solid var(--parchment);
	}
</style>
