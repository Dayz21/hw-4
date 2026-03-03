import type React from "react";
import { NavLink } from "react-router";
import { Text } from "../Text";
import classNames from "classnames";

import styles from "./Menu.module.scss";

export type MenuItemProps = {
    content: React.ReactNode,
    path: string,
    isMobile?: boolean,
    isIcon?: boolean,
    onClick?: () => void,
};

export const MenuItem: React.FC<MenuItemProps> = ({ content, path, isMobile, onClick }) => {
    return (
        <NavLink to={path} className={({isActive}) => classNames(styles.link, {[styles.active]: isActive})} onClick={onClick}>
        {
            ({isActive}) => (
                <Text 
                    view={isMobile ? "p-24" : "button"}
                    color={isActive ? "accent" : "primary"}
                >
                    {content}
                </Text>
            )
        }
        </NavLink>
    );
};