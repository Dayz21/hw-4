import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import { toFilmType, type FilmType } from "@/store/models/Film";
import { toPaginationType, type PaginationType } from "@/store/models/Pagination";
import { API } from "./API";
import qs from "qs";

export type FetchFilmsProps = {
    page: number,
    pageSize: number,
    categories?: Option[],
    search?: string,
    isFeatured?: boolean
};

export type FetchFilmsResponse = {
    films: FilmType[],
    pagination: PaginationType,
}

class FilmsAPIClass {
    async fetchFilms(props: FetchFilmsProps): Promise<FetchFilmsResponse> {
        const query = qs.stringify({
            pagination: {
                page: props.page,
                pageSize: props.pageSize
            },
            populate: [
                "category",
                "poster",
            ],
            filters: {
                title: {
                    $containsi: props.search,
                },
                category: {
                    documentId: {
                        $in: props.categories?.map(category => category.key),
                    }
                },
                ...(props.isFeatured !== undefined && { isFeatured: { $eq: props.isFeatured } }),
            }
        }, { skipNulls: true });

        const response = await API.get(`/films?${query}`);
        return {
            films: response.data.data.map(toFilmType),
            pagination: toPaginationType(response.data.meta.pagination),
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