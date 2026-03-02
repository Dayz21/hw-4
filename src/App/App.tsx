import { Outlet } from "react-router";
import { Menu } from "@/components/Menu";
import { Limiter } from "@/components/Limiter";
import { useFavorites } from "./hooks/useFavorites";
import { useEffect } from "react";
import { rootStore } from "@/store/rootStore";

import "@styles/page.scss";
import "@styles/zero.scss";

const App = () => {
    useEffect(() => {
        rootStore.userStore.fetchMe();
    }, []);

    useFavorites();

    return (
        <div className="page">
            <Menu />
            <Limiter>
                <Outlet />
            </Limiter>
        </div>
    );
}

export default App;