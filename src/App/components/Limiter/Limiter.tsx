import classNames from "classnames";
import type React from "react"

import styles from "./Limiter.module.scss";

export type LimiterProps = {
    children: React.ReactNode;
    className?: string;
    maxWidth?: number | string;
};

export const Limiter: React.FC<LimiterProps> = ({ children, className, maxWidth = 1440 }) => {
    return (
        <div 
            className={classNames(styles.limiter, className)}
            style={{maxWidth}}
        >
            {children}
        </div>
    )
}