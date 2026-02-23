import type React from "react";
import { ArrowRightIcon } from "@/components/Icons/ArrowRightIcon";
import styles from "./ControlButtons.module.scss";

export type ControlButtonsProps = {
    onClick: () => void;
};

export const FrontControlButton: React.FC<ControlButtonsProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className={styles.nav_button_right}>
            <ArrowRightIcon size={30} />
        </button>
    );
}

export const BackControlButton: React.FC<ControlButtonsProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className={styles.nav_button_left}>
            <ArrowRightIcon size={30} angle={180} />
        </button>
    );
}