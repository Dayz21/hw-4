import type { FetchFilmsFunc, FilmFiltersConditions, FilmsQueryParams } from "./types/Film";
import { toFilmType, type FilmType } from "@/store/models/Film";
import { toPaginationType } from "@/store/models/Pagination";
import { API } from "./API";
import qs from "qs";

class FilmsAPIClass {
    fetchFilms: FetchFilmsFunc = async (page, pageSize, filters) => {
        const queryParams: FilmsQueryParams = {
            pagination: { page, pageSize },
            populate: ["category", "poster"],
        };

        if (filters) {
            const filterConditions: FilmFiltersConditions = {};

            if (filters.search) {
                filterConditions.title = { $containsi: filters.search };
            }

            if (filters.categories && filters.categories.length > 0) {
                filterConditions.category = {
                    documentId: { $in: filters.categories.map(c => c.key) },
                };
            }

            if (filters.isFeatured !== undefined) {
                filterConditions.isFeatured = { $eq: filters.isFeatured };
            }

            if (filters.releaseYearFrom != null || filters.releaseYearTo != null) {
                filterConditions.releaseYear = {
                    ...(filters.releaseYearFrom != null ? { $gte: filters.releaseYearFrom } : {}),
                    ...(filters.releaseYearTo != null ? { $lte: filters.releaseYearTo } : {}),
                };
            }

            if (filters.ratingFrom != null || filters.ratingTo != null) {
                filterConditions.rating = {
                    ...(filters.ratingFrom != null ? { $gte: filters.ratingFrom } : {}),
                    ...(filters.ratingTo != null ? { $lte: filters.ratingTo } : {}),
                };
            }

            if (filters.durationFrom != null || filters.durationTo != null) {
                filterConditions.duration = {
                    ...(filters.durationFrom != null ? { $gte: filters.durationFrom } : {}),
                    ...(filters.durationTo != null ? { $lte: filters.durationTo } : {}),
                };
            }

            if (filters.ageLimits && filters.ageLimits.length > 0) {
                const ageLimits = filters.ageLimits
                    .map((a) => Number(a.key))
                    .filter((n) => Number.isFinite(n));

                if (ageLimits.length > 0) {
                    filterConditions.ageLimit = { $in: ageLimits };
                }
            }

            if (Object.keys(filterConditions).length > 0) {
                queryParams.filters = filterConditions;
            }

            if (filters.sort && filters.sort.length > 0) {
                queryParams.sort = filters.sort;
            }
        }

        const query = qs.stringify(queryParams, { skipNulls: true });
        const response = await API.get(`/films?${query}`);

        return {
            films: response.data.data.map(toFilmType),
            pagination: toPaginationType(response.data.meta.pagination),
        };
    };

    async fetchFilmById(id: string): Promise<FilmType> {
        const query = qs.stringify({
            populate: ["category", "poster", "gallery"],
        });

        const response = await API.get(`/films/${id}?${query}`);
        return toFilmType(response.data.data);
    }
}

export const FilmsAPI = new FilmsAPIClass();