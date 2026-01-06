import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { Code, Share2, Zap, Wrench, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ServicesCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start' },
        [Autoplay({ delay: 4000, stopOnInteraction: false })]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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

    const services = [
        {
            icon: Code,
            title: 'Desenvolvimento Customizado',
            description: 'Sistemas Web e Aplicativos completos e responsivos, da prototipagem no Figma até o deploy.',
        },
        {
            icon: Share2,
            title: 'APIs e Integrações',
            description: 'Construção de APIs RESTful robustas e integração com serviços de terceiros.',
        },
        {
            icon: Zap,
            title: 'Performance e Segurança',
            description: 'Implementação das melhores práticas para sistemas rápidos, seguros e escaláveis.',
        },
        {
            icon: Settings,
            title: 'Consultoria em Arquitetura',
            description: 'Definição da melhor arquitetura para seu projeto, garantindo escalabilidade.',
        },
        {
            icon: Wrench,
            title: 'Manutenção e Evolução',
            description: 'Melhorias, refatorações e novas funcionalidades em sistemas existentes.',
        },
    ];

    return (
        <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                            <div
                                key={index}
                                className="flex-[0_0_100%] min-w-0 px-2"
                            >
                                <Card className="bg-gray-800 border-gray-700 text-center p-6 hover:border-light-cyan transition-colors h-full">
                                    <CardHeader className="flex items-center justify-center">
                                        <IconComponent className="w-12 h-12 text-light-cyan" />
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="text-white text-xl mb-3">
                                            {service.title}
                                        </CardTitle>
                                        <p className="text-gray-400 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
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
        </div>
    );
};

export default ServicesCarousel;
