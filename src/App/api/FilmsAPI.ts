import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import { API } from "./API";
import { toFilmType, type FilmType } from "./types/Film";
import qs from "qs";

class FilmsAPIClass {
    async fetchFilms(page: number, pageSize: number, categories?: Option[], search?: string): Promise<{ films: FilmType[], total: number }> {
        const query = qs.stringify({
            pagination: {
                page,
                pageSize
            },
            populate: [
                "category",
                "poster",
                "gallery",
            ],
            filters: {
                title: {
                    $containsi: search,
                },
                category: {
                    documentId: {
                        $in: categories?.map(category => category.key),
                    }
                }
            }
        });

        const response = await API.get(`/films?${query}`);
        return {
            films: response.data.data.map(toFilmType),
            total: response.data.meta.pagination.total,
        };
    }
}

export const FilmsAPI = new FilmsAPIClass();