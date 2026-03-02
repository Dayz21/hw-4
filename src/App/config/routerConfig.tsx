import { Navigate, type RouteObject } from "react-router";
import { ROUTES } from "./routes";
import App from "..";

import { TestComponents } from "@/pages/TestComponents";
import { FilmsPage } from "@/pages/FilmsPage";
import { FilmPage } from "@/pages/FilmPage";

export const routerConfig: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to={ROUTES.films.path} />,
            },
            {
                path: ROUTES.films.path,
                children: [
                    {
                        index: true,
                        element: <FilmsPage />
                    },
                    {
                        path: ROUTES.film.path,
                        element: <FilmPage />,
                    }
                ],
            },
            {
                path: ROUTES.account.path,
                element: <div>Account</div>,
            },
            {
                path: ROUTES.favorites.path,
                element: <div>Favorites</div>,
            },
            {
                path: ROUTES.newItems.path,
                element: <div>New Items</div>,
            },
            {
                path: ROUTES.collections.path,
                element: <div>Collections</div>,
            },
            {
                path: ROUTES.components.path,
                element: <TestComponents />,
            },
        ]
    },
    {
        path: "*",
        element: <Navigate to={ROUTES.films.path} />,
    }
]