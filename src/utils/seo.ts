// SEO component — injects JSON-LD structured data
export interface SEOProps {
  type: 'website' | 'article' | 'campaign' | 'faq';
  title: string;
  description: string;
  url: string;
  image?: string;
  pubDate?: string;
  author?: string;
  organizer?: string;
  sigCount?: number;
  faqs?: { question: string; answer: string }[];
}

export function generateSEO(props: SEOProps) {
  return JSON.stringify(buildSchema(props));
}

function buildSchema(props: SEOProps) {
  switch (props.type) {
    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: props.title,
        description: props.description,
        datePublished: props.pubDate,
        author: { '@type': 'Person', name: props.author || 'Quiet The Mowers' },
        url: props.url,
        ...(props.image ? { image: props.image } : {}),
        publisher: {
          '@type': 'Organization',
          name: 'Quiet The Mowers',
          logo: { '@type': 'ImageObject', url: 'https://quietthemowers.com/favicon.svg' },
        },
      };
    case 'campaign':
      return {
        '@context': 'https://schema.org',
        '@type': 'Action',
        name: props.title,
        description: props.description,
        agent: { '@type': 'Person', name: props.organizer || 'Anonymous' },
        result: { '@type': 'PropertyValue', name: 'Signatures', value: props.sigCount || 0 },
        url: props.url,
      };
    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (props.faqs || []).map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      };
    default:
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Quiet The Mowers',
        url: 'https://quietthemowers.com',
        description: props.description,
      };
  }
}
