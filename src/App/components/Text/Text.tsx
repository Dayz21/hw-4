import * as React from 'react'

import styles from './Text.module.scss';
import classNames from 'classnames';

export type TextProps = React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
    view?: 'title' | 'subtitle' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
    tag?:  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
    weight?: 'normal' | 'medium' | 'bold';
    children: React.ReactNode;
    color?: 'primary' | 'secondary' | 'accent';
    maxLines?: number;
};

export const Text: React.FC<TextProps> = ({ className, children, weight, color, view = 'p-16', tag: Tag = 'div', maxLines = 0 }) => {
    return (
        <Tag 
            className={classNames(
                styles.text,
                styles[view],
                {
                    [styles[weight || "normal"]]: !!weight,
                    [styles[color || "primary"]]: !!color,
                },
                className
            )}
        
            style={{
                WebkitLineClamp: maxLines > 0 ? maxLines : "none",
                lineClamp: maxLines > 0 ? maxLines : "none",
            }}
        >
            {children}
        </Tag>
    );
}
