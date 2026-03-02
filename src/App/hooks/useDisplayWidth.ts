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