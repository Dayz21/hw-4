import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import { API } from "./API";
import { toFilmType, type FilmType } from "./types/Film";
import qs from "qs";

class FilmsAPIClass {
    async fetchFilms(page: number, pageSize: number, categories?: Option[], search?: string, isFeatured?: boolean): Promise<{ films: FilmType[], total: number }> {
        const query = qs.stringify({
            pagination: {
                page,
                pageSize
            },
            populate: [
                "category",
                "poster",
            ],
            filters: {
                title: {
                    $containsi: search,
                },
                category: {
                    documentId: {
                        $in: categories?.map(category => category.key),
                    }
                },
                isFeatured: isFeatured !== undefined ? { $eq: isFeatured } : undefined,
            }
        });

        const response = await API.get(`/films?${query}`);
        return {
            films: response.data.data.map(toFilmType),
            total: response.data.meta.pagination.total,
        };
    }

    async fetchFilmById(id: string): Promise<FilmType> {
        const query = qs.stringify({
            populate: [
                "category",
                "poster",
                "gallery",
            ],
        });

        const response = await API.get(`/films/${id}?${query}`);
        return toFilmType(response.data.data);
    }
}

export const FilmsAPI = new FilmsAPIClass();