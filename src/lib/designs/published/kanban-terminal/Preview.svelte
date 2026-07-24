<script lang="ts">
	import { columns, members } from './fixtures';

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

	// Showcased states (no interaction): the active column and one selected card.
	const activeColumnId = 'in-progress';
	const selectedCardId = 'au-142';

	// Bottom status line + key map. Inert-specimen policy: this is a visual
	// reference only — the glyphs document the specimen actions, they are NOT
	// active bindings (no handlers, no shortcuts). The status reflects the
	// visible sync error rather than claiming "ready".
	const legendKeys = [
		{ key: '[N]', action: 'New task' },
		{ key: '[/]', action: 'Search' },
		{ key: '[B/L]', action: 'Board / List' },
		{ key: '[F5]', action: 'Retry sync' }
	];
</script>

<div class="board-root">
	<header class="app-bar">
		<div class="bar-row bar-left">
			<span class="project-chip">[AURORA]</span>
			<div class="title-block">
				<h1>Sprint 24 · Board</h1>
				<p class="subtitle">{columns.length} cols · {cardTotal} cards · updated 2m ago</p>
			</div>
			<ul class="team-avatars" aria-label="Team members">
				{#each members as m (m.id)}
					<li class="avatar" aria-label={m.name} title={m.name}>{m.initials}</li>
				{/each}
			</ul>
		</div>

		<div class="bar-row bar-right">
			<label class="search">
				<span class="search-label">SEARCH</span>
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.5" />
					<path
						d="M10.6 10.6l3.1 3.1"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
				<input
					type="search"
					placeholder="search cards"
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
					onclick={() => (activeView = 'board')}>Board</button
				>
				<button
					type="button"
					aria-pressed={activeView === 'list'}
					onclick={() => (activeView = 'list')}>List</button
				>
			</div>

			<button type="button" class="primary">
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="1.8" />
				</svg>
				New task
			</button>
		</div>
	</header>

	<main class="board-shell">
		<div class="error-banner" role="status" aria-live="polite">
			<span class="error-mark" aria-hidden="true">[!]</span>
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
							stroke-width="1.7"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</div>
		</div>

		<section class="board-body" aria-label="Kanban board">
			{#each columns as col (col.id)}
				<section
					class="column{col.id === activeColumnId ? ' is-active' : ''}"
					aria-label={col.id === activeColumnId ? `${col.name}, active column` : col.name}
				>
					<header class="column-head">
						<h2>{col.name}</h2>
						{#if col.id === activeColumnId}
							<span class="active-tag" aria-hidden="true">&lt;ACTIVE&gt;</span>
						{/if}
						<span
							class="count"
							aria-label={`${col.cards.length} ${col.cards.length === 1 ? 'card' : 'cards'}`}
						>
							[{col.cards.length}]
						</span>
						<button type="button" class="icon-btn" aria-label="More actions for {col.name}">
							<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
								<circle cx="3.5" cy="8" r="1.4" fill="currentColor" />
								<circle cx="8" cy="8" r="1.4" fill="currentColor" />
								<circle cx="12.5" cy="8" r="1.4" fill="currentColor" />
							</svg>
						</button>
					</header>

					<div class="card-list">
						{#each col.cards as card (card.id)}
							<article
								class="card{card.done ? ' is-done' : ''}{card.id === selectedCardId
									? ' is-selected'
									: ''}"
								aria-label={card.id === selectedCardId ? `${card.title}, selected` : undefined}
								aria-labelledby={card.id === selectedCardId ? undefined : `title-${card.id}`}
							>
								<div class="card-top">
									<span class="cid">{card.id}</span>
									<span class="grip" aria-hidden="true" title="Drag to move">
										<svg viewBox="0 0 16 16" width="11" height="11">
											<circle cx="5.5" cy="4" r="1.1" fill="currentColor" />
											<circle cx="10.5" cy="4" r="1.1" fill="currentColor" />
											<circle cx="5.5" cy="8" r="1.1" fill="currentColor" />
											<circle cx="10.5" cy="8" r="1.1" fill="currentColor" />
											<circle cx="5.5" cy="12" r="1.1" fill="currentColor" />
											<circle cx="10.5" cy="12" r="1.1" fill="currentColor" />
										</svg>
									</span>
								</div>

								<h3 class="card-title" id="title-{card.id}">{card.title}</h3>

								{#if card.labels.length}
									<ul class="labels">
										{#each card.labels as l (`${card.id}-${l.name}`)}
											<li class="label">[{l.name}]</li>
										{/each}
									</ul>
								{/if}

								{#if card.checklist}
									<p class="checklist">[ {card.checklist.done}/{card.checklist.total} ] subtasks</p>
								{/if}

								<footer class="card-foot">
									<span class="foot-meta">
										{#if card.priority}
											<span class="priority pri-{card.priority}">
												{card.priority === 'high' ? '[!HIGH]' : '[MED]'}
											</span>
										{/if}
										<span class="due {card.done ? 'is-done' : ''}">
											{#if card.done}
												<span class="done-mark" aria-hidden="true">[x]</span>
											{:else}
												<span class="due-tag" aria-hidden="true">DUE</span>
											{/if}
											{card.due}
										</span>
									</span>

									<ul class="assignees" aria-label="Assignees">
										{#each card.assignees as id (id)}
											{@const m = byId.get(id)}
											{#if m}
												<li class="avatar sm" aria-label={m.name} title={m.name}>
													{m.initials}
												</li>
											{/if}
										{/each}
									</ul>
								</footer>
							</article>
						{/each}

						{#if col.id === 'backlog'}
							<div class="skeleton-card" aria-hidden="true">
								<div class="skel skel-title"></div>
								<div class="skel-row">
									<div class="skel skel-label"></div>
									<div class="skel skel-label"></div>
								</div>
								<div class="skel skel-foot"></div>
							</div>
						{/if}

						{#if col.cards.length === 0}
							<div class="empty-col">
								<p>No cards yet</p>
							</div>
						{/if}

						<button type="button" class="add-card">
							<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
								<path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="1.8" />
							</svg>
							[ ADD A CARD ]
						</button>
					</div>
				</section>
			{/each}
		</section>
	</main>

	<footer
		class="status-legend"
		aria-label="Inactive key-map reference and board status (display only, no active shortcuts)"
	>
		<span class="leg-note">KEY MAP — reference, display only</span>
		<span class="leg-group">
			{#each legendKeys as k (k.key)}
				<span class="leg-item"
					><span class="k">{k.key}</span><span class="leg">{k.action}</span></span
				>
			{/each}
		</span>
		<span class="leg-status"
			>aurora:board · sprint-24 · {cardTotal} tasks ·
			<span class="leg-state">SYNC: PAUSED</span></span
		>
	</footer>
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
		 * ncurses / TUI tokens.
		 * Tinted near-black terminal canvas (no pure black/white); full
		 * monospace; reverse-video header bar and column title bars; bordered
		 * dialog-window columns and cards (box-rule framing); bracketed field
		 * and state notation; restrained ANSI-like semantic colors (yellow
		 * active, red priority/error, green done). No glow, no gradients, no
		 * backdrop blur, no graph paper, no coloured side-stripes — depth
		 * comes from borders and reverse video, not shadows.
		 */
		--canvas: oklch(0.2 0.028 270);
		--window: oklch(0.235 0.028 270);
		--bar: oklch(0.83 0.008 270);
		--head: oklch(0.32 0.018 270);

		--ink: oklch(0.9 0.006 270);
		--ink-soft: oklch(0.7 0.014 270);

		--on-bar: oklch(0.2 0.012 270);
		--on-bar-soft: oklch(0.34 0.014 270);

		--rule: oklch(0.42 0.016 270);
		--rule-soft: oklch(0.3 0.014 270);

		--accent: oklch(0.84 0.16 95);
		--red: oklch(0.7 0.19 25);
		--green: oklch(0.8 0.16 150);

		--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;

		min-height: 100vh;
		font-family: var(--font-mono);
		font-synthesis: none;
		color: var(--ink);
		background: var(--canvas);
		padding: clamp(0.75rem, 2vw, 1.1rem);
	}

	/* ---------- Reverse-video app bar ---------- */

	.app-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 0.75rem;
		flex-wrap: wrap;
		padding: 0.6rem clamp(0.65rem, 1.5vw, 0.85rem);
		background: var(--bar);
		color: var(--on-bar);
		border: 1px solid var(--rule);
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
		padding: 0 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink);
		background: var(--head);
		border: 1px solid var(--rule);
	}

	.title-block h1 {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.2;
		color: var(--on-bar);
	}

	.subtitle {
		margin: 0.1rem 0 0;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.02em;
		color: var(--on-bar-soft);
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
		border-radius: 0;
		font-size: 0.66rem;
		font-weight: 700;
		color: var(--ink);
		background: var(--head);
		border: 1px solid var(--rule);
	}

	.avatar.sm {
		width: 24px;
		height: 24px;
		font-size: 0.54rem;
	}

	/* ---------- Header controls (on the reverse-video bar) ---------- */

	.search {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0 0.6rem;
		height: 44px;
		background: transparent;
		color: var(--on-bar);
		border: 1px solid var(--rule);
	}

	.search-label {
		flex: none;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--on-bar-soft);
	}

	.search input {
		width: 8rem;
		max-width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--on-bar);
		font: inherit;
		font-size: 0.8rem;
	}

	.search input::placeholder {
		color: var(--on-bar-soft);
	}

	.search input:focus-visible {
		outline: none;
	}

	/* Header controls sit on the BRIGHT reverse-video bar: a yellow outline is
	   invisible there (~1:1), so the field shows a context-specific DARK ring.
	   Yellow focus is preserved on dark surfaces via the global rule below. */
	.search:focus-within {
		outline: 3px solid var(--on-bar);
		outline-offset: 1px;
	}

	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 3px;
		background: transparent;
		border: 1px solid var(--rule);
	}

	.chip,
	.view-toggle button {
		display: inline-flex;
		align-items: center;
		font: inherit;
		font-size: 0.76rem;
		font-weight: 600;
		color: var(--on-bar);
		border: 1px solid transparent;
		background: transparent;
		padding: 0 0.8rem;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		cursor: pointer;
	}

	/* Selection = reverse video: dark fill + light text. */
	.chip[aria-pressed='true'],
	.view-toggle button[aria-pressed='true'] {
		color: var(--ink);
		font-weight: 700;
		background: var(--head);
		border-color: var(--rule);
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--ink);
		min-height: 44px;
		padding: 0 0.9rem;
		cursor: pointer;
		background: var(--head);
		border: 1px solid var(--accent);
	}

	/* ---------- Error banner (bordered alert window + red marker) ---------- */

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: clamp(0.6rem, 1.5vw, 0.85rem);
		padding: 0.6rem 0.75rem;
		background: var(--window);
		/* full red border on all sides — never a coloured side-stripe */
		border: 1px solid var(--red);
	}

	.error-mark {
		flex: none;
		font-weight: 700;
		color: var(--red);
	}

	.error-banner p {
		margin: 0;
		flex: 1;
		font-size: 0.78rem;
		color: var(--ink);
	}

	.error-banner strong {
		color: var(--red);
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
		background: var(--head);
		border: 1px solid var(--rule);
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.8rem;
		cursor: pointer;
	}

	.error-dismiss {
		color: var(--ink-soft);
	}

	/* ---------- Board shell ---------- */

	.board-body {
		display: flex;
		flex-direction: column;
		gap: clamp(0.6rem, 1.5vw, 0.85rem);
	}

	/* ---------- Columns: bordered dialog windows ---------- */

	.column {
		display: flex;
		flex-direction: column;
		background: transparent;
		border: 1px solid var(--rule);
	}

	.column-head {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.6rem;
		background: var(--head);
		border-bottom: 1px solid var(--rule);
		margin-bottom: 0;
	}

	.column.is-active {
		border-color: var(--accent);
	}

	.column.is-active .column-head {
		background: var(--head);
		border-bottom-color: var(--accent);
	}

	.column-head h2 {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--ink);
		/* ncurses dialog-title flavor via CSS only: the DOM text stays the
		   semantic column name ("Backlog"), but it renders uppercased and
		   bracketed as `[ BACKLOG ]`. */
		text-transform: uppercase;
	}

	.column-head h2::before {
		content: '[ ';
	}

	.column-head h2::after {
		content: ' ]';
	}

	.active-tag {
		margin-left: -0.1rem;
		padding: 0.05rem 0.32rem;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--accent);
	}

	.count {
		margin-left: auto;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		color: var(--ink);
	}

	.icon-btn {
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		flex: none;
		font: inherit;
		border: 1px solid var(--rule);
		background: transparent;
		color: var(--ink-soft);
		cursor: pointer;
	}

	@media (hover: hover) {
		.icon-btn:hover {
			color: var(--accent);
		}
	}

	.card-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem;
	}

	/* ---------- Cards: bordered mini-windows ---------- */

	.card {
		padding: 0.6rem 0.65rem;
		background: transparent;
		border: 1px solid var(--rule-soft);
		cursor: auto;
	}

	.card.is-selected {
		border: 1px solid var(--accent);
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
	}

	.cid {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink-soft);
	}

	.grip {
		flex: none;
		color: var(--ink-soft);
		opacity: 0.4;
	}

	@media (hover: hover) {
		.card:hover .grip {
			opacity: 1;
		}
	}

	.card-title {
		margin: 0.3rem 0 0;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--ink);
	}

	.card.is-done .card-title {
		text-decoration: line-through;
		color: var(--green);
	}

	/* Bracketed label fields. */
	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.4rem 0 0;
		padding: 0;
		list-style: none;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--ink-soft);
		background: transparent;
		padding: 0.12rem 0.1rem;
	}

	.checklist {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		margin: 0.4rem 0 0;
		font-family: var(--font-mono);
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
		border-top: 1px dashed var(--rule-soft);
	}

	.foot-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-width: 0;
	}

	.priority {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.priority.pri-high {
		color: var(--red);
	}

	.priority.pri-medium {
		color: var(--accent);
	}

	.due {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.done-mark {
		color: var(--green);
	}

	.due-tag {
		color: var(--ink-soft);
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

	.add-card {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		width: 100%;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--ink-soft);
		border: 1px dashed var(--rule-soft);
		background: transparent;
		min-height: 44px;
		padding: 0.5rem;
		cursor: pointer;
	}

	@media (hover: hover) {
		.add-card:hover {
			color: var(--accent);
			border-color: var(--accent);
		}
	}

	/* ---------- States: empty + loading skeleton ---------- */

	.empty-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		padding: 0.9rem 0.5rem;
		background: transparent;
		border: 1px dashed var(--rule-soft);
	}

	.empty-col p {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--ink-soft);
		/* ncurses empty-window flavor via CSS only: DOM text stays the
		   baseline "No cards yet", rendering as `[ NO CARDS YET ]`. */
		text-transform: uppercase;
	}

	.empty-col p::before {
		content: '[ ';
	}

	.empty-col p::after {
		content: ' ]';
	}

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 0.6rem 0.65rem;
		background: transparent;
		border: 1px solid var(--rule-soft);
	}

	.skel {
		background: var(--ink-soft);
		opacity: 0.28;
	}

	.skel-title {
		height: 10px;
		width: 70%;
	}

	.skel-row {
		display: flex;
		gap: 0.25rem;
	}

	.skel-label {
		height: 10px;
		width: 40px;
	}

	.skel-foot {
		height: 9px;
		width: 36%;
	}

	@keyframes skel-pulse {
		0%,
		100% {
			opacity: 0.28;
		}
		50% {
			opacity: 0.1;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.skel {
			animation: skel-pulse 1.4s ease-in-out infinite;
		}
	}

	/* ---------- Bottom function / status legend ---------- */

	.status-legend {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: clamp(0.6rem, 1.5vw, 0.85rem);
		padding: 0.45rem 0.6rem;
		background: var(--window);
		border: 1px solid var(--rule);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--ink-soft);
	}

	.leg-group {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.leg-note {
		font-family: var(--font-mono);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.leg-item {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.k {
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--accent);
	}

	.leg-status {
		color: var(--ink-soft);
	}

	.leg-state {
		color: var(--red);
		font-weight: 700;
	}

	/* ---------- Focus + motion ---------- */

	/*
	 * Two focus contexts: controls on the bright reverse-video bar get a DARK
	 * outline (yellow would be ~1:1 on silver); controls on dark surfaces keep
	 * the yellow accent. outline-width/offset come from the global rule; only
	 * the colour is context-swapped here.
	 */
	.app-bar button:focus-visible {
		outline-color: var(--on-bar);
	}

	.board-root :where(button):focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	/*
	 * Hover (non-selected cards) is a multi-channel cue: a brightened border
	 * + an accented border colour, with no fill change and no transform. Gated
	 * behind (hover: hover) so a tap on a touch device cannot leave a sticky
	 * state resembling selection. Cards stay non-interactive (cursor: auto —
	 * no pointer/grab). ncurses is flat: there are no shadows anywhere.
	 */
	@media (hover: hover) {
		.card:not(.is-selected):hover {
			border-color: var(--accent);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.card,
		.chip,
		.view-toggle button,
		.primary,
		.add-card,
		.icon-btn,
		.error-retry {
			transition:
				border-color 0.15s ease-out,
				color 0.15s ease-out,
				background-color 0.15s ease-out;
		}
	}

	/* ---------- Responsive ---------- */

	@media (min-width: 48rem) {
		.board-body {
			flex-direction: row;
			overflow-x: auto;
			/* Internal padding keeps offset focus rings of every column control
			   from clipping at the scroll edges. The focus extent is 3px outline
			   + 2px offset (5px), so >=6px breathing room is required on every
			   side (overflow-x:auto also clips the block axis). */
			padding: 6px;
			gap: clamp(0.6rem, 1.5vw, 0.85rem);
		}

		.column {
			flex: 1 0 15rem;
		}
	}

	.board-body {
		scrollbar-width: thin;
		scrollbar-color: var(--rule) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 8px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: var(--rule);
	}
</style>
