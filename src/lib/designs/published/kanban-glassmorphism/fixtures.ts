// Realistic board content for a small product team shipping "Aurora".
// Owned by this entry per the design contract; each catalog entry keeps its own copy.

export type LabelTone =
	| 'violet'
	| 'teal'
	| 'blue'
	| 'slate'
	| 'indigo'
	| 'green'
	| 'pink'
	| 'amber'
	| 'rose'
	| 'red'
	| 'cyan';

export type Label = { name: string; tone: LabelTone };

export type Member = {
	id: string;
	name: string;
	initials: string;
	/** oklch lightness/chroma/hue for the avatar fill; kept dark enough for white initials at AA. */
	hue: number;
};

export type Priority = 'medium' | 'high';

export type Card = {
	id: string;
	title: string;
	labels: Label[];
	assignees: string[];
	due?: string;
	checklist?: { done: number; total: number };
	priority?: Priority;
	done?: boolean;
};

export type Column = {
	id: string;
	name: string;
	accent: LabelTone;
	cards: Card[];
};

export const members: Member[] = [
	{ id: 'mr', name: 'Maya Rivera', initials: 'MR', hue: 285 },
	{ id: 'dc', name: 'Devon Chen', initials: 'DC', hue: 205 },
	{ id: 'pn', name: 'Priya Nair', initials: 'PN', hue: 340 },
	{ id: 'so', name: 'Sam Okafor', initials: 'SO', hue: 155 },
	{ id: 'lf', name: 'Lena Foss', initials: 'LF', hue: 45 }
];

export const columns: Column[] = [
	{
		id: 'backlog',
		name: 'Backlog',
		accent: 'slate',
		cards: [
			{
				id: 'au-142',
				title: 'Dark mode for the settings panel',
				labels: [
					{ name: 'design', tone: 'violet' },
					{ name: 'a11y', tone: 'teal' }
				],
				assignees: ['mr'],
				due: 'Jul 28',
				priority: 'medium'
			},
			{
				id: 'au-158',
				title: 'Refactor auth token refresh logic',
				labels: [
					{ name: 'backend', tone: 'blue' },
					{ name: 'tech-debt', tone: 'slate' }
				],
				assignees: ['dc'],
				due: 'Jul 30',
				priority: 'high'
			},
			{
				id: 'au-160',
				title: 'Empty states for dashboard widgets',
				labels: [
					{ name: 'design', tone: 'violet' },
					{ name: 'frontend', tone: 'indigo' }
				],
				assignees: ['pn', 'so'],
				due: 'Aug 02'
			}
		]
	},
	{
		id: 'in-progress',
		name: 'In Progress',
		accent: 'blue',
		cards: [
			{
				id: 'au-137',
				title: 'Realtime presence indicators',
				labels: [
					{ name: 'frontend', tone: 'indigo' },
					{ name: 'realtime', tone: 'green' }
				],
				assignees: ['so'],
				due: 'Jul 18',
				checklist: { done: 2, total: 3 },
				priority: 'high'
			},
			{
				id: 'au-151',
				title: 'Export board to CSV',
				labels: [
					{ name: 'backend', tone: 'blue' },
					{ name: 'feature', tone: 'pink' }
				],
				assignees: ['dc', 'lf'],
				due: 'Jul 20',
				checklist: { done: 1, total: 4 },
				priority: 'medium'
			}
		]
	},
	{
		id: 'in-review',
		name: 'In Review',
		accent: 'amber',
		cards: [
			{
				id: 'au-149',
				title: 'Onboarding flow copy revisions',
				labels: [
					{ name: 'copy', tone: 'amber' },
					{ name: 'review', tone: 'rose' }
				],
				assignees: ['lf'],
				due: 'Jul 16',
				priority: 'medium'
			},
			{
				id: 'au-155',
				title: 'Rate limiter for the public API',
				labels: [
					{ name: 'backend', tone: 'blue' },
					{ name: 'security', tone: 'red' }
				],
				assignees: ['dc'],
				due: 'Jul 17',
				priority: 'high'
			}
		]
	},
	{
		id: 'done',
		name: 'Done',
		accent: 'green',
		cards: [
			{
				id: 'au-131',
				title: 'Migrate components to Svelte 5 runes',
				labels: [
					{ name: 'frontend', tone: 'indigo' },
					{ name: 'done', tone: 'green' }
				],
				assignees: ['pn'],
				due: 'Jul 10',
				done: true
			},
			{
				id: 'au-128',
				title: 'Audit color contrast to WCAG AA',
				labels: [
					{ name: 'a11y', tone: 'teal' },
					{ name: 'qa', tone: 'cyan' }
				],
				assignees: ['mr', 'so'],
				due: 'Jul 08',
				done: true
			}
		]
	}
];
