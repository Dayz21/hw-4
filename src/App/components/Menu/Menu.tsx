import type React from "react";
import styles from "./Menu.module.scss";
import { Image } from "../Image";
import { NavLink } from "react-router";
import { ROUTES } from "@/config/routes";
import { FavoritesIcon } from "../Icons/FavoritesIcon";
import { AccountIcon } from "../Icons/AccountIcon";
import { Text } from "../Text";
import classNames from "classnames";
import { Limiter } from "../Limiter";

type MenuItemProps = {
    text: string,
    path: string,
};

const MenuItem: React.FC<MenuItemProps> = ({ text, path }) => {
    return (
        <NavLink to={path} className={({isActive}) => classNames(styles.link, {[styles.active]: isActive})}>
        {
            ({isActive}) => (
                <Text 
                    view="p-18" 
                    // weight={isActive ? "bold" : "normal"}
                    color={isActive ? "accent" : "primary"}
                >
                    {text}
                </Text>
            )
        }
        </NavLink>
    );
};

export const Menu: React.FC = () => {
    return (
        <menu className={styles.menu_container}>
            <Limiter className={styles.menu}>
                <Image width={142} height={94} src="/logo.png" className={styles.image} noAnimation />

                <nav className={styles.nav}>
                    <MenuItem text="Фильмы" path={ROUTES.films.get()} />

                    <MenuItem text="Новинки" path={ROUTES.newItems.get()} />
                    
                    <MenuItem text="Подборки" path={ROUTES.collections.get()} />
                </nav>

                <div className={styles.controls}>
                    <NavLink to={ROUTES.favorites.get()} className={styles.link}>
                        <FavoritesIcon size={30} />
                    </NavLink>

                    <NavLink to={ROUTES.account.get()} className={styles.link}>
                        <AccountIcon size={30} />
                    </NavLink>
                </div>
            </Limiter>
        </menu>
    )
};