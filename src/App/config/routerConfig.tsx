import { Navigate, type RouteObject } from "react-router";
import { ROUTES } from "./routes";
import App from "..";
import { TestComponents } from "@/pages/TestComponents/TestComponents";

export const routerConfig: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                // element: <Navigate to={ROUTES.films.path} />,
                element: <TestComponents />,
            },
            {
                path: ROUTES.films.path,
                element: <div>Films</div>,
            },
            {
                path: ROUTES.account.path,
                element: <div>Account</div>,
            },
            {
                path: ROUTES.favorites.path,
                element: <div>Favorites</div>,
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={ROUTES.films.path} />,
    }
]