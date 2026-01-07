import { useEffect, useRef, ReactNode, useState } from 'react';

interface IntersectionObserverWrapperProps {
    children: ReactNode;
    threshold?: number;
    rootMargin?: string;
    className?: string;
}

/**
 * Wrapper component that uses Intersection Observer to lazy load children
 * Only renders children when they come into viewport
 */
export const IntersectionObserverWrapper = ({
    children,
    threshold = 0.1,
    rootMargin = '50px',
    className = '',
}: IntersectionObserverWrapperProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, stop observing
                    observer.unobserve(element);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, rootMargin]);

    return (
        <div ref={ref} className={className}>
            {isVisible ? children : <div style={{ minHeight: '200px' }} />}
        </div>
    );
};

export default IntersectionObserverWrapper;
