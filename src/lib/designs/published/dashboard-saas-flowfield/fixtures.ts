// Locked SaaS product-analytics baseline for "Aurora".
// This is the FIRST SaaS dashboard, so it locks the shared SaaS content.
// Later SaaS styles copy this file verbatim and change only the visual language.
// Owned by this entry per the design contract; each catalog entry keeps its own copy.

export type Member = {
	id: string;
	name: string;
	initials: string;
	/** OKLCH hue for the avatar fill; lightness/chroma kept dark enough for AA initials. */
	hue: number;
};

export type TrendTone = 'up' | 'down';

export type Kpi = {
	id: string;
	label: string;
	value: string;
	/** Per-period delta. `good` marks whether the movement is favourable. */
	delta: string;
	tone: TrendTone;
	good: boolean;
	caption: string;
	/** 12-point sparkline series (oldest → newest). */
	spark: number[];
};

export type PlanSegment = {
	name: string;
	value: string;
	percent: number;
	/** CSS class on .dash-root for the segment stroke. */
	segClass: string;
};

export type Status = 'healthy' | 'at-risk' | 'new';

export type Account = {
	name: string;
	id: string;
	plan: string;
	mrr: string;
	status: Status;
	owner: string;
};

export const members: Member[] = [
	{ id: 'mr', name: 'Maya Rivera', initials: 'MR', hue: 250 },
	{ id: 'dc', name: 'Devon Chen', initials: 'DC', hue: 210 },
	{ id: 'pn', name: 'Priya Nair', initials: 'PN', hue: 30 },
	{ id: 'so', name: 'Sam Okafor', initials: 'SO', hue: 180 },
	{ id: 'lf', name: 'Lena Foss', initials: 'LF', hue: 300 }
];

export const byId = new Map(members.map((m) => [m.id, m]));

// Monthly trend (Aug → Jul, oldest → newest). Two locked 12-point series.
export const months = [
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul'
];

export const mrrSeries = [
	38200, 39600, 40100, 41400, 42000, 43200, 43900, 44800, 45500, 46300, 47200, 48200
];

export const usersSeries = [
	11000, 11310, 11510, 11820, 12030, 12240, 12330, 12540, 12640, 12750, 12810, 12840
];

export const kpis: Kpi[] = [
	{
		id: 'mrr',
		label: 'MRR',
		value: '$48,200',
		delta: '6.4%',
		tone: 'up',
		good: true,
		caption: 'vs previous 30 days',
		spark: mrrSeries
	},
	{
		id: 'users',
		label: 'Active users',
		value: '12,840',
		delta: '3.1%',
		tone: 'up',
		good: true,
		caption: 'vs previous 30 days',
		spark: usersSeries
	},
	{
		id: 'conversion',
		label: 'Trial → Paid',
		value: '3.8%',
		delta: '0.4 pp',
		tone: 'down',
		good: false,
		caption: 'vs previous 30 days',
		spark: [4.4, 4.3, 4.2, 4.3, 4.1, 4.2, 4.0, 4.1, 3.9, 4.0, 3.9, 3.8]
	},
	{
		id: 'churn',
		label: 'Churn',
		value: '1.9%',
		delta: '0.2 pp',
		tone: 'up',
		good: false,
		caption: 'up is unfavorable',
		spark: [1.6, 1.7, 1.6, 1.7, 1.8, 1.7, 1.8, 1.8, 1.9, 1.8, 1.8, 1.9]
	}
];

export const plans: PlanSegment[] = [
	{ name: 'Pro', value: '$21.2k', percent: 44, segClass: 's1' },
	{ name: 'Team', value: '$14.5k', percent: 30, segClass: 's2' },
	{ name: 'Enterprise', value: '$9.8k', percent: 20, segClass: 's3' },
	{ name: 'Free', value: '$2.7k', percent: 6, segClass: 's4' }
];

export const accounts: Account[] = [
	{
		name: 'Northwind Labs',
		id: '#A-1042',
		plan: 'Pro',
		mrr: '$2,400',
		status: 'healthy',
		owner: 'mr'
	},
	{
		name: 'Helix Systems',
		id: '#A-1088',
		plan: 'Enterprise',
		mrr: '$8,900',
		status: 'healthy',
		owner: 'dc'
	},
	{
		name: 'Cobalt Industries',
		id: '#A-1120',
		plan: 'Team',
		mrr: '$1,200',
		status: 'at-risk',
		owner: 'pn'
	},
	{ name: 'Lumen Health', id: '#A-1157', plan: 'Pro', mrr: '$3,100', status: 'new', owner: 'so' },
	{
		name: 'Atlas Robotics',
		id: '#A-1199',
		plan: 'Enterprise',
		mrr: '$6,750',
		status: 'at-risk',
		owner: 'lf'
	}
];
