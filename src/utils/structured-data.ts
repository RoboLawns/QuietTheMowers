// JSON-LD structured data components for SEO
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Quiet The Mowers',
    url: 'https://quietthemowers.com',
    description: 'Turning the #QuietTheMowers hashtag into local policy change.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://quietthemowers.com/campaigns?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Quiet The Mowers',
    url: 'https://quietthemowers.com',
    description: 'A civic-tech platform turning the #QuietTheMowers hashtag into local policy change.',
    sameAs: [
      'https://x.com/QuietTheMowers',
      'https://facebook.com/QuietTheMowers',
      'https://instagram.com/QuietTheMowers',
    ],
  };
}

export function articleSchema(title: string, description: string, pubDate: string, author: string, url: string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: pubDate,
    author: { '@type': 'Person', name: author },
    url,
    ...(image ? { image } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Quiet The Mowers',
      logo: { '@type': 'ImageObject', url: 'https://quietthemowers.com/favicon.svg' },
    },
  };
}

export function campaignSchema(title: string, description: string, organizer: string, sigCount: number, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Action',
    name: title,
    description,
    agent: { '@type': 'Person', name: organizer },
    result: { '@type': 'PropertyValue', name: 'Signatures', value: sigCount },
    url,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
