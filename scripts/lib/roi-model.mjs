/**
 * Canonical ROI model for genetic-ai-starter docs.
 * Gene: repo.tooling.genetic_starter.docs.gen1
 *
 * All marketing tables in VALUE_AND_ROI_* derive from this file via calculate-roi.mjs.
 * Dollars are MODELED — not measured invoices. See DOC_CLAIMS_AUDIT.md.
 */

export const ROI_MODEL_VERSION = 1;

export const DEFAULT_RATE_USD_PER_HOUR = 85;

export const DEFAULT_MAINTENANCE_HOURS_PER_MONTH = 1.5;

/**
 * @typedef {object} RoiTierInput
 * @property {string} id
 * @property {string} labelEn
 * @property {string} labelRu
 * @property {string} recommendedProfile
 * @property {number} incidentsPerMonth wrong-file / sed / map-miss events avoided
 * @property {number} hoursSavedPerIncident blended rework + review
 * @property {number} [releaseGateHoursPerMonth] amortized release-doc hotfixes
 * @property {number} [onboardingHoursPerQuarter] new hire / agent discovery (÷3 → monthly)
 * @property {number} [integrationHoursPerMonth] AgentStack drift only (incremental tier)
 * @property {boolean} [incremental] stacks on `stacksOn` tier id
 * @property {string} [stacksOn]
 */

/** @type {Record<string, RoiTierInput>} */
export const ROI_TIERS = {
  solo: {
    id: 'solo',
    labelEn: 'Solo / micro',
    labelRu: 'Соло / микро',
    recommendedProfile: 'standard',
    incidentsPerMonth: 2,
    hoursSavedPerIncident: 2.5,
    releaseGateHoursPerMonth: 0.5,
    onboardingHoursPerQuarter: 0,
  },
  small: {
    id: 'small',
    labelEn: 'Small product (2–5 devs)',
    labelRu: 'Малый продукт (2–5)',
    recommendedProfile: 'standard',
    incidentsPerMonth: 4,
    hoursSavedPerIncident: 2.75,
    releaseGateHoursPerMonth: 1.5,
    onboardingHoursPerQuarter: 4,
  },
  medium: {
    id: 'medium',
    labelEn: 'Medium (6–15 devs)',
    labelRu: 'Средний (6–15)',
    recommendedProfile: 'standard + AI_INDEX',
    incidentsPerMonth: 8,
    hoursSavedPerIncident: 2.5,
    releaseGateHoursPerMonth: 3,
    onboardingHoursPerQuarter: 12,
  },
  large: {
    id: 'large',
    labelEn: 'Large monorepo (15+ devs)',
    labelRu: 'Крупный monorepo (15+)',
    recommendedProfile: 'standard + LARGE_PROJECT_PLAYBOOK',
    incidentsPerMonth: 15,
    hoursSavedPerIncident: 2.5,
    releaseGateHoursPerMonth: 6,
    onboardingHoursPerQuarter: 18,
  },
  agentstackIncremental: {
    id: 'agentstackIncremental',
    labelEn: 'AgentStack consumer (incremental)',
    labelRu: 'Потребитель AgentStack (доп.)',
    recommendedProfile: 'agentstack-app',
    incidentsPerMonth: 3,
    hoursSavedPerIncident: 5.5,
    releaseGateHoursPerMonth: 0,
    onboardingHoursPerQuarter: 0,
    integrationHoursPerMonth: 0,
    incremental: true,
    stacksOn: 'small',
  },
};

/**
 * @param {RoiTierInput} tier
 * @param {{ rateUsdPerHour?: number, maintenanceHoursPerMonth?: number }} [opts]
 */
export function computeTierRoi(tier, opts = {}) {
  const rate = opts.rateUsdPerHour ?? DEFAULT_RATE_USD_PER_HOUR;
  const maintenance = opts.maintenanceHoursPerMonth ?? DEFAULT_MAINTENANCE_HOURS_PER_MONTH;

  const incidentHours = tier.incidentsPerMonth * tier.hoursSavedPerIncident;
  const releaseHours = tier.releaseGateHoursPerMonth ?? 0;
  const onboardingHoursMonthly = (tier.onboardingHoursPerQuarter ?? 0) / 3;
  const integrationHours = tier.integrationHoursPerMonth ?? 0;

  const grossHours =
    incidentHours + releaseHours + onboardingHoursMonthly + integrationHours;
  const netHours = tier.incremental ? grossHours : grossHours - maintenance;
  const monthlyUsd = Math.round(netHours * rate);
  const annualUsd = Math.round(monthlyUsd * 12);

  return {
    tierId: tier.id,
    incidentHours,
    releaseHours,
    onboardingHoursMonthly,
    integrationHours,
    grossHours,
    maintenanceHours: maintenance,
    netHours,
    rateUsdPerHour: rate,
    monthlyUsd,
    annualUsd,
  };
}

/**
 * @param {{ rateUsdPerHour?: number, maintenanceHoursPerMonth?: number }} [opts]
 */
export function computeFullRoiSnapshot(opts = {}) {
  const tiers = {};
  for (const tier of Object.values(ROI_TIERS)) {
    tiers[tier.id] = {
      ...computeTierRoi(tier, opts),
      labelEn: tier.labelEn,
      labelRu: tier.labelRu,
      recommendedProfile: tier.recommendedProfile,
      incremental: tier.incremental ?? false,
      stacksOn: tier.stacksOn ?? null,
    };
  }

  const small = tiers.small.monthlyUsd;
  const inc = tiers.agentstackIncremental.monthlyUsd;
  tiers.agentstackTotalSmall = {
    monthlyUsd: small + inc,
    annualUsd: Math.round((small + inc) * 12),
    note: 'small + agentstackIncremental',
  };

  return {
    modelVersion: ROI_MODEL_VERSION,
    generatedNote:
      'Modeled savings — not Cursor API billing or payroll actuals. Reproduce: node scripts/calculate-roi.mjs --json',
    rateUsdPerHour: opts.rateUsdPerHour ?? DEFAULT_RATE_USD_PER_HOUR,
    maintenanceHoursPerMonth: opts.maintenanceHoursPerMonth ?? DEFAULT_MAINTENANCE_HOURS_PER_MONTH,
    tiers,
  };
}
