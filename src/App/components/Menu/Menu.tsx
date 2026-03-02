import type React from "react";
import { Image } from "../Image";
import { Text } from "../Text";
import { Limiter } from "../Limiter";
import { useDisplayWidth } from "@/hooks/useDisplayWidth";
import { TABLET_WIDTH } from "@/config/config";
import { MenuIcon } from "../Icons/MenuIcon";
import { useState } from "react";
import { CloseIcon } from "../Icons/CloseIcon";
import { MenuItem } from "./MenuItem";
import classNames from "classnames";

import styles from "./Menu.module.scss";
import { desktopMenuItems, mobileMenuItems } from "./items";


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
                                    content={item.content}
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
                    {
                        desktopMenuItems.filter(el => !el.isIcon).map(data => (
                            <MenuItem
                                key={data.path}
                                content={data.content}
                                path={data.path}
                            />
                        ))
                    }
                </nav>

                <div className={styles.controls}>
                    {
                        desktopMenuItems.filter(el => el.isIcon).map(data => (
                            <MenuItem
                                key={data.path}
                                content={data.content}
                                path={data.path}
                            />
                        ))
                    }
                </div>
            </Limiter>
        </menu>
    )
};