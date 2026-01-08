import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, TrendingUp, Clock, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import type { CaseStudy } from '@/types/caseStudy';

// This will be replaced with actual data fetching
const getCaseStudy = (slug: string): CaseStudy | null => {
    // TODO: Fetch from database or import from data file
    return null;
};

const CaseStudyPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const caseStudy = getCaseStudy(slug || '');

    if (!caseStudy) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
                    <Button onClick={() => navigate('/projetos')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={`${caseStudy.title} - Case Study`}
                description={caseStudy.metaDescription}
            />

            <div className="min-h-screen">
                {/* Back Button */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/projetos')}
                        className="mb-8"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </div>

                {/* Hero Section */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {caseStudy.title}
                            </h1>
                            <p className="text-xl text-gray-400 mb-6">
                                {caseStudy.tagline}
                            </p>

                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{caseStudy.client}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="h-4 w-4" />
                                    <span>{caseStudy.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Users className="h-4 w-4" />
                                    <span>{caseStudy.role}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>{caseStudy.industry}</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex gap-4">
                                {caseStudy.liveUrl && (
                                    <Button asChild>
                                        <a href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View Live
                                        </a>
                                    </Button>
                                )}
                                {caseStudy.githubUrl && (
                                    <Button variant="outline" asChild>
                                        <a href={caseStudy.githubUrl} target="_blank" rel="noopener noreferrer">
                                            <Github className="mr-2 h-4 w-4" />
                                            View Code
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div>
                            <img
                                src={caseStudy.heroImage}
                                alt={caseStudy.heroImageAlt}
                                className="rounded-lg shadow-2xl w-full"
                            />
                        </div>
                    </div>
                </section>

                {/* Challenge Section */}
                <section className="bg-gray-900/50 py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            {caseStudy.challenge}
                        </p>

                        <h3 className="text-xl font-semibold mb-4">Pain Points:</h3>
                        <ul className="space-y-3">
                            {caseStudy.painPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">🔴</span>
                                    <span className="text-gray-300">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Solution Section */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-6">The Solution</h2>
                        <p className="text-lg text-gray-300 mb-12 leading-relaxed">
                            {caseStudy.approach}
                        </p>

                        {/* Technologies */}
                        <h3 className="text-2xl font-semibold mb-6">Technical Decisions</h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            {caseStudy.technologies.map((tech, index) => (
                                <div key={index} className="border border-gray-800 rounded-lg p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="outline">{tech.category}</Badge>
                                        <h4 className="text-lg font-semibold">{tech.name}</h4>
                                    </div>
                                    {tech.reason && (
                                        <p className="text-gray-400 mb-2">
                                            <span className="font-medium">Why:</span> {tech.reason}
                                        </p>
                                    )}
                                    {tech.impact && (
                                        <p className="text-green-400">
                                            <span className="font-medium">Impact:</span> {tech.impact}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Key Features */}
                        <h3 className="text-2xl font-semibold mb-6">Key Features Implemented</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {caseStudy.features.map((feature, index) => (
                                <div key={index} className="bg-gray-900/50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold mb-3">{feature.title}</h4>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section className="bg-gradient-to-r from-light-cyan/10 to-purple-500/10 py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center">Results & Impact</h2>

                        {/* Metrics */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {caseStudy.metrics.map((metric, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl mb-2">{metric.icon}</div>
                                    <div className="text-3xl font-bold text-light-cyan mb-2">
                                        {metric.value}
                                    </div>
                                    <div className="text-gray-400">{metric.label}</div>
                                    {metric.improvement && (
                                        <div className="text-green-400 text-sm mt-1">
                                            {metric.improvement}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Achievements */}
                        <div className="bg-gray-900/50 rounded-lg p-8">
                            <h3 className="text-xl font-semibold mb-4">Technical Achievements</h3>
                            <ul className="grid md:grid-cols-2 gap-3">
                                {caseStudy.achievements.map((achievement, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="text-green-500">✅</span>
                                        <span className="text-gray-300">{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Testimonial Section */}
                {caseStudy.testimonial && (
                    <section className="py-16">
                        <div className="max-w-4xl mx-auto px-4">
                            <div className="bg-gray-900/50 rounded-lg p-8 md:p-12 border border-gray-800">
                                <div className="text-6xl text-light-cyan mb-4">"</div>
                                <blockquote className="text-xl text-gray-300 mb-6 italic leading-relaxed">
                                    {caseStudy.testimonial.quote}
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    {caseStudy.testimonial.avatar && (
                                        <img
                                            src={caseStudy.testimonial.avatar}
                                            alt={caseStudy.testimonial.author}
                                            className="w-16 h-16 rounded-full"
                                        />
                                    )}
                                    <div>
                                        <div className="font-semibold">{caseStudy.testimonial.author}</div>
                                        <div className="text-gray-400">
                                            {caseStudy.testimonial.role}
                                            {caseStudy.testimonial.company && ` at ${caseStudy.testimonial.company}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Gallery Section */}
                {caseStudy.images.length > 0 && (
                    <section className="py-16 bg-gray-900/50">
                        <div className="max-w-6xl mx-auto px-4">
                            <h2 className="text-3xl font-bold mb-8">Project Gallery</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {caseStudy.images.map((image, index) => (
                                    <div key={index} className="group">
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="rounded-lg w-full shadow-lg transition-transform group-hover:scale-105"
                                        />
                                        {image.caption && (
                                            <p className="text-gray-400 text-sm mt-2 text-center">
                                                {image.caption}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Want Similar Results?
                        </h2>
                        <p className="text-xl text-gray-400 mb-8">
                            If you're facing similar challenges, let's talk about how I can help transform your project.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/contato')}
                            className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
                        >
                            Get in Touch
                        </Button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default CaseStudyPage;
