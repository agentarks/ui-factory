<script lang="ts">
	import { columns, members } from './fixtures';

	const byId = new Map(members.map((m) => [m.id, m]));

	// Drafting coordinate axis labels for the four columns (A–D), like a
	// blueprint title block. Decorative; the column heading text is unchanged.
	const coordFor = (index: number) => String.fromCharCode(65 + index);

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
	const pad = (n: number) => String(n).padStart(2, '0');

	// Showcased states (no interaction): the active column and one selected card.
	const activeColumnId = 'in-progress';
	const selectedCardId = 'au-142';
</script>

<div class="board-root">
	<span class="reg" aria-hidden="true">✛</span>
	<span class="reg reg-br" aria-hidden="true">✛</span>

	<header class="board-head">
		<div class="header-left">
			<span class="project-chip">Aurora</span>
			<div class="title-block">
				<h1>Sprint 24 · Board</h1>
				<p class="subtitle">{columns.length} columns · {cardTotal} cards · updated 2m ago</p>
			</div>
			<ul class="team-avatars" aria-label="Team members">
				{#each members as m (m.id)}
					<li class="avatar" aria-label={m.name} title={m.name}>{m.initials}</li>
				{/each}
			</ul>
		</div>

		<div class="header-right">
			<label class="search">
				<span class="search-label">SEARCH</span>
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path
						d="M2 2h5M2 2v5M14 14h-5M14 14v-5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
					/>
					<circle cx="9.5" cy="6.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6" />
				</svg>
				<input
					type="search"
					placeholder="SEARCH CARDS"
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
				<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
					<path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="2" />
				</svg>
				New task
			</button>
		</div>
	</header>

	<div class="error-banner" role="status" aria-live="polite">
		<span class="error-mark" aria-hidden="true">!</span>
		<p>
			<strong>SYNC PAUSED.</strong> Couldn't reach the server. Recent changes may not be saved.
		</p>
		<div class="error-actions">
			<button type="button" class="error-retry">Retry</button>
			<button type="button" class="icon-btn error-dismiss" aria-label="Dismiss error">
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" stroke-width="2" />
				</svg>
			</button>
		</div>
	</div>

	<section class="board-body" aria-label="Kanban board">
		{#each columns as col, i (col.id)}
			<section
				class="column{col.id === activeColumnId ? ' is-active' : ''}"
				aria-label={col.id === activeColumnId ? `${col.name}, active column` : col.name}
			>
				<header class="col-head">
					<span class="coord" aria-hidden="true">{coordFor(i)}</span>
					<h2 class="col-name">{col.name}</h2>
					{#if col.id === activeColumnId}
						<span class="active-tag" aria-hidden="true">ACTIVE</span>
					{/if}
					<span
						class="count"
						aria-label={`${col.cards.length} ${col.cards.length === 1 ? 'card' : 'cards'}`}
						>N={pad(col.cards.length)}</span
					>
					<button
						type="button"
						class="icon-btn col-actions"
						aria-label="More actions for {col.name}"
					>
						<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
							<circle cx="3" cy="8" r="1.6" fill="currentColor" />
							<circle cx="8" cy="8" r="1.6" fill="currentColor" />
							<circle cx="13" cy="8" r="1.6" fill="currentColor" />
						</svg>
					</button>
				</header>

				<ul class="card-list">
					{#each col.cards as card (card.id)}
						<li>
							<article
								class="card{card.done ? ' is-done' : ''}{card.id === selectedCardId
									? ' is-selected'
									: ''}"
								aria-label={card.id === selectedCardId ? `${card.title}, selected` : undefined}
								aria-labelledby={card.id === selectedCardId ? undefined : `title-${card.id}`}
							>
								<div class="card-top">
									<span class="cid">
										<span class="tick" aria-hidden="true">✛</span>{card.id.toUpperCase()}</span
									>
									<span class="grip" aria-hidden="true">
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
											<li class="tag">{l.name}</li>
										{/each}
									</ul>
								{/if}

								{#if card.checklist}
									<p class="checklist">[{card.checklist.done}/{card.checklist.total}] SUBTASKS</p>
								{/if}

								<footer class="card-foot">
									<span class="foot-meta">
										{#if card.priority}
											<span class="priority pri-{card.priority}">
												<span class="mk" aria-hidden="true"
													>{card.priority === 'high' ? '◆' : '●'}</span
												>{card.priority === 'high' ? 'HIGH' : 'MED'}
											</span>
										{/if}
										<span class="due {card.done ? 'is-done' : ''}">
											{#if card.done}
												<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
													<path
														d="M3.5 8.5l3 3 6-7"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
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
												<li class="avatar sm" aria-label={m.name} title={m.name}>
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
								<div class="skel skel-tag"></div>
								<div class="skel skel-tag"></div>
							</div>
							<div class="skel skel-foot"></div>
						</li>
					{/if}

					{#if col.cards.length === 0}
						<li class="empty-col">
							<p>No cards yet</p>
						</li>
					{/if}

					<li>
						<button type="button" class="add-card">
							<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
								<path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="2" />
							</svg>
							ADD A CARD
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
		--paper: oklch(0.94 0.005 250);
		--surface: oklch(0.975 0.003 250);
		--ink: oklch(0.24 0.005 250);
		--ink-soft: oklch(0.4 0.006 250);
		--rule: oklch(0.24 0.005 250);
		--accent: oklch(0.42 0.13 236);
		--on-ink: oklch(0.97 0.004 250);
		--grid: oklch(0.82 0.006 250);

		position: relative;
		min-height: 100vh;
		padding: clamp(0.75rem, 2vw, 1.25rem);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
		font-synthesis: none;
		color: var(--ink);
		background-color: var(--paper);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath d='M16 0H0V16' fill='none' stroke='%23c1c4c8' stroke-width='1'/%3E%3C/svg%3E");
		border: 2px solid var(--rule);
		font-size: 12px;
		line-height: 1.4;
	}

	/* Drafting registration crosshairs at the board corners. */
	.reg {
		position: absolute;
		top: 5px;
		left: 5px;
		color: var(--accent);
		font-size: 11px;
		line-height: 1;
		opacity: 0.7;
	}
	.reg-br {
		top: auto;
		bottom: 5px;
		right: 5px;
		left: auto;
	}

	/* ---------- Header ---------- */

	.board-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
		padding: 0.75rem 0.85rem;
		background: var(--surface);
		border-bottom: 2px solid var(--rule);
	}

	.header-left,
	.header-right {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.project-chip {
		display: inline-grid;
		place-items: center;
		height: 1.9rem;
		padding: 0 0.55rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-ink);
		background: var(--ink);
		border: 1.5px solid var(--rule);
	}

	.title-block h1 {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		line-height: 1.15;
	}

	.subtitle {
		margin: 0.15rem 0 0;
		font-size: 0.7rem;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.team-avatars {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0 0 0 0.4rem;
		border-left: 1.5px solid var(--rule);
	}

	.team-avatars li {
		margin-left: -7px;
	}

	.avatar {
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--on-ink);
		background: var(--ink);
		border: 1.5px solid var(--surface);
	}

	.avatar.sm {
		width: 22px;
		height: 22px;
		font-size: 0.56rem;
	}

	/* ---------- Header controls ---------- */

	.search {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0 0.6rem;
		background: var(--paper);
		border: 1.5px solid var(--rule);
		color: var(--ink-soft);
		min-height: 44px;
	}

	.search input {
		width: 8.5rem;
		min-height: 44px;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		outline: none;
	}

	.search-label {
		flex: none;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.search input::placeholder {
		color: var(--ink-soft);
	}

	.segmented {
		display: inline-flex;
		gap: 0;
		background: var(--paper);
		border: 2px solid var(--rule);
	}

	.chip,
	.view-toggle button {
		display: inline-flex;
		align-items: center;
		font: inherit;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink);
		border: 0;
		border-right: 1.5px solid var(--rule);
		background: transparent;
		padding: 0 0.7rem;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		cursor: pointer;
	}

	.chip:last-child,
	.view-toggle button:last-child {
		border-right: 0;
	}

	.chip[aria-pressed='true'],
	.view-toggle button[aria-pressed='true'] {
		color: var(--on-ink);
		background: var(--ink);
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: inherit;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--on-ink);
		border: 1.5px solid var(--rule);
		min-height: 44px;
		padding: 0 0.85rem;
		background: var(--ink);
		cursor: pointer;
	}

	/* ---------- Error banner ---------- */

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-top: 0;
		padding: 0 0.85rem;
		background: var(--surface);
		border-bottom: 2px solid var(--rule);
	}

	.error-mark {
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		flex: none;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--on-ink);
		background: var(--accent);
	}

	.error-banner p {
		margin: 0;
		flex: 1;
		font-size: 0.74rem;
		letter-spacing: 0.02em;
		color: var(--ink);
	}

	.error-banner strong {
		color: var(--accent);
	}

	.error-actions {
		display: flex;
		align-items: center;
		gap: 0;
	}

	.error-retry {
		font: inherit;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--on-ink);
		background: var(--accent);
		border: 1.5px solid var(--rule);
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.85rem;
		cursor: pointer;
	}

	/* ---------- Board + columns ---------- */

	.board-body {
		display: flex;
		flex-direction: column;
		padding: 0.5rem 0 0;
	}

	.column {
		display: flex;
		flex-direction: column;
		border-bottom: 2px solid var(--rule);
	}

	.column:last-child {
		border-bottom: 0;
	}

	.column.is-active {
		background: transparent;
	}

	.col-head {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.5rem 0.7rem;
		background: var(--surface);
		border-bottom: 2px solid var(--rule);
	}

	.column.is-active .col-head {
		border-bottom-color: var(--accent);
	}

	.coord {
		font-size: 0.66rem;
		font-weight: 700;
		color: var(--ink-soft);
	}

	.col-name {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.active-tag {
		margin-left: -0.1rem;
		padding: 0.05rem 0.3rem;
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--on-ink);
		background: var(--accent);
	}

	.count {
		margin-left: auto;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--accent);
	}

	.icon-btn {
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		flex: none;
		font: inherit;
		border: 0;
		background: transparent;
		color: var(--ink-soft);
		cursor: pointer;
	}

	.icon-btn:hover {
		color: var(--ink);
	}

	.card-list {
		list-style: none;
		margin: 0;
		padding: 0.55rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* ---------- Cards ---------- */

	.card {
		padding: 0.5rem 0.6rem;
		background: var(--surface);
		border: 1.5px solid var(--rule);
	}

	.card.is-selected {
		border-color: var(--accent);
		border-width: 2px;
		outline: 3px solid var(--accent);
		outline-offset: 1px;
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
	}

	.cid {
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink-soft);
	}

	.tick {
		color: var(--accent);
		margin-right: 0.2rem;
	}

	.grip {
		flex: none;
		color: var(--ink-soft);
		opacity: 0.55;
	}

	.card:hover .grip {
		opacity: 1;
	}

	.card-title {
		margin: 0.3rem 0 0;
		font-size: 0.82rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--ink);
	}

	.card.is-done .card-title {
		text-decoration: line-through;
	}

	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.4rem 0 0;
		padding: 0;
		list-style: none;
	}

	.tag {
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.1rem 0.35rem;
		color: var(--ink);
		background: var(--paper);
		border: 1px solid var(--rule);
	}

	.checklist {
		margin: 0.4rem 0 0;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink-soft);
	}

	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
		margin-top: 0.45rem;
		padding-top: 0.4rem;
		border-top: 1px solid var(--rule);
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
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.05em;
	}

	.priority .mk {
		font-size: 0.7rem;
		line-height: 1;
	}

	.priority.pri-high {
		color: var(--accent);
	}

	.priority.pri-medium {
		color: var(--ink-soft);
	}

	.due {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		color: var(--ink-soft);
	}

	.due.is-done {
		color: var(--accent);
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
		font: inherit;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-soft);
		border: 1.5px dashed var(--rule);
		background: transparent;
		min-height: 44px;
		padding: 0.5rem;
		cursor: pointer;
	}

	.add-card:hover {
		color: var(--ink);
	}

	/* ---------- States: empty + loading skeleton ---------- */

	.empty-col {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.9rem 0.5rem;
		border: 1.5px dashed var(--rule);
		background: var(--paper);
	}

	.empty-col p {
		margin: 0;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 0.5rem 0.6rem;
		background: var(--surface);
		border: 1.5px solid var(--rule);
	}

	.skel {
		background: var(--grid);
	}

	.skel-title {
		height: 10px;
		width: 70%;
	}

	.skel-row {
		display: flex;
		gap: 0.25rem;
	}

	.skel-tag {
		height: 10px;
		width: 40px;
	}

	.skel-foot {
		height: 8px;
		width: 35%;
	}

	@keyframes skel-blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.skel {
			animation: skel-blink 1.4s ease-in-out infinite;
		}
	}

	/* ---------- Focus + motion ---------- */

	.board-root :where(button):focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	.search:focus-within {
		outline: 3px solid var(--accent);
		outline-offset: 1px;
	}

	/* Hover feedback is an instant state change, not motion: it applies even
	   under prefers-reduced-motion so those users retain the affordance. Only
	   the transitions below are motion-gated. */
	.card:hover {
		border-color: var(--accent);
	}

	@media (prefers-reduced-motion: no-preference) {
		.card,
		.chip,
		.view-toggle button,
		.primary,
		.add-card,
		.icon-btn {
			transition:
				border-color 0.12s ease,
				background-color 0.12s ease,
				color 0.12s ease,
				opacity 0.12s ease;
		}
	}

	/* ---------- Responsive ---------- */

	@media (min-width: 48rem) {
		.board-body {
			flex-direction: row;
			overflow-x: auto;
			/* Internal padding keeps offset focus rings of column controls from
			   clipping at the scroll extremes (overflow-x:auto forces the block
			   axis to auto as well). */
			padding: 4px;
		}

		.column {
			flex: 1 0 15rem;
			border-bottom: 0;
			border-right: 2px solid var(--rule);
		}

		.column:last-child {
			border-right: 0;
		}

		.card-list {
			padding: 0.6rem;
		}
	}

	.board-body {
		scrollbar-width: thin;
		scrollbar-color: var(--ink-soft) transparent;
	}
</style>
