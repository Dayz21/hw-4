import { Outlet } from "react-router";
import { Menu } from "./components/Menu";

import "@styles/page.scss";
import "@styles/zero.scss";
import { Limiter } from "./components/Limiter";

const App = () => {
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