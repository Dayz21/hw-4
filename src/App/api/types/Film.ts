import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import { toCategoryType, type CategoryReponseType, type CategoryType } from "./Category";
import { toImageType, type ImageResponseType, type ImageType } from "./Image";
import type { PaginationType } from "@/store/models/Pagination";

export type FilmResponseType = {
    id: number,
    documentId: string,
    title: string,
    description: string,
    shortDescription: string,
    releaseYear: number,
    duration: number,
    rating: number,
    ageLimit: number,
    isFeatured: boolean,
    slug: string,
    trailerUrl: string,
    category: CategoryReponseType,
    poster: ImageResponseType,
    gallery?: ImageResponseType[],
};

export type FilmType = {
    id: number,
    documentId: string,
    title: string,
    description: string,
    shortDescription: string,
    releaseYear: number,
    duration: number,
    rating: number,
    ageLimit: number,
    isFeatured: boolean,
    slug: string,
    trailerUrl: string,
    category: CategoryType,
    poster: ImageType,
    gallery: ImageType[],
};

export const toFilmType = (response: FilmResponseType): FilmType => ({
    id: response.id,
    documentId: response.documentId,
    title: response.title,
    description: response.description,
    shortDescription: response.shortDescription,
    releaseYear: response.releaseYear,
    duration: response.duration,
    rating: response.rating,
    ageLimit: response.ageLimit,
    isFeatured: response.isFeatured,
    slug: response.slug,
    trailerUrl: response.trailerUrl,
    category: toCategoryType(response.category),
    poster: toImageType(response.poster),
    gallery: response.gallery?.map(toImageType) || [],
});


export type FetchFilmsFunc = (
    page: number,
    pageSize: number,
    filters?: FilmFiltersType,
) => Promise<FetchFilmsResponse>;

export type FilmFiltersType = {
    categories?: Option[],
    search?: string,
    isFeatured?: boolean,

    releaseYearFrom?: number | null,
    releaseYearTo?: number | null,
    ratingFrom?: number | null,
    ratingTo?: number | null,
    durationFrom?: number | null,
    durationTo?: number | null,

    ageLimits?: Option[],

    sort?: string[],
}

export type FetchFilmsResponse = {
    films: FilmType[],
    pagination: PaginationType,
}

export type FilmFiltersConditions = {
    title?: { $containsi: string };
    category?: { documentId: { $in: string[] } };
    isFeatured?: { $eq: boolean };

    releaseYear?: { $gte?: number; $lte?: number };
    rating?: { $gte?: number; $lte?: number };
    duration?: { $gte?: number; $lte?: number };
    ageLimit?: { $in: number[] };
};

export type FilmsQueryParams = {
    pagination: { page: number; pageSize: number };
    populate: string[];
    filters?: FilmFiltersConditions;
    sort?: string[];
};