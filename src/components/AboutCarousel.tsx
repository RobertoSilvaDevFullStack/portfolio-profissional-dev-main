import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface AboutCarouselProps {
    content: string;
}

const AboutCarousel = ({ content }: AboutCarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        skipSnaps: false,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    // Dividir o conteúdo em cards
    const cards = [
        {
            title: 'Perfil Profissional',
            content: content.split('\\n\\n')[0] || content.substring(0, 300),
            icon: '👨‍💻',
        },
        {
            title: 'Habilidades Técnicas',
            content: 'Frontend: React, JavaScript, TypeScript, HTML5, CSS3, TailwindCSS\n\nBackend: Node.js, Express, PostgreSQL, MongoDB, Prisma ORM\n\nFerramentas: Git, GitHub, Railway, Vercel',
            icon: '🛠️',
        },
        {
            title: 'Experiência Comercial',
            content: '5 anos como corretor de imóveis\nGestão de tráfego pago desde 2020\nEspecialista em geração de leads\nConhecimento em métricas e ROI',
            icon: '💼',
        },
        {
            title: 'Diferenciais',
            content: 'Visão dupla: técnica + comercial\nTradução de necessidades em soluções\nMarketing digital aplicado\nExperiência no mercado imobiliário',
            icon: '⭐',
        },
    ];

    return (
        <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] min-w-0 px-2"
                        >
                            <div className="bg-dark-navy/50 border border-gray-700 rounded-lg p-6 h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl">{card.icon}</span>
                                    <h3 className="text-xl font-semibold text-light-cyan">
                                        {card.title}
                                    </h3>
                                </div>
                                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                                    {card.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollPrev}
                    disabled={selectedIndex === 0}
                    className="bg-dark-navy border-gray-700 hover:bg-gray-800 disabled:opacity-30"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex
                                    ? 'bg-light-cyan w-8'
                                    : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollNext}
                    disabled={selectedIndex === scrollSnaps.length - 1}
                    className="bg-dark-navy border-gray-700 hover:bg-gray-800 disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Counter */}
            <p className="text-center text-gray-400 text-sm mt-4">
                {selectedIndex + 1} / {scrollSnaps.length}
            </p>
        </div>
    );
};

export default AboutCarousel;
