export interface Ordinance {
  slug: string;
  title: string;
  jurisdictionName: string;
  jurisdictionType: 'city' | 'county' | 'state' | 'hoa';
  ordinanceType: 'gas_blower_ban' | 'hours_restriction' | 'noise_limit' | 'other';
  effectiveDate: string;
  summary: string;
  state: string;
  featured: boolean;
  sourceUrl?: string;
  fullText?: string;
}

export const ordinances: Ordinance[] = [
  {
    slug: 'berkeley-gas-blower-ban',
    title: 'Gas-Powered Leaf Blower Ban',
    jurisdictionName: 'Berkeley, CA',
    jurisdictionType: 'city',
    ordinanceType: 'gas_blower_ban',
    effectiveDate: '2023-10-01',
    summary: 'Full ban on the sale and use of gas-powered leaf blowers within city limits. Includes a phase-in period and rebate program for electric conversion.',
    state: 'CA',
    featured: true,
    sourceUrl: 'https://berkeleyca.gov',
    fullText: `## Overview

In October 2023, the City of Berkeley enacted a comprehensive ban on gas-powered leaf blowers, becoming one of the largest U.S. cities to do so. The ordinance was the result of a two-year campaign led by local residents and environmental groups who documented noise complaints and air quality data.

## Key Provisions

1. **Sale Ban** — Effective immediately upon passage, no retailer within city limits may sell new gas-powered leaf blowers.
2. **Use Ban** — After a 12-month phase-in period, use of gas-powered leaf blowers is prohibited citywide.
3. **Rebate Program** — The city allocates $250,000 annually to rebate residents and commercial landscapers who trade in gas blowers for electric models. Rebates of up to $200 per unit.
4. **Enforcement** — Code enforcement responds to complaints. First offense: warning. Second: $100 fine. Third and subsequent: $250 fine.
5. **Commercial Transition Fund** — Additional grants available for landscaping businesses with 5 or fewer employees to support fleet conversion.

## How to Use This Template

This ordinance structure works well for mid-sized cities. Key elements to replicate:

- **Phase-in period** gives residents and businesses time to adapt
- **Rebate program** removes the cost objection
- **Commercial transition support** addresses the equity concern for small businesses
- **Complaint-based enforcement** keeps administrative costs low

## Campaign That Won It

Local organizer Maria T. started with 50 signatures from her block. She measured noise levels over 4 weekends, documented 15 noise complaints to the city, and presented the data at 3 council meetings. The campaign gathered 1,200 signatures before the council vote.

> "The data made the difference. When we showed the council our dB readings, the debate shifted from 'is this a problem?' to 'how do we fix it?'" — Maria T., Campaign Organizer`,
  },
  {
    slug: 'palo-alto-hours-restriction',
    title: 'Gas Equipment Hours Restriction',
    jurisdictionName: 'Palo Alto, CA',
    jurisdictionType: 'city',
    ordinanceType: 'hours_restriction',
    effectiveDate: '2022-06-15',
    summary: 'Restricts gas-powered lawn equipment use to 9am-5pm weekdays and 10am-4pm weekends. Includes noise limits and enforcement provisions.',
    state: 'CA',
    featured: true,
  },
  {
    slug: 'washington-dc-phase-out',
    title: 'Gas Leaf Blower Phase-Out',
    jurisdictionName: 'Washington, DC',
    jurisdictionType: 'city',
    ordinanceType: 'gas_blower_ban',
    effectiveDate: '2022-01-01',
    summary: 'Phased ban on gas-powered leaf blowers starting with a two-year warning period, followed by fines. Includes a rebate program for electric equipment.',
    state: 'DC',
    featured: true,
  },
  {
    slug: 'maplewood-hoa-noise-limit',
    title: 'HOA Noise Limit on Lawn Equipment',
    jurisdictionName: 'Maplewood HOA, NJ',
    jurisdictionType: 'hoa',
    ordinanceType: 'noise_limit',
    effectiveDate: '2024-03-01',
    summary: 'HOA bylaw amendment setting a 65 dB limit at property lines for lawn equipment. Effectively bans gas equipment due to noise levels exceeding the limit.',
    state: 'NJ',
    featured: false,
  },
  {
    slug: 'montclair-emissions-standard',
    title: 'Small Engine Emissions Standard',
    jurisdictionName: 'Montclair, NJ',
    jurisdictionType: 'city',
    ordinanceType: 'gas_blower_ban',
    effectiveDate: '2023-05-01',
    summary: 'Prohibits the use of gasoline-powered leaf blowers from May through September. Year-round restriction under consideration.',
    state: 'NJ',
    featured: false,
  },
  {
    slug: 'portland-electric-incentive',
    title: 'Electric Equipment Rebate Program',
    jurisdictionName: 'Portland, OR',
    jurisdictionType: 'city',
    ordinanceType: 'other',
    effectiveDate: '2024-01-01',
    summary: 'Establishes a rebate program for residents and commercial landscapers who trade in gas-powered equipment for electric alternatives. Up to $200 per item.',
    state: 'OR',
    featured: false,
  },
];

export const typeLabels: Record<string, string> = {
  gas_blower_ban: 'Gas Blower Ban',
  hours_restriction: 'Hours Restriction',
  noise_limit: 'Noise Limit',
  other: 'Other',
};

export const jurisdictionLabels: Record<string, string> = {
  city: 'City',
  county: 'County',
  state: 'State',
  hoa: 'HOA',
};
