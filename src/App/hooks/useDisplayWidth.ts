import { DESKTOP_WIDTH, LAPTOP_WIDTH, TABLET_WIDTH } from "@/config/config";
import { useEffect, useState } from "react";

export const useDisplayWidth = () => {
    const [displayWidth, setDisplayWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setDisplayWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    return displayWidth;
}

export const useCardsCount = () => {
    const displayWidth = useDisplayWidth();
    if (displayWidth >= DESKTOP_WIDTH) {
        return 3;
    } else if (displayWidth >= LAPTOP_WIDTH) {
        return 2;
    } else if (displayWidth >= TABLET_WIDTH) {
        return 2;
    } else {
        return 1;
    }
}