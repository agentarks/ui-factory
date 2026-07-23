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
</script>

<div class="board-root">
	<header class="board-head">
		<div class="masthead-block">
			<p class="masthead">Aurora</p>
			<div class="title-block">
				<h1>Sprint 24 · Board</h1>
				<p class="subtitle">{columns.length} columns · {cardTotal} cards · updated 2m ago</p>
			</div>
		</div>

		<div class="controls">
			<label class="search">
				<span class="face">
					<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
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
				</span>
			</label>

			<div class="segmented filters" role="group" aria-label="Filter cards">
				{#each filters as f (f.id)}
					<button
						type="button"
						class="chip"
						aria-pressed={activeFilter === f.id}
						onclick={() => (activeFilter = f.id)}><span class="face">{f.label}</span></button
					>
				{/each}
			</div>

			<div class="segmented view-toggle" role="group" aria-label="Board view">
				<button
					type="button"
					aria-pressed={activeView === 'board'}
					onclick={() => (activeView = 'board')}
				>
					<span class="face">Board</span>
				</button>
				<button
					type="button"
					aria-pressed={activeView === 'list'}
					onclick={() => (activeView = 'list')}
				>
					<span class="face">List</span>
				</button>
			</div>

			<button type="button" class="primary">
				<span class="face">
					<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
						<path
							d="M8 2v12M2 8h12"
							fill="none"
							stroke="currentColor"
							stroke-width="1.9"
							stroke-linecap="round"
						/>
					</svg>
					New task
				</span>
			</button>
		</div>
	</header>

	<main class="board-shell">
		<div class="error-banner" role="status" aria-live="polite">
			<svg class="error-icon" viewBox="0 0 16 16" width="17" height="17" aria-hidden="true">
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
				<section class="column">
					<header class="column-head">
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
											<h3 class="card-title {card.done ? 'is-done' : ''}" id="title-{card.id}">
												{card.title}
											</h3>
										</div>

										{#if card.labels.length}
											<ul class="labels">
												{#each card.labels as l (`${l.name}-${l.tone}`)}
													<li class="label">
														<span class="dot" aria-hidden="true"></span>{l.name}
													</li>
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
													<span class="pdot" aria-hidden="true"></span>
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
															stroke-width="1.9"
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
									<div class="skel skel-label"></div>
									<div class="skel skel-label"></div>
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
								<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
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
		/* Annual Report tokens — formal two-colour print palette. All OKLCH,
		   no pure black/white, no gradients, no shadows (focus is the only
		   depth cue). */
		--paper: oklch(0.985 0.003 250); /* near-white cool paper canvas */
		--paper-bright: oklch(0.995 0.002 250); /* brighter paper surfaces */
		--ink: oklch(0.26 0.03 258); /* dark navy ink */
		--ink-soft: oklch(0.4 0.025 258); /* meta: AA on paper */
		--ink-faint: oklch(0.5 0.02 258); /* decorative grip (non-text) */
		--rule: oklch(0.84 0.006 255); /* cool-gray hairline */
		--rule-soft: oklch(0.9 0.005 255); /* lighter hairline */
		--accent: oklch(0.44 0.08 200); /* restrained teal (column rules) */
		--accent-ink: oklch(0.4 0.09 200); /* darker teal for done text (AA) */
		--focus: oklch(0.38 0.1 200); /* teal focus ring (AA UI on paper) */
		--on-navy: oklch(0.985 0.003 250); /* paper text on navy fill (never #fff) */
		--danger: oklch(0.4 0.15 25); /* error label/strong (AA on pale red) */
		--danger-soft: oklch(0.95 0.025 25); /* pale red banner */
		--pri-high: oklch(0.42 0.13 25); /* high priority (AA on paper) */
		--pri-medium: oklch(0.42 0.09 65); /* medium priority (AA on paper) */

		--serif: Georgia, 'Times New Roman', Times, serif;
		--sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

		--r-square: 3px; /* near-square cards/controls */

		min-height: 100vh;
		font-family: var(--sans);
		font-synthesis: none;
		color: var(--ink);
		background: var(--paper);
	}

	/* ---------- Report masthead ---------- */

	.board-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.25rem 2rem;
		flex-wrap: wrap;
		padding: clamp(1.75rem, 4vw, 2.75rem) clamp(1.25rem, 4vw, 3rem) 1.1rem;
		background: var(--paper);
	}

	.masthead-block {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
	}

	.masthead {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.9rem, 1.4rem + 1.6vw, 2.6rem);
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 1;
		color: var(--ink);
	}

	.title-block h1 {
		margin: 0;
		font-family: var(--sans);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-soft);
		line-height: 1.3;
	}

	.subtitle {
		margin: 0.3rem 0 0;
		font-family: var(--sans);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-soft);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
		min-width: 0;
	}

	/* ---------- Outlined report controls (compact face + >=44px target) ----------
	   The visible chrome is a compact ~22px "face" element; the interactive
	   element (button/label) is a transparent >=44px semantic hit target that
	   centres the face. This keeps the dense print reference while meeting the
	   WCAG 2.2 44px target minimum. Keyboard focus renders on the face so the
	   ring hugs the visible chrome and is never clipped by an ancestor. */

	.search,
	.chip,
	.view-toggle button,
	.primary {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		padding: 0;
		margin: 0;
		border: 0;
		background: transparent;
		color: var(--ink);
		font-family: var(--sans);
		cursor: pointer;
	}

	.search {
		/* label wraps the input; clicking anywhere in the 44px target focuses it */
		cursor: text;
	}

	.face {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		height: 1.4rem; /* ~22px compact visible face */
		padding: 0 0.7rem;
		border: 1px solid var(--rule);
		border-radius: var(--r-square);
		background: var(--paper-bright);
		color: var(--ink);
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		white-space: nowrap;
	}

	/* Selected state = dark navy fill on the face (paper text). */
	.chip[aria-pressed='true'] .face,
	.view-toggle button[aria-pressed='true'] .face {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--on-navy);
		font-weight: 700;
	}

	.primary .face {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--on-navy);
		font-weight: 700;
		font-size: 0.74rem;
	}

	.search .face {
		gap: 0.45rem;
	}

	.search input {
		width: 9rem;
		max-width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 0.82rem;
		text-transform: none;
		letter-spacing: 0;
	}

	.search input::placeholder {
		color: var(--ink-soft);
	}

	/* Segmented groups are plain flex wrappers of separate faced chips — no
	   container border and NO overflow clipping, so offset focus outlines on
	   the inner faces render with a complete perimeter. */
	.segmented {
		display: inline-flex;
		gap: 0.4rem;
	}

	/* Focus renders on the compact face (complete, unclipped, >=3:1 on paper).
	   The search field uses :focus-within on its label; the <input> stays the
	   semantic focus target with its own outline suppressed. */
	.search:focus-within .face,
	.chip:focus-visible > .face,
	.view-toggle button:focus-visible > .face,
	.primary:focus-visible > .face {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}

	.search input:focus-visible {
		outline: none;
	}

	/* ---------- Board shell + dark board rule ---------- */

	.board-shell {
		border-top: 1px solid var(--ink);
		padding: clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 4vw, 3rem) clamp(1.75rem, 4vw, 2.75rem);
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 1.4rem;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--danger);
		border-radius: var(--r-square);
		background: var(--danger-soft);
	}

	.error-banner .error-icon {
		color: var(--danger);
		flex: none;
	}

	.error-banner p {
		margin: 0;
		flex: 1;
		font-size: 0.82rem;
		color: var(--ink-soft);
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
		font-family: var(--sans);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--on-navy);
		background: var(--ink);
		border: 1px solid var(--ink);
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.95rem;
		border-radius: var(--r-square);
		cursor: pointer;
	}

	.error-dismiss {
		color: var(--danger);
	}

	.board-body {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* ---------- Columns ---------- */

	.column {
		display: flex;
		flex-direction: column;
	}

	.column-head {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		padding-bottom: 0.45rem;
		border-bottom: 2px solid var(--accent);
		margin-bottom: 0.9rem;
	}

	.column-head h2 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: -0.005em;
		color: var(--ink);
	}

	.count {
		font-family: var(--sans);
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-soft);
	}

	.icon-btn {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--rule);
		border-radius: var(--r-square);
		background: var(--paper-bright);
		color: var(--ink-soft);
		cursor: pointer;
	}

	.icon-btn:hover {
		color: var(--ink);
		border-color: var(--ink-soft);
	}

	.card-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	/* ---------- Cards (bordered near-square, no elevation) ---------- */

	.card {
		padding: 0.7rem 0.85rem;
		border: 1px solid var(--rule);
		border-radius: var(--r-square);
		background: var(--paper-bright);
	}

	.card-head {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
	}

	.grip {
		flex: none;
		margin-top: 0.18rem;
		color: var(--ink-faint);
		opacity: 0.55;
		cursor: grab;
	}

	.card:hover .grip {
		opacity: 1;
	}

	.card-title {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.98rem;
		font-weight: 700;
		line-height: 1.32;
		color: var(--ink);
	}

	.card-title.is-done {
		text-decoration: line-through;
		color: var(--ink-soft);
	}

	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.55rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.label {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
		font-family: var(--sans);
		font-size: 0.66rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ink-soft);
	}

	.label .dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ink-soft);
		flex: none;
	}

	.checklist {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0.5rem 0 0;
		font-family: var(--sans);
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
		border-top: 1px solid var(--rule-soft);
	}

	.foot-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
	}

	.priority {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--sans);
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.priority .pdot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex: none;
	}

	.priority.pri-high {
		color: var(--pri-high);
	}

	.priority.pri-high .pdot {
		background: var(--pri-high);
	}

	.priority.pri-medium {
		color: var(--pri-medium);
	}

	.priority.pri-medium .pdot {
		background: var(--pri-medium);
	}

	.due {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--sans);
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.due.is-done {
		color: var(--accent-ink);
	}

	.assignees {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.assignees li {
		margin-left: -7px;
	}

	.avatar {
		width: 34px;
		height: 34px;
		display: grid;
		place-items: center;
		border: 2px solid var(--paper);
		border-radius: 50%;
		font-family: var(--sans);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--on-navy);
		background: oklch(0.4 0.06 258);
	}

	.avatar.sm {
		width: 27px;
		height: 27px;
		font-size: 0.6rem;
		border-color: var(--paper-bright);
	}

	.add-card {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		width: 100%;
		font-family: var(--sans);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ink-soft);
		border: 1px dashed var(--rule);
		background: transparent;
		min-height: 44px;
		padding: 0.55rem;
		border-radius: var(--r-square);
		cursor: pointer;
	}

	.add-card:hover {
		color: var(--ink);
		border-color: var(--ink-soft);
	}

	.empty-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.3rem 0.5rem;
		border: 1px dashed var(--rule);
		border-radius: var(--r-square);
		background: transparent;
		color: var(--ink-soft);
		text-align: center;
	}

	.empty-col p {
		margin: 0;
		font-family: var(--sans);
		font-size: 0.72rem;
		font-style: italic;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* ---------- States: loading skeleton (opacity pulse, gradient-free) ---------- */

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		padding: 0.7rem 0.85rem;
		border: 1px solid var(--rule);
		border-radius: var(--r-square);
		background: var(--paper-bright);
	}

	.skel {
		border-radius: 2px;
		background: oklch(0.9 0.006 255);
	}

	.skel-title {
		height: 12px;
		width: 72%;
	}

	.skel-row {
		display: flex;
		gap: 0.3rem;
	}

	.skel-label {
		height: 12px;
		width: 46px;
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
			opacity: 0.4;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.skel {
			animation: pulse 1.6s ease-in-out infinite;
		}
	}

	/* ---------- Focus + motion ---------- */

	.board-root :where(button, input):focus-visible {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}

	/* Faced controls show the focus perimeter on their compact face, not the
	   44px target, so the ring hugs the visible chrome and is never clipped.
	   The search input's own outline is suppressed (its label's :focus-within
	   lights the face instead). */
	.chip:focus-visible,
	.view-toggle button:focus-visible,
	.primary:focus-visible,
	.search input:focus-visible {
		outline: none;
	}

	@media (prefers-reduced-motion: no-preference) {
		.card,
		.face,
		.add-card,
		.icon-btn,
		.error-retry {
			transition:
				border-color 0.16s ease,
				background 0.16s ease,
				color 0.16s ease;
		}

		.card:hover {
			border-color: var(--ink-soft);
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
			flex: 0 0 18rem;
		}
	}

	.board-body {
		scrollbar-width: thin;
		scrollbar-color: var(--rule) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 10px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: var(--rule);
		border-radius: 999px;
	}
</style>
