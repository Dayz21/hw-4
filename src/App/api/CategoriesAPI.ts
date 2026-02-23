import { API } from "./API";
import { toCategoryType } from "./types/Category";
import { type FilmType } from "./types/Film";

class CategoriesAPIClass {
    async fetchCategories(): Promise<FilmType[]> {
        const response = await API.get(`/film-categories`);
        return response.data.data.map(toCategoryType);
    }
}

export const CategoriesAPI = new CategoriesAPIClass();