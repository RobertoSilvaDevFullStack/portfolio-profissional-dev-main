export interface Technology {
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
    reason?: string;
    impact?: string;
}

export interface Feature {
    title: string;
    description: string;
    icon?: string;
}

export interface Metric {
    label: string;
    value: string;
    icon: string;
    improvement?: string;
}

export interface Testimonial {
    quote: string;
    author: string;
    role: string;
    company?: string;
    avatar?: string;
}

export interface CaseStudyImage {
    url: string;
    alt: string;
    caption?: string;
}

export interface CaseStudy {
    id: string;
    slug: string;
    title: string;
    tagline: string;

    // Meta
    client: string;
    industry: string;
    duration: string;
    role: string;
    teamSize?: string;

    // Hero
    heroImage: string;
    heroImageAlt: string;

    // Problem
    challenge: string;
    painPoints: string[];

    // Solution
    approach: string;
    technologies: Technology[];
    features: Feature[];

    // Results
    metrics: Metric[];
    achievements: string[];
    testimonial?: Testimonial;

    // Gallery
    images: CaseStudyImage[];

    // Links
    liveUrl?: string;
    githubUrl?: string;

    // SEO
    metaDescription: string;
    keywords: string[];

    // Dates
    completedAt: string;
    publishedAt: string;
}
