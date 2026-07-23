<script lang="ts">
	import { columns, members } from './fixtures';

	const byId = new Map(members.map((m) => [m.id, m]));

	// The diagonal axis marks structure: the active column (In Progress), the
	// selected card, high priority, and the brand. Identifiers are fixed so the
	// specimen demonstrates these states deterministically, matching the locked
	// concept. The shared fixtures carry no "active"/"selected" field.
	const activeColumnId = 'in-progress';
	const selectedId = 'au-137';

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
		<div class="identity">
			<span class="project-chip">
				<span class="diamond brand-diamond" aria-hidden="true"></span>
				Aurora
			</span>
			<span class="axis-slash" aria-hidden="true"></span>
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
				<section
					class="column {col.id === activeColumnId ? 'is-active' : ''}"
					aria-label={col.name}
				>
					<header class="column-head">
						{#if col.id === activeColumnId}
							<span class="diamond col-axis" aria-hidden="true"></span>
						{:else}
							<span class="col-marker" aria-hidden="true"></span>
						{/if}
						<h2>{col.name}</h2>
						<span
							class="count"
							aria-label="{col.cards.length} {col.cards.length === 1 ? 'card' : 'cards'}"
							>{String(col.cards.length).padStart(2, '0')}</span
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
								<article
									class="card {card.done ? 'is-done-card' : ''} {card.id === selectedId
										? 'is-selected'
										: ''}"
									aria-labelledby="title-{card.id}"
								>
									{#if card.id === selectedId}
										<span class="diamond sel-diamond" aria-hidden="true"></span>
									{/if}
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
													{#if card.priority === 'high'}
														<span class="diamond pri-diamond" aria-hidden="true"></span>
													{:else}
														<span class="pdot" aria-hidden="true"></span>
													{/if}
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
															rx="1.4"
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
								<span class="diamond empty-diamond" aria-hidden="true"></span>
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
		/* Diagonal Axis tokens — Swiss / Minimal. All OKLCH, warm-neutral tinted,
		   no pure black/white. One red accent reserved for the diagonal motif:
		   the axis slash, and the diamonds that mark brand / active column /
		   high priority / selection. No gradients, no shadows, no backdrop blur.
		   Focus (outline) is the only depth cue. */
		--canvas: oklch(0.97 0.004 90); /* warm near-white canvas */
		--paper: oklch(0.99 0.003 90); /* brighter warm paper cards */
		--ink: oklch(0.22 0.008 90); /* near-black warm ink */
		--ink-soft: oklch(0.42 0.006 90); /* meta: AA on paper */
		--ink-faint: oklch(0.58 0.005 90); /* decorative grip (non-text) */
		--rule: oklch(0.86 0.005 90); /* hairline border */
		--rule-soft: oklch(0.92 0.004 90); /* lighter hairline */
		--rule-strong: oklch(0.5 0.008 90); /* control border */
		--accent: oklch(0.54 0.2 27); /* Swiss red — diagonal graphical motif */
		--accent-ink: oklch(0.42 0.16 27); /* darker red — priority text + focus (AA) */
		--on-ink: oklch(0.99 0.003 90); /* paper text on ink fills (never #fff) */
		--danger: oklch(0.42 0.16 27); /* error strong (AA on pale red) */
		--danger-soft: oklch(0.95 0.03 27); /* pale red banner */
		--focus: oklch(0.42 0.16 27); /* red focus ring (AA UI on paper) */

		--sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

		--r-square: 1px; /* near-square cards/controls (signature radius) */

		min-height: 100vh;
		font-family: var(--sans);
		font-synthesis: none;
		color: var(--ink);
		background: var(--canvas);
	}

	/* ---------- Diagonal motif primitives ---------- */
	/* A 45-degree rotated square: the disciplined diagonal that marks structure.
	   Used on brand, active column, high priority, selection, and the empty
	   state. Never decoration on top of cards — always tied to meaning. */
	.diamond {
		flex: none;
		display: inline-block;
		width: 9px;
		height: 9px;
		background: var(--accent);
		transform: rotate(45deg);
	}

	/* The axis slash: a single thin red diagonal line in the header that
	   establishes the 45-degree axis the diamonds echo. Sits in header
	   whitespace, never under text. */
	.axis-slash {
		flex: none;
		width: 2px;
		height: 1.7rem;
		background: var(--accent);
		transform: rotate(45deg);
		transform-origin: center;
	}

	/* ---------- Board header ---------- */

	.board-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem 1.5rem;
		flex-wrap: wrap;
		padding: clamp(1.4rem, 3vw, 2.1rem) clamp(1.1rem, 3vw, 2rem) 1rem;
		border-bottom: 1px solid var(--rule-strong);
		background: var(--canvas);
	}

	.identity {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		min-width: 0;
	}

	.project-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.32rem 0.6rem;
		border: 1px solid var(--ink);
		background: var(--canvas);
		color: var(--ink);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		line-height: 1;
		white-space: nowrap;
	}

	.title-block h1 {
		margin: 0;
		font-size: 1.18rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1.1;
		color: var(--ink);
	}

	.subtitle {
		margin: 0.2rem 0 0;
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
		min-width: 0;
	}

	/* ---------- Compact-faced controls (face + >=44px target) ----------
	   The visible chrome of search / filter chips / Board-List / primary is a
	   compact ~22px "face"; the interactive element is a transparent >=44px
	   semantic hit target that centres the face. This preserves the austere
	   Swiss control scale while meeting the WCAG 2.2 44px target minimum. */

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
		cursor: text;
	}

	.face {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		height: 1.4rem;
		padding: 0 0.7rem;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-square);
		background: var(--paper);
		color: var(--ink);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	/* Selected = ink fill with paper text (monochrome emphasis). */
	.chip[aria-pressed='true'] .face,
	.view-toggle button[aria-pressed='true'] .face {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--on-ink);
		font-weight: 700;
	}

	.primary .face {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--on-ink);
		font-weight: 700;
		font-size: 0.74rem;
	}

	.search .face {
		gap: 0.45rem;
		text-transform: none;
		letter-spacing: 0;
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
	   The search field uses :focus-within on its label; the input keeps the
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

	/* ---------- Board shell ---------- */

	.board-shell {
		padding: clamp(1.1rem, 2.5vw, 1.6rem) clamp(1.1rem, 3vw, 2rem) clamp(1.4rem, 3vw, 2rem);
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 1.2rem;
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
		letter-spacing: 0.04em;
		color: var(--on-ink);
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
		gap: 1.1rem;
	}

	/* ---------- Columns ---------- */

	.column {
		display: flex;
		flex-direction: column;
	}

	.column-head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-bottom: 0.45rem;
		border-bottom: 1px solid var(--rule-strong);
		margin-bottom: 0.85rem;
	}

	.column.is-active .column-head {
		border-bottom: 2px solid var(--accent);
	}

	.col-marker {
		flex: none;
		width: 9px;
		height: 9px;
		background: var(--ink);
	}

	.column-head h2 {
		margin: 0;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.count {
		font-size: 0.68rem;
		font-weight: 700;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}

	.icon-btn {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--rule);
		border-radius: var(--r-square);
		background: var(--paper);
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
		gap: 0.55rem;
	}

	/* ---------- Cards (flat near-square, no elevation) ---------- */

	.card {
		position: relative;
		padding: 0.66rem 0.78rem;
		border: 1px solid var(--rule);
		border-radius: var(--r-square);
		background: var(--paper);
	}

	.card.is-selected {
		border: 2px solid var(--accent);
		/* Selection is conveyed by the accent border + the sel-diamond mark,
		   never a coloured side-stripe (banned). */
	}

	.card-head {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
	}

	.grip {
		flex: none;
		margin-top: 0.16rem;
		color: var(--ink-faint);
		opacity: 0.5;
		cursor: grab;
	}

	.card:hover .grip {
		opacity: 1;
	}

	.card-title {
		margin: 0;
		font-size: 0.86rem;
		font-weight: 600;
		line-height: 1.32;
		letter-spacing: -0.005em;
		color: var(--ink);
	}

	.card-title.is-done {
		text-decoration: line-through;
		color: var(--ink-soft);
	}

	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.6rem;
		margin: 0.45rem 0 0;
		padding: 0;
		list-style: none;
	}

	.label {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.label .dot {
		width: 5px;
		height: 5px;
		background: var(--ink-soft);
		flex: none;
	}

	.checklist {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0.45rem 0 0;
		font-size: 0.7rem;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}

	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.55rem;
		padding-top: 0.45rem;
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
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.priority .pdot {
		width: 7px;
		height: 7px;
		background: var(--ink-soft);
		flex: none;
	}

	.priority.pri-high {
		color: var(--accent-ink);
	}

	.priority.pri-medium {
		color: var(--ink-soft);
	}

	.due {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
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
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--on-ink);
		background: var(--ink);
	}

	.avatar.sm {
		width: 27px;
		height: 27px;
		font-size: 0.6rem;
	}

	/* Selection + brand + empty diamonds sit flush in their context. */
	.sel-diamond {
		position: absolute;
		top: 8px;
		right: 8px;
	}

	.empty-diamond {
		background: var(--rule-strong);
	}

	.brand-diamond {
		width: 7px;
		height: 7px;
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
		letter-spacing: 0.04em;
		text-transform: uppercase;
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
		padding: 1.2rem 0.5rem;
		border: 1px dashed var(--rule);
		border-radius: var(--r-square);
		background: transparent;
		color: var(--ink-soft);
		text-align: center;
	}

	.empty-col p {
		margin: 0;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	/* ---------- States: loading skeleton (opacity pulse, gradient-free) ---------- */

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		padding: 0.66rem 0.78rem;
		border: 1px solid var(--rule);
		border-radius: var(--r-square);
		background: var(--paper);
	}

	.skel {
		border-radius: var(--r-square);
		background: var(--rule);
	}

	.skel-title {
		height: 11px;
		width: 76%;
	}

	.skel-row {
		display: flex;
		gap: 0.3rem;
	}

	.skel-label {
		height: 11px;
		width: 44px;
	}

	.skel-foot {
		height: 10px;
		width: 38%;
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
			flex: 0 0 17.5rem;
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
