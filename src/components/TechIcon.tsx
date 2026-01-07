import { ImgHTMLAttributes } from 'react';

interface TechIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    name: string;
    size?: number;
    className?: string;
}

/**
 * Tech Icon component - serves local SVG icons instead of external skillicons.dev
 * Falls back to skillicons.dev if local icon not available
 */
export const TechIcon = ({
    name,
    size = 40,
    className = '',
    ...props
}: TechIconProps) => {
    const iconName = name.toLowerCase();

    // Try local icon first, fallback to skillicons.dev
    const localSrc = `/icons/${iconName}.svg`;
    const fallbackSrc = `https://skillicons.dev/icons?i=${iconName}&theme=dark`;

    return (
        <img
            src={localSrc}
            alt={`${name} icon`}
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            className={className}
            onError={(e) => {
                // Fallback to skillicons.dev if local icon not found
                const target = e.target as HTMLImageElement;
                target.src = fallbackSrc;
            }}
            {...props}
        />
    );
};

/**
 * Tech Icons Group - displays multiple tech icons
 * More efficient than loading from skillicons.dev
 */
interface TechIconsGroupProps {
    icons: string[];
    size?: number;
    className?: string;
}

export const TechIconsGroup = ({
    icons,
    size = 40,
    className = ''
}: TechIconsGroupProps) => {
    return (
        <div className={`flex gap-2 flex-wrap ${className}`}>
            {icons.map((icon) => (
                <TechIcon
                    key={icon}
                    name={icon}
                    size={size}
                />
            ))}
        </div>
    );
};

export default TechIcon;
