// Locked Operational / monitoring baseline for "Aurora".
// This is the FIRST Operational dashboard, so it LOCKS the shared Operational
// content baseline. Later Operational styles copy this file verbatim and change
// only the visual language.
// Owned by this entry per the design contract; each catalog entry keeps its own copy.

export type Member = {
	id: string;
	name: string;
	initials: string;
	/** OKLCH hue for the avatar fill; lightness/chroma kept dark enough for AA initials. */
	hue: number;
};

export type TrendTone = 'up' | 'down';

export type HeadlineMetric = {
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

export type ServiceStatus = 'healthy' | 'degraded' | 'down';

export type ServiceUnit = 'req/s' | 'qps' | 'ops/s' | 'jobs/s';

export type Service = {
	id: string;
	label: string;
	status: ServiceStatus;
	uptime: string;
	throughput: number;
	unit: ServiceUnit;
	errorPct: string;
	p95: number;
};

export type Dependency = {
	/** Client service id (edge origin). */
	from: string;
	/** Dependency service id (edge target). */
	to: string;
	/** True when the target is degraded/down — the edge reads at-risk / red. */
	atRisk: boolean;
};

export type IncidentSeverity = 'SEV-1' | 'SEV-2' | 'SEV-3';

export type IncidentStatus = 'active' | 'resolved' | 'monitored';

export type Incident = {
	id: string;
	/** Service id the incident is scoped to. */
	service: string;
	severity: IncidentSeverity;
	age: string;
	status: IncidentStatus;
	summary: string;
};

export type SloState = 'healthy' | 'at-risk' | 'exhausted';

export type SloBudget = {
	slo: string;
	/** Percent of the error budget remaining. */
	budgetRemaining: number;
	state: SloState;
};

// The five Aurora members — kept consistent with the rest of the catalog.
export const members: Member[] = [
	{ id: 'mr', name: 'Maya Rivera', initials: 'MR', hue: 250 },
	{ id: 'dc', name: 'Devon Chen', initials: 'DC', hue: 210 },
	{ id: 'pn', name: 'Priya Nair', initials: 'PN', hue: 30 },
	{ id: 'so', name: 'Sam Okafor', initials: 'SO', hue: 180 },
	{ id: 'lf', name: 'Lena Foss', initials: 'LF', hue: 300 }
];

export const byId = new Map(members.map((m) => [m.id, m]));

/** On-call engineer for the current window (Lena Foss). */
export const onCallId = 'lf';

// Live metrics — two locked 12-point series (5-min buckets, oldest → newest).
export const intervals = [
	'-60m',
	'-55m',
	'-50m',
	'-45m',
	'-40m',
	'-35m',
	'-30m',
	'-25m',
	'-20m',
	'-15m',
	'-10m',
	'-5m'
];

export const reqSeries = [4620, 4710, 4680, 4800, 4880, 4920, 4810, 4780, 4850, 4910, 4760, 4820];

export const errSeries = [0.24, 0.26, 0.31, 0.29, 0.34, 0.38, 0.41, 0.39, 0.44, 0.42, 0.4, 0.42];

// 4 headline metrics — value · Δ vs previous 60 min · good?
export const headline: HeadlineMetric[] = [
	{
		id: 'uptime',
		label: 'Uptime',
		value: '99.94%',
		delta: '0.04 pp',
		tone: 'down',
		good: false,
		caption: 'below 99.9% SLO',
		spark: [100, 100, 99.99, 99.98, 99.97, 99.96, 99.95, 99.94, 99.93, 99.94, 99.94, 99.94]
	},
	{
		id: 'req',
		label: 'Request rate',
		value: '4,820 req/s',
		delta: '312',
		tone: 'up',
		good: true,
		caption: 'vs previous 60 min',
		spark: reqSeries
	},
	{
		id: 'err',
		label: 'Error rate',
		value: '0.42%',
		delta: '0.18 pp',
		tone: 'up',
		good: false,
		caption: 'up is unfavorable',
		spark: errSeries
	},
	{
		id: 'p95',
		label: 'p95 latency',
		value: '184 ms',
		delta: '7 ms',
		tone: 'down',
		good: true,
		caption: 'vs previous 60 min',
		spark: [205, 202, 198, 195, 192, 189, 188, 191, 187, 186, 185, 184]
	}
];

// 6 services — id · label · status · uptime · throughput · error % · p95 ms
export const services: Service[] = [
	{
		id: 'api-gateway',
		label: 'API Gateway',
		status: 'healthy',
		uptime: '99.99%',
		throughput: 2140,
		unit: 'req/s',
		errorPct: '0.21%',
		p95: 142
	},
	{
		id: 'web-app',
		label: 'Web App',
		status: 'healthy',
		uptime: '99.97%',
		throughput: 1310,
		unit: 'req/s',
		errorPct: '0.31%',
		p95: 176
	},
	{
		id: 'postgres',
		label: 'Postgres',
		status: 'degraded',
		uptime: '99.91%',
		throughput: 880,
		unit: 'qps',
		errorPct: '0.62%',
		p95: 224
	},
	{
		id: 'redis',
		label: 'Redis',
		status: 'healthy',
		uptime: '100%',
		throughput: 6200,
		unit: 'ops/s',
		errorPct: '0.04%',
		p95: 38
	},
	{
		id: 'workers',
		label: 'Workers',
		status: 'degraded',
		uptime: '99.88%',
		throughput: 540,
		unit: 'jobs/s',
		errorPct: '0.91%',
		p95: 880
	},
	{
		id: 'cdn',
		label: 'CDN',
		status: 'healthy',
		uptime: '99.99%',
		throughput: 12400,
		unit: 'req/s',
		errorPct: '0.05%',
		p95: 24
	}
];

export const byServiceId = new Map(services.map((s) => [s.id, s]));

// Dependencies (DAG edges, client → dependency). atRisk is true when the target
// service is degraded or down (postgres, workers).
export const dependencies: Dependency[] = [
	{ from: 'api-gateway', to: 'web-app', atRisk: false },
	{ from: 'api-gateway', to: 'cdn', atRisk: false },
	{ from: 'web-app', to: 'postgres', atRisk: true },
	{ from: 'web-app', to: 'redis', atRisk: false },
	{ from: 'web-app', to: 'workers', atRisk: true },
	{ from: 'workers', to: 'postgres', atRisk: true },
	{ from: 'workers', to: 'redis', atRisk: false }
];

// 3 incidents.
export const incidents: Incident[] = [
	{
		id: 'INC-2041',
		service: 'postgres',
		severity: 'SEV-2',
		age: '14m',
		status: 'active',
		summary: 'Elevated query latency in us-east'
	},
	{
		id: 'INC-2040',
		service: 'web-app',
		severity: 'SEV-3',
		age: '2h',
		status: 'resolved',
		summary: 'Deploy rolled back'
	},
	{
		id: 'INC-2039',
		service: 'workers',
		severity: 'SEV-3',
		age: '5h',
		status: 'monitored',
		summary: 'Queue backlog cleared'
	}
];

// SLO / error-budget indicator.
export const slo: SloBudget = {
	slo: '99.9% uptime',
	budgetRemaining: 62,
	state: 'at-risk'
};
