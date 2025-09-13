import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PostAssetCarouselProps {
  assetUrls: string[];
}

const PostAssetCarousel: React.FC<PostAssetCarouselProps> = ({ assetUrls }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full my-8">
      <div className="overflow-hidden rounded-lg border border-gray-700" ref={emblaRef}>
        <div className="flex">
          {assetUrls.map((url, index) => {
            const isPdf = url.toLowerCase().endsWith('.pdf');
            return (
              <div className="flex-grow-0 flex-shrink-0 w-full bg-gray-900 flex items-center justify-center" key={index} style={{ minHeight: '600px' }}>
                {isPdf ? (
                  <iframe
                    src={url}
                    className="w-full h-full"
                    style={{ minHeight: '600px' }}
                    title={`Slide ${index + 1}`}
                    frameBorder="0"
                  />
                ) : (
                  <img 
                    src={url} 
                    alt={`Slide ${index + 1}`} 
                    className="w-auto h-auto object-contain max-h-[600px] mx-auto" 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {assetUrls.length > 1 && (
        <>
          <button 
            onClick={scrollPrev} 
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-opacity z-10"
            aria-label="Slide anterior"
          >
            <ArrowLeft size={24} />
          </button>
          <button 
            onClick={scrollNext} 
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-opacity z-10"
            aria-label="Próximo slide"
          >
            <ArrowRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default PostAssetCarousel;