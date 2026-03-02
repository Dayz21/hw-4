import type React from "react";
import styles from "./Image.module.scss";
import classNames from "classnames";
import { useState } from "react";

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string;
    alt?: string;
    className?: string;
    width?: number | string;
    height?: number | string;
    aspect?: number;
    noAnimation?: boolean;
};

export const Image: React.FC<ImageProps> = ({ width = "100%", height, aspect = 1, src, alt, className, noAnimation, ...props }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div 
            className={classNames(
                styles.image_container, 
                className,
                {
                    [styles.loading]: !noAnimation && (loading || error),
                    [styles.no_animation]: noAnimation,
                }
            )}
        
            style={{ 
                width, 
                height, 
                aspectRatio: width && height ? undefined : aspect 
            }}
        >
            <img 
                src={src} 
                alt={alt} 
                className={styles.image} 
                onLoad={() => setLoading(false)}
                onError={() => setError(true)}
                {...props}
            />
        </div>
    );
}