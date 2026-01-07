import { useState, useEffect, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    className?: string;
}

/**
 * Optimized Image component with WebP support and lazy loading
 * Automatically serves WebP if available, falls back to original format
 */
export const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    priority = false,
    className = '',
    ...props
}: OptimizedImageProps) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasWebP, setHasWebP] = useState(false);

    useEffect(() => {
        // Check if WebP version exists
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

        const checkWebP = async () => {
            try {
                const response = await fetch(webpSrc, { method: 'HEAD' });
                if (response.ok) {
                    setHasWebP(true);
                    setImageSrc(webpSrc);
                }
            } catch {
                // WebP not available, use original
                setImageSrc(src);
            }
        };

        checkWebP();
    }, [src]);

    return (
        <picture>
            {hasWebP && (
                <source srcSet={imageSrc} type="image/webp" />
            )}
            <img
                src={imageSrc}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className={className}
                {...props}
            />
        </picture>
    );
};

export default OptimizedImage;
