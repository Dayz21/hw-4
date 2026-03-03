import { Navigate, type RouteObject } from "react-router";
import { ROUTES } from "./routes";
import App from "..";

import { TestComponents } from "@/pages/TestComponents";
import { FilmsPage } from "@/pages/FilmsPage";
import { FilmPage } from "@/pages/FilmPage";
import { LoginPage, RegisterPage } from "@/pages/Auth";
import { AccountPage } from "@/pages/AccountPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { RecommendationsPage } from "@/pages/RecommendationsPage";
import { CollectionsPage } from "@/pages/CollectionsPage";

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
                element: <AccountPage />,
            },
            {
                path: ROUTES.favorites.path,
                element: <FavoritesPage />,
            },
            {
                path: ROUTES.recommendations.path,
                element: <RecommendationsPage />,
            },
            {
                path: ROUTES.collections.path,
                element: <CollectionsPage />,
            },
            {
                path: ROUTES.components.path,
                element: <TestComponents />,
            },
        ]
    },
    {
        path: ROUTES.login.path,
        element: <LoginPage />,
    },
    {
        path: ROUTES.register.path,
        element: <RegisterPage />,
    },
    {
        path: "*",
        element: <Navigate to={ROUTES.films.path} />,
    }
]