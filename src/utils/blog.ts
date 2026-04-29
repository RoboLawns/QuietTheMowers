export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  author: string;
  tags: string[];
  featured: boolean;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'berkeley-wins-quiet-mornings',
    title: 'Berkeley Bans Gas Leaf Blowers: How a Neighborhood Campaign Won',
    description: 'After two years of organizing, data collection, and council meetings, Berkeley becomes the latest city to ban gas-powered leaf blowers.',
    pubDate: '2026-04-15',
    author: 'Quiet The Mowers',
    tags: ['wins', 'california', 'leaf-blowers'],
    featured: true,
    content: `Berkeley, California has become the latest — and one of the largest — U.S. cities to ban gas-powered leaf blowers. The ordinance, passed by the City Council on April 10, 2026, represents a significant win for the #QuietTheMowers movement and offers a blueprint for other communities.

## The Campaign

The effort was led by Maria T., a Berkeley resident and mother of two who got tired of leaf blowers disrupting her children's nap schedules. "It wasn't just annoying," Maria told us. "It was making our home unlivable during certain hours."

Maria started with a simple petition on her block. Fifty neighbors signed in the first weekend. She then:

1. **Measured the noise** — Using a rented Class 2 sound meter, she documented leaf blower noise levels at 90–105 dB at the source and 65–75 dB at her property line, well above Berkeley's existing general noise ordinance.
2. **Built a coalition** — She connected with local environmental groups, parents' organizations, and a landscaper who had already switched to electric.
3. **Collected signatures** — The campaign gathered 1,200 verified signatures from Berkeley residents.
4. **Showed up prepared** — Maria presented at three council meetings, each time with updated data, more signatures, and specific ordinance language adapted from other cities' laws.

## The Ordinance

The final ordinance includes:

- **A ban on the sale** of new gas-powered leaf blowers, effective immediately
- **A 12-month phase-in** for the use ban, giving residents and businesses time to transition
- **A $250,000 annual rebate program**, providing up to $200 per household or business that trades in a gas blower for an electric model
- **A Commercial Transition Fund** for small landscaping businesses
- **Complaint-based enforcement** with escalating fines

## What Made the Difference

"The data," Maria says. "When I stood up with dB readings from 15 different locations across 4 weekends, the council couldn't ignore it. The debate shifted from 'is this a problem?' to 'how do we fix it?'"

The Berkeley win follows similar ordinances in Washington DC, Palo Alto, and Montclair, NJ. The movement is gaining momentum — and every win makes the next one easier.

## How to Replicate This

If you want to run a similar campaign in your city:

1. Browse this ordinance and others in our [Ordinance Library](/ordinances)
2. [Start a campaign](/campaigns/new) and pick "Gas Blower Ban" as your template
3. [Rent a sound meter](/measure/rent) to collect data
4. Use our [Council Meeting Prep](/learn/how-to-speak-at-council) guide

Berkeley shows it's possible. Your city could be next.`,
  },
  {
    slug: 'electric-mower-buying-guide-2026',
    title: 'The 2026 Electric Mower Buying Guide',
    description: "We tested 12 battery-powered mowers. Here's what works, what doesn't, and what you actually need for your lawn size.",
    pubDate: '2026-03-28',
    author: 'Quiet The Mowers',
    tags: ['equipment', 'reviews'],
    featured: true,
  },
  {
    slug: 'how-many-signatures-do-you-need',
    title: 'How Many Signatures Do You Actually Need to Change a Law?',
    description: 'The math behind petition campaigns, and why 47 signatures can be worth more than 1,000.',
    pubDate: '2026-03-10',
    author: 'Quiet The Mowers',
    tags: ['campaigning', 'strategy'],
    featured: false,
  },
  {
    slug: 'noise-pollution-health-study-2026',
    title: 'New Study Links Neighborhood Noise to Increased Blood Pressure',
    description: 'A major longitudinal study finds that chronic exposure to neighborhood equipment noise raises hypertension risk by 14%.',
    pubDate: '2026-02-20',
    author: 'Quiet The Mowers',
    tags: ['research', 'health'],
    featured: true,
  },
  {
    slug: 'hoa-organizing-guide',
    title: 'How One HOA Member Got 80% of Neighbors to Support Electric-Only Rules',
    description: 'A case study in community organizing: door-knocking, demo days, and the "try before you buy" approach.',
    pubDate: '2026-02-05',
    author: 'Quiet The Mowers',
    tags: ['organizing', 'hoa', 'case-study'],
    featured: false,
  },
  {
    slug: 'commercial-landscapers-going-electric',
    title: 'The Quiet Revolution in Commercial Landscaping',
    description: "More landscaping companies are switching to electric. Here's why — and what it means for your neighborhood.",
    pubDate: '2026-01-15',
    author: 'Quiet The Mowers',
    tags: ['industry', 'commercial'],
    featured: false,
  },
];
