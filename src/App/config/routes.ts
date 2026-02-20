export const ROUTES = {
    films: {
        path: "/films",
        get: () => "/films",
    },

    film: {
        path: "/films/:id",
        get: (id: string) => `/films/${id}`,
    },

    account: {
        path: "/account",
        get: () => "/account",
    },

    favorites: {
        path: "/favorites",
        get: () => "/favorites",
    }
}