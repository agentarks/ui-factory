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
</script>

<div class="board-root">
	<header class="app-bar">
		<div class="bar-row bar-left">
			<span class="project-chip">Aurora</span>
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
			<svg class="error-mark" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
				<path
					d="M8 1.6l6.4 11.4H1.6L8 1.6z"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linejoin="round"
				/>
				<path
					d="M8 6v3.4"
					fill="none"
					stroke="currentColor"
					stroke-width="1.7"
					stroke-linecap="round"
				/>
				<circle cx="8" cy="11.6" r="0.9" fill="currentColor" />
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
						<span class="column-dot" aria-hidden="true"></span>
						<h2>{col.name}</h2>
						{#if col.id === activeColumnId}
							<span class="active-tag" aria-hidden="true">ACTIVE</span>
						{/if}
						<span
							class="count"
							aria-label={`${col.cards.length} ${col.cards.length === 1 ? 'card' : 'cards'}`}
						>
							{col.cards.length}
						</span>
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
								<article
									class="card{card.done ? ' is-done' : ''}{card.id === selectedCardId
										? ' is-selected'
										: ''}"
									aria-label={card.id === selectedCardId ? `${card.title}, selected` : undefined}
									aria-labelledby={card.id === selectedCardId ? undefined : `title-${card.id}`}
								>
									<div class="card-top">
										<span class="cid">{card.id.toUpperCase()}</span>
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
												<li class="label">{l.name}</li>
											{/each}
										</ul>
									{/if}

									{#if card.checklist}
										<p class="checklist">
											<span class="mono">{card.checklist.done}/{card.checklist.total}</span>
											subtasks
										</p>
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
															stroke-width="1.9"
															stroke-linecap="round"
															stroke-linejoin="round"
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
								<span class="empty-mark" aria-hidden="true"></span>
								<p>No cards yet</p>
							</li>
						{/if}

						<li>
							<button type="button" class="add-card">
								<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
									<path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="1.8" />
								</svg>
								ADD A CARD
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
		 * Holodeck Wireframe — dark / neon tokens.
		 * Near-black cyan-blue canvas; transparent / near-transparent panels
		 * defined by luminous cyan wireframe edges; cool-white body/title text;
		 * cyan monospace metrics; restrained semantic glow on dots / active /
		 * selected / focus. No fills, no gradients, no backdrop blur, no
		 * multi-hue signage. Solid colour tokens are OKLCH; the canvas is the
		 * only opaque surface, so text reads against it at high AA contrast.
		 */
		--canvas: oklch(0.13 0.035 230);
		--bar-tint: rgba(64, 224, 232, 0.05);
		--head-tint: rgba(64, 224, 232, 0.04);
		--error-tint: rgba(255, 120, 120, 0.05);

		--ink: oklch(0.96 0.012 220);
		--ink-soft: oklch(0.78 0.03 225);

		--accent: oklch(0.82 0.15 198);
		--edge: oklch(0.52 0.1 198);
		--danger: oklch(0.78 0.17 22);

		/* Cyan glow channel triplet for rgba glows. */
		--cyan: 64, 224, 232;

		--r-card: 6px;
		--r-control: 6px;
		--r-pill: 999px;

		--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;

		min-height: 100vh;
		font-family: var(--font-sans);
		font-synthesis: none;
		color: var(--ink);
		background: var(--canvas);
		padding: clamp(0.75rem, 2vw, 1.1rem);
	}

	/* ---------- App bar (rgba cyan 5% + cyan inset edge) ---------- */

	.app-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 0.75rem;
		flex-wrap: wrap;
		padding: 0.6rem clamp(0.65rem, 1.5vw, 0.85rem);
		border-radius: var(--r-control);
		background: var(--bar-tint);
		/* cyan inset edge + faint outer halo */
		box-shadow:
			inset 0 0 0 1px var(--accent),
			0 0 12px rgba(var(--cyan), 0.05);
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
		border-radius: var(--r-control);
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink);
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--edge);
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
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.02em;
		color: var(--accent);
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
		color: var(--ink);
		background: transparent;
		/* outlined avatar: cyan inner edge + opaque canvas ring separating overlaps */
		box-shadow:
			inset 0 0 0 1px var(--edge),
			0 0 0 1.5px var(--canvas);
	}

	.avatar.sm {
		width: 24px;
		height: 24px;
		font-size: 0.54rem;
	}

	/* ---------- Header controls (transparent + cyan edge) ---------- */

	.search {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0 0.6rem;
		height: 44px;
		border-radius: var(--r-control);
		background: transparent;
		color: var(--accent);
		box-shadow: inset 0 0 0 1px var(--edge);
	}

	.search-label {
		flex: none;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--accent);
	}

	.search input {
		width: 8rem;
		max-width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 0.8rem;
	}

	.search input::placeholder {
		color: var(--ink-soft);
	}

	.search input:focus-visible {
		outline: none;
	}

	.search:focus-within {
		outline: 3px solid var(--accent);
		outline-offset: 1px;
	}

	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 3px;
		border-radius: var(--r-control);
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--edge);
	}

	.chip,
	.view-toggle button {
		display: inline-flex;
		align-items: center;
		font: inherit;
		font-size: 0.76rem;
		font-weight: 600;
		color: var(--ink);
		border: 0;
		background: transparent;
		padding: 0 0.8rem;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		border-radius: 5px;
		cursor: pointer;
		box-shadow: inset 0 0 0 1px var(--edge);
	}

	/* Selection / active = bright cyan edge + modest glow on a transparent face. */
	.chip[aria-pressed='true'],
	.view-toggle button[aria-pressed='true'] {
		color: var(--ink);
		font-weight: 700;
		box-shadow:
			inset 0 0 0 1px var(--accent),
			0 0 8px rgba(var(--cyan), 0.16);
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--ink);
		border: 0;
		min-height: 44px;
		padding: 0 0.9rem;
		border-radius: var(--r-control);
		cursor: pointer;
		background: transparent;
		/* transparent primary: bright cyan edge + modest glow */
		box-shadow:
			inset 0 0 0 1px var(--accent),
			0 0 10px rgba(var(--cyan), 0.18);
	}

	/* ---------- Error banner (transparent + pale-red FULL border) ---------- */

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: clamp(0.6rem, 1.5vw, 0.85rem);
		padding: 0.6rem 0.75rem;
		border-radius: var(--r-control);
		background: var(--error-tint);
		/* full pale-red border on all sides — never a coloured side-stripe */
		border: 1px solid var(--danger);
	}

	.error-mark {
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
		background: transparent;
		border: 0;
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.8rem;
		border-radius: var(--r-control);
		cursor: pointer;
		/* action accent (cyan), not the error hue */
		box-shadow:
			inset 0 0 0 1px var(--accent),
			0 0 8px rgba(var(--cyan), 0.14);
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

	/* ---------- Columns (transparent bodies, no filled slab) ---------- */

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
		border-radius: var(--r-control);
		background: var(--head-tint);
		box-shadow: inset 0 0 0 1px var(--edge);
		margin-bottom: 0.5rem;
	}

	.column-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--accent);
		flex: none;
		box-shadow: 0 0 5px rgba(var(--cyan), 0.12);
	}

	.column.is-active .column-head {
		background: rgba(var(--cyan), 0.06);
		box-shadow:
			inset 0 0 0 1px var(--accent),
			0 0 10px rgba(var(--cyan), 0.16);
	}

	.column.is-active .column-dot {
		box-shadow: 0 0 6px rgba(var(--cyan), 0.35);
	}

	.column-head h2 {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: var(--ink);
	}

	.active-tag {
		margin-left: -0.1rem;
		padding: 0.05rem 0.32rem;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--accent);
		border-radius: 3px;
		box-shadow: inset 0 0 0 1px var(--accent);
	}

	.count {
		margin-left: auto;
		min-width: 1.4rem;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		color: var(--accent);
		padding: 0.1rem 0.42rem;
		border-radius: var(--r-pill);
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--edge);
	}

	.icon-btn {
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		flex: none;
		font: inherit;
		border: 0;
		border-radius: 5px;
		background: transparent;
		color: var(--ink-soft);
		cursor: pointer;
		box-shadow: inset 0 0 0 1px var(--edge);
	}

	@media (hover: hover) {
		.icon-btn:hover {
			color: var(--accent);
		}
	}

	.card-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* ---------- Cards (transparent + cyan wireframe edge + restrained glow) ---------- */

	.card {
		padding: 0.6rem 0.65rem;
		border-radius: var(--r-card);
		background: transparent;
		border: 1px solid var(--edge);
		box-shadow: 0 0 6px rgba(var(--cyan), 0.06);
		cursor: auto;
	}

	.card.is-selected {
		border-color: var(--accent);
		box-shadow: 0 0 14px rgba(var(--cyan), 0.22);
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
		color: var(--accent);
	}

	.grip {
		flex: none;
		color: var(--accent);
		opacity: 0.4;
	}

	@media (hover: hover) {
		.card:hover .grip {
			opacity: 1;
		}
	}

	.card-title {
		margin: 0.3rem 0 0;
		font-size: 0.82rem;
		font-weight: 650;
		line-height: 1.3;
		color: var(--ink);
	}

	.card.is-done .card-title {
		text-decoration: line-through;
		color: var(--ink-soft);
	}

	/* Outlined labels — single hue (cyan edge + cool-white text), no multi-hue. */
	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.4rem 0 0;
		padding: 0;
		list-style: none;
	}

	.label {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--ink);
		background: transparent;
		padding: 0.12rem 0.42rem;
		border-radius: 4px;
		box-shadow: inset 0 0 0 1px var(--edge);
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
		box-shadow: 0 -1px 0 0 rgba(var(--cyan), 0.12);
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

	.priority .mk {
		font-size: 0.68rem;
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
		font-size: 0.7rem;
		font-weight: 600;
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
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--accent);
		border: 0;
		background: transparent;
		min-height: 44px;
		padding: 0.5rem;
		border-radius: var(--r-card);
		cursor: pointer;
		box-shadow: inset 0 0 0 1px var(--edge);
	}

	@media (hover: hover) {
		.add-card:hover {
			box-shadow: inset 0 0 0 1px var(--accent);
		}
	}

	/* ---------- States: empty + loading skeleton ---------- */

	.empty-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		padding: 0.9rem 0.5rem;
		border-radius: var(--r-card);
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--edge);
	}

	.empty-col p {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--ink-soft);
	}

	.empty-mark {
		width: 14px;
		height: 14px;
		border-radius: 3px;
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--accent);
	}

	.skeleton-card {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 0.6rem 0.65rem;
		border-radius: var(--r-card);
		background: transparent;
		border: 1px solid var(--edge);
	}

	.skel {
		border-radius: 4px;
		background: rgba(var(--cyan), 0.16);
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
		border-radius: 999px;
	}

	.skel-foot {
		height: 9px;
		width: 36%;
	}

	@keyframes skel-pulse {
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
			animation: skel-pulse 1.4s ease-in-out infinite;
		}
	}

	/* ---------- Monospace metrics ---------- */

	.mono {
		font-family: var(--font-mono);
		font-weight: 600;
	}

	/* ---------- Focus + motion ---------- */

	.board-root :where(button):focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	/*
	 * Hover (non-selected cards only) is a multi-channel cue in the single
	 * cyan hue: a faint cyan wash + a bright cyan edge, with a small lift
	 * added only when motion is allowed. Gated behind (hover: hover) so a tap
	 * on a touch device (hover: none) cannot leave a sticky state resembling
	 * selection. No fill-at-rest, no gradient, no second hue; cards stay
	 * non-interactive (cursor: auto — no pointer/grab).
	 */
	@media (hover: hover) {
		.card:not(.is-selected):hover {
			border-color: var(--accent);
			background-color: rgba(var(--cyan), 0.06);
			box-shadow: 0 0 10px rgba(var(--cyan), 0.14);
		}

		@media (prefers-reduced-motion: no-preference) {
			.card:not(.is-selected):hover {
				transform: translateY(-2px);
			}
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
				box-shadow 0.15s ease-out,
				border-color 0.15s ease-out,
				background-color 0.15s ease-out,
				color 0.15s ease-out,
				transform 0.15s ease-out;
		}
	}

	/* ---------- Responsive ---------- */

	@media (min-width: 48rem) {
		.board-body {
			flex-direction: row;
			overflow-x: auto;
			/* Internal padding keeps offset focus rings of column controls from
			   clipping at the scroll extremes. */
			padding: 4px;
		}

		.column {
			flex: 1 0 15rem;
			/* faint cyan wireframe separator between columns (a full rule, not a
			   coloured side-stripe on cards) */
			border-right: 1px solid rgba(var(--cyan), 0.14);
			padding-right: 4px;
		}

		.column:last-child {
			border-right: 0;
		}
	}

	.board-body {
		scrollbar-width: thin;
		scrollbar-color: var(--edge) transparent;
	}

	.board-body::-webkit-scrollbar {
		height: 8px;
	}

	.board-body::-webkit-scrollbar-thumb {
		background: var(--edge);
		border-radius: 999px;
	}
</style>
