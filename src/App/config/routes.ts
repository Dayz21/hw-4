export const ROUTES = {
    components: {
        path: "/components",
        get: () => "/components",
    },

    films: {
        path: "/films",
        get: () => "/films",
    },

    film: {
        path: "/films/:filmId",
        get: (id: string) => `/films/${id}`,
    },

    newItems: {
        path: "/new",
        get: () => "/new",
    },

    collections: {
        path: "/collections",
        get: () => "/collections",
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