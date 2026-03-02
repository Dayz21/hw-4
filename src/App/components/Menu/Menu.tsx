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
import { useDisplayWidth } from "@/hooks/useDisplayWidth";
import { TABLET_WIDTH } from "@/config/config";
import { MenuIcon } from "../Icons/MenuIcon";
import { useState } from "react";
import { CloseIcon } from "../Icons/CloseIcon";

type MenuItemProps = {
    text: string,
    path: string,
    isMobile?: boolean,
    onClick?: () => void,
};

const MenuItem: React.FC<MenuItemProps> = ({ text, path, isMobile, onClick }) => {
    return (
        <NavLink to={path} className={({isActive}) => classNames(styles.link, {[styles.active]: isActive})} onClick={onClick}>
        {
            ({isActive}) => (
                <Text 
                    view={isMobile ? "p-24" : "button"}
                    color={isActive ? "accent" : "primary"}
                >
                    {text}
                </Text>
            )
        }
        </NavLink>
    );
};

const mobileMenuItems: MenuItemProps[] = [
    { text: "Фильмы", path: ROUTES.films.get() },
    { text: "Новинки", path: ROUTES.newItems.get() },
    { text: "Подборки", path: ROUTES.collections.get() },
    { text: "Избранное", path: ROUTES.favorites.get() },
    { text: "Аккаунт", path: ROUTES.account.get() },
];

export const Menu: React.FC = () => {
    const displayWidth = useDisplayWidth();
    const [visibleMobileMenu, setVisibleMobileMenu] = useState(false);

    if (displayWidth < TABLET_WIDTH) {
        return (
            <menu className={styles.menu_container}>
                <Limiter className={styles.menu}>
                    <Image width={142} height={94} src="/logo.png" className={styles.image} noAnimation />

                    <MenuIcon 
                        size={48} 
                        onClick={() => setVisibleMobileMenu(prev => !prev)}
                    />

                    <div className={classNames(
                        styles.mobile_menu, 
                        {[styles.active]: visibleMobileMenu}
                    )}>
                        <Text view="subtitle" weight="bold" className={styles.menu_title}>Меню</Text>
                        <CloseIcon size={48} className={styles.close_icon} onClick={() => setVisibleMobileMenu(false)} />

                        {
                            mobileMenuItems.map(item => (
                                <MenuItem 
                                    key={item.path}
                                    text={item.text}
                                    path={item.path}
                                    onClick={() => setVisibleMobileMenu(false)}
                                    isMobile
                                />
                            ))
                        }
                    </div>
                </Limiter>
            </menu>
        );
    }

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