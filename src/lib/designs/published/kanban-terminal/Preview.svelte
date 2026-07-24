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

	// Bottom F-key + status strip — inert-specimen policy: a visual reference
	// only (display only, no shortcuts). The glyphs document the specimen
	// actions, they are NOT active bindings. Status mirrors the sync error.
	const fkeys = [
		{ key: 'F1', action: 'Help' },
		{ key: 'F5', action: 'Retry sync' },
		{ key: 'F7', action: 'New task' },
		{ key: '/', action: 'Search' },
		{ key: 'B/L', action: 'Board / List' }
	];
</script>

<div class="board-root">
	<!-- ncurses reverse-video title/status bar: title left, bracketed search right -->
	<header class="tui-titlebar">
		<h1 class="tui-title">Aurora - Sprint 24 - Board</h1>
		<label class="tui-search">
			<span class="brk" aria-hidden="true">[</span>
			<span class="search-label">SEARCH</span>
			<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
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
			<span class="brk" aria-hidden="true">]</span>
		</label>
	</header>

	<!-- Thin control strip: filters / view / New task / team as bracketed TUI cells -->
	<div class="tui-controls">
		<div class="tui-group" role="group" aria-label="Filter cards">
			{#each filters as f (f.id)}
				<button
					type="button"
					class="tui-toggle"
					aria-pressed={activeFilter === f.id}
					onclick={() => (activeFilter = f.id)}
				>
					<span class="brk" aria-hidden="true">[</span>
					{f.label}
					<span class="brk" aria-hidden="true">]</span>
				</button>
			{/each}
		</div>
		<div class="tui-group" role="group" aria-label="Board view">
			<button
				type="button"
				class="tui-toggle"
				aria-pressed={activeView === 'board'}
				onclick={() => (activeView = 'board')}
			>
				<span class="brk" aria-hidden="true">[</span> Board
				<span class="brk" aria-hidden="true">]</span>
			</button>
			<button
				type="button"
				class="tui-toggle"
				aria-pressed={activeView === 'list'}
				onclick={() => (activeView = 'list')}
			>
				<span class="brk" aria-hidden="true">[</span> List
				<span class="brk" aria-hidden="true">]</span>
			</button>
		</div>
		<button type="button" class="tui-new">
			<span class="brk" aria-hidden="true">[ +</span> New task
			<span class="brk" aria-hidden="true">]</span>
		</button>
		<span class="tui-team" aria-label="Team members">
			{#each members as m (m.id)}
				<span class="tui-avatar" aria-label={m.name} title={m.name}>[{m.initials}]</span>
			{/each}
		</span>
	</div>

	<main class="board-shell">
		<!-- Inline error: reverse-video/bracketed banner with [!] + Retry + dismiss -->
		<div class="error-banner" role="status" aria-live="polite">
			<span class="error-mark" aria-hidden="true">[!]</span>
			<p>
				<strong>Sync paused.</strong> Couldn't reach the server. Recent changes may not be saved.
			</p>
			<div class="error-actions">
				<button type="button" class="tui-retry">
					<span class="brk" aria-hidden="true">[</span> Retry
					<span class="brk" aria-hidden="true">/ F5 ]</span>
				</button>
				<button type="button" class="tui-dismiss" aria-label="Dismiss error"> [x] </button>
			</div>
		</div>

		<section class="board-body" aria-label="Kanban board">
			{#each columns as col (col.id)}
				<section
					class="col{col.id === activeColumnId ? ' is-active' : ''}"
					aria-label={col.id === activeColumnId ? `${col.name}, active column` : col.name}
				>
					<header class="col-head">
						<span class="brk" aria-hidden="true">+-</span>
						<h2 class="col-name">{col.name}</h2>
						<span
							class="count"
							aria-label={`${col.cards.length} ${col.cards.length === 1 ? 'card' : 'cards'}`}
							>[{col.cards.length}]</span
						>
						<span class="brk" aria-hidden="true">-+</span>
					</header>

					<div class="col-body">
						{#each col.cards as card (card.id)}
							<article
								class="tui-row{card.done ? ' is-done' : ''}{card.id === selectedCardId
									? ' is-selected'
									: ''}"
								aria-label={card.id === selectedCardId ? `${card.title}, selected` : undefined}
								aria-labelledby={card.id === selectedCardId ? undefined : `title-${card.id}`}
							>
								<div class="row-main">
									<span class="cid">{card.id}</span>
									<span class="grip" aria-hidden="true" title="Drag to move">[..]</span>
									<h3 class="title" id="title-{card.id}">
										{#if card.done}<span class="done-x" aria-hidden="true">[x]</span>{/if}
										{card.title}
									</h3>
									{#each card.labels as l (`${card.id}-${l.name}`)}
										<span class="field">[{l.name}]</span>
									{/each}
									{#if card.priority}
										<span class="pri pri-{card.priority}">
											{card.priority === 'high' ? '[!HIGH]' : '[MED]'}
										</span>
									{/if}
								</div>
								<div class="row-meta">
									{#if card.checklist}
										<span class="chk">[{card.checklist.done}/{card.checklist.total}]</span>
									{/if}
									<span class="due">{card.done ? '' : 'Due:'} {card.due}</span>
									{#each card.assignees as id (id)}
										{@const m = byId.get(id)}
										{#if m}
											<span class="assignee" aria-label={m.name} title={m.name}>[{m.initials}]</span
											>
										{/if}
									{/each}
								</div>
							</article>
						{/each}

						{#if col.id === 'backlog'}
							<!-- Loading: TUI block-element rows -->
							<div class="skel-row" aria-hidden="true">
								<div class="skel skel-bar"></div>
								<div class="skel skel-bar short"></div>
							</div>
							<div class="skel-row" aria-hidden="true">
								<div class="skel skel-bar"></div>
							</div>
						{/if}

						{#if col.cards.length === 0}
							<div class="empty">
								<span class="brk" aria-hidden="true">+--</span> no items
								<span class="brk" aria-hidden="true">--+</span>
							</div>
						{/if}
					</div>
				</section>
			{/each}
		</section>
	</main>

	<!-- Bottom F-key + status strip (mb-fkeys) -->
	<footer
		class="tui-fkeys"
		aria-label="Inactive key-map reference and board status (display only, no active shortcuts)"
	>
		<span class="leg-note">KEY MAP — reference, display only</span>
		<span class="fkey-group">
			{#each fkeys as k (k.key)}
				<span class="fkey-item"
					><span class="fkey">{k.key}</span><span class="fkey-act">{k.action}</span></span
				>
			{/each}
		</span>
		<span class="fkey-status"
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
		 * ncurses / TUI tokens (faithful to the concept's c-ncurses palette,
		 * scaled, tinted, no pure black/white). Structural identity:
		 * reverse-video title bar, bordered dialog-window columns with
		 * "+- NAME [n] -+" headers, flat border-bottom TUI rows, bracketed
		 * fields/priority, an F-key/status footer. Flat — zero shadows,
		 * no gradients, no backdrop blur, no graph paper, no side-stripes.
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
		padding: clamp(0.6rem, 2vw, 1rem);
		line-height: 1.4;
	}

	/* ---------- Reverse-video title bar (mb-head) ---------- */

	.tui-titlebar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding: 0 0.6rem;
		min-height: 44px;
		background: var(--bar);
		color: var(--on-bar);
		border: 1px solid var(--rule);
	}

	.tui-title {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.86rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--on-bar);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-search {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		min-height: 44px;
		padding: 0 0.4rem;
		color: var(--on-bar);
		background: transparent;
		border: 1px solid var(--rule);
	}

	.tui-search .brk {
		color: var(--on-bar-soft);
	}

	.tui-search .search-label {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--on-bar-soft);
	}

	.tui-search svg {
		color: var(--on-bar-soft);
		flex: none;
	}

	.tui-search input {
		width: 7.5rem;
		max-width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--on-bar);
		font: inherit;
		font-size: 0.78rem;
	}

	.tui-search input::placeholder {
		color: var(--on-bar-soft);
	}

	.tui-search input:focus-visible {
		outline: none;
	}

	/* Search sits on the bright bar: a DARK ring (yellow would be ~1:1). */
	.tui-search:focus-within {
		outline: 3px solid var(--on-bar);
		outline-offset: 1px;
	}

	/* ---------- Thin control strip (filters / view / New / team) ---------- */

	.tui-controls {
		display: flex;
		align-items: center;
		gap: 0.4rem 0.6rem;
		flex-wrap: wrap;
		padding: 0.35rem 0.6rem;
		margin-top: 3px;
		background: var(--window);
		border: 1px solid var(--rule);
	}

	.tui-group {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		flex-wrap: wrap;
	}

	.tui-toggle,
	.tui-new,
	.tui-retry,
	.tui-dismiss {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--ink);
		background: transparent;
		border: 1px solid var(--rule);
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.6rem;
		cursor: pointer;
	}

	/* pressed = reverse video (silver fill + dark text) */
	.tui-toggle[aria-pressed='true'] {
		color: var(--on-bar);
		background: var(--bar);
		border-color: var(--rule);
	}

	.tui-new {
		color: var(--ink);
		border-color: var(--accent);
	}

	.tui-team {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		flex-wrap: wrap;
		margin-left: auto;
	}

	.tui-avatar {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		color: var(--ink);
		background: var(--head);
		border: 1px solid var(--rule);
		padding: 0.12rem 0.18rem;
		white-space: nowrap;
	}

	/* ---------- Inline error banner ---------- */

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 6px;
		padding: 0.4rem 0.6rem;
		background: var(--window);
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
		min-width: 12rem;
		font-size: 0.76rem;
		color: var(--ink);
	}

	.error-banner strong {
		color: var(--red);
	}

	.error-actions {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.tui-retry {
		color: var(--ink);
		border-color: var(--rule);
	}

	.tui-dismiss {
		min-width: 44px;
		color: var(--ink-soft);
	}

	/* ---------- Board body + dialog-window columns ---------- */

	.board-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 6px;
	}

	.col {
		display: flex;
		flex-direction: column;
		background: var(--canvas);
		border: 1px solid var(--rule);
	}

	.col.is-active {
		border-color: var(--accent);
	}

	.col-head {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.5rem;
		background: var(--head);
		color: var(--ink);
		border-bottom: 1px solid var(--rule);
	}

	.col.is-active .col-head {
		background: var(--accent);
		color: var(--on-bar);
		border-bottom-color: var(--accent);
	}

	.col-head .brk {
		font-weight: 700;
		color: inherit;
		opacity: 0.85;
	}

	.col-name {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: inherit;
	}

	.count {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		color: inherit;
	}

	.col-body {
		display: flex;
		flex-direction: column;
	}

	/* ---------- Flat TUI rows (mb-card): border-bottom hairline only ---------- */

	.tui-row {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.45rem 0.55rem;
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--rule-soft);
		cursor: auto;
	}

	.tui-row:last-child {
		border-bottom: 0;
	}

	/* selected = full-border box (TUI cursor/selection), never a side-stripe */
	.tui-row.is-selected {
		border: 1px solid var(--accent);
	}

	.row-main {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.row-meta {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		flex-wrap: wrap;
		padding-left: 0.1rem;
	}

	.cid {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		color: var(--ink-soft);
	}

	.grip {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--ink-soft);
		opacity: 0.5;
	}

	/*
	 * Hover = ncurses cursor-row highlight (the mc/htop "current row" idiom):
	 * a faint accent (yellow) wash on the row, plus the drag token lifting to
	 * full opacity. Gated to (hover: hover) so a touch tap cannot leave a
	 * sticky state resembling selection; excluded from .is-selected so the
	 * stronger full-border selection treatment wins. Flat — no shadow, no
	 * transform, no gradient. The wash lands instantly; only the short colour
	 * transition is motion-gated (reduced motion keeps the instant wash).
	 */
	@media (hover: hover) {
		.tui-row:not(.is-selected):hover {
			background: color-mix(in oklch, var(--accent) 14%, transparent);
		}

		.tui-row:hover .grip {
			opacity: 1;
		}
	}

	@media (hover: hover) and (prefers-reduced-motion: no-preference) {
		.tui-row {
			transition: background-color 0.12s ease;
		}
	}

	.title {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ink);
	}

	.tui-row.is-done .title {
		text-decoration: line-through;
		color: var(--green);
	}

	.done-x {
		color: var(--green);
		font-weight: 700;
		margin-right: 0.1rem;
	}

	.field {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 600;
		color: var(--ink-soft);
		border: 1px solid var(--rule);
		padding: 0 0.3rem;
		white-space: nowrap;
	}

	.pri {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.pri-high {
		color: var(--red);
	}

	.pri-medium {
		color: var(--accent);
	}

	.chk {
		font-family: var(--font-mono);
		font-size: 0.64rem;
		font-weight: 700;
		color: var(--accent);
	}

	.due {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--ink-soft);
	}

	.assignee {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
		color: var(--ink);
		background: var(--head);
		border: 1px solid var(--rule);
		padding: 0.04rem 0.18rem;
		white-space: nowrap;
	}

	/* ---------- Empty + loading states ---------- */

	.empty {
		padding: 0.6rem 0.55rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--ink-soft);
		border: 1px dashed var(--rule-soft);
		margin: 0.4rem;
		text-align: center;
	}

	.empty .brk {
		color: var(--rule);
	}

	.skel-row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 0.45rem 0.55rem;
		border-bottom: 1px solid var(--rule-soft);
	}

	.skel {
		background: var(--ink-soft);
		opacity: 0.22;
	}

	.skel-bar {
		height: 9px;
		width: 80%;
	}

	.skel-bar.short {
		width: 45%;
	}

	@keyframes skel-pulse {
		0%,
		100% {
			opacity: 0.22;
		}
		50% {
			opacity: 0.08;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.skel {
			animation: skel-pulse 1.4s ease-in-out infinite;
		}
	}

	/* ---------- Bottom F-key + status strip (mb-fkeys) ---------- */

	.tui-fkeys {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 6px;
		padding: 0.4rem 0.6rem;
		background: var(--window);
		border-top: 1px solid var(--rule);
		border: 1px solid var(--rule);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--ink-soft);
	}

	.leg-note {
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.fkey-group {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.fkey-item {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
	}

	.fkey {
		font-weight: 700;
		color: var(--accent);
	}

	.fkey-status {
		margin-left: auto;
		color: var(--ink-soft);
	}

	.leg-state {
		color: var(--red);
		font-weight: 700;
	}

	/* ---------- Focus + motion ---------- */

	.board-root :where(button):focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	/* Controls on the bright reverse-video title bar (search) get a DARK ring. */
	.tui-titlebar .tui-search:focus-within {
		outline-color: var(--on-bar);
	}

	@media (hover: hover) {
		.tui-toggle:hover,
		.tui-new:hover,
		.tui-retry:hover,
		.tui-dismiss:hover {
			border-color: var(--accent);
			color: var(--accent);
		}

		.tui-toggle[aria-pressed='true']:hover {
			color: var(--on-bar);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.tui-toggle,
		.tui-new,
		.tui-retry,
		.tui-dismiss {
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
			padding: 6px;
		}

		.col {
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
