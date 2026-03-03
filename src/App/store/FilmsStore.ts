import type { ILocalStore } from "@/hooks/useLocalStore";
import type { FilmType } from "./models/Film";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { FilmsAPI } from "@/api/FilmsAPI";
import type { PaginationType } from "./models/Pagination";
import type { CategoryType } from "./models/Category";
import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import { CategoriesAPI } from "@/api/CategoriesAPI";
import { COUNT_OF_FILMS_ON_PAGE } from "@/config/config";

type private_fields =
    | "_films"
    | "_pagination"
    | "_categories"
    | "_selectedCategories"
    | "_selectedAgeLimits"
    | "_search"
    | "_isFilmsLoading"
    | "_releaseYearFrom"
    | "_releaseYearTo"
    | "_ratingFrom"
    | "_ratingTo"
    | "_durationFrom"
    | "_durationTo";

export class FilmsStore implements ILocalStore {
    private _films: FilmType[] = [];
    private _categories: CategoryType[] = []
    private _selectedCategories: Option[] = [];
    private _selectedAgeLimits: Option[] = [];
    private _pagination: PaginationType | null = null;
    private _search: string = "";
    private _isFilmsLoading = false;

    private _releaseYearFrom: number | null = null;
    private _releaseYearTo: number | null = null;
    private _ratingFrom: number | null = null;
    private _ratingTo: number | null = null;
    private _durationFrom: number | null = null;
    private _durationTo: number | null = null;

    constructor() {
        makeObservable<this, private_fields>(this, {
            _films: observable.ref,
            _pagination: observable.ref,
            _categories: observable.ref,
            _selectedCategories: observable.ref,
            _selectedAgeLimits: observable.ref,
            _search: observable,
            _isFilmsLoading: observable,

            _releaseYearFrom: observable,
            _releaseYearTo: observable,
            _ratingFrom: observable,
            _ratingTo: observable,
            _durationFrom: observable,
            _durationTo: observable,

            films: computed,
            pagination: computed,
            categories: computed,
            selectedCategories: computed,
            selectedAgeLimits: computed,
            isFilmsLoading: computed,
            search: computed,
            releaseYearFrom: computed,
            releaseYearTo: computed,
            ratingFrom: computed,
            ratingTo: computed,
            durationFrom: computed,
            durationTo: computed,

            fetchFilms: action.bound,
            fetchNextFilms: action.bound,
            fetchCategories: action.bound,
            setFilters: action.bound,
            setAgeLimits: action.bound,
            setSearchText: action.bound,
            setAdvancedFilters: action.bound,
            setReleaseYearFrom: action.bound,
            setReleaseYearTo: action.bound,
            setRatingFrom: action.bound,
            setRatingTo: action.bound,
            setDurationFrom: action.bound,
            setDurationTo: action.bound,
        });
    }

    get films() {
        return this._films;
    }

    get pagination() {
        return this._pagination;
    }

    get search() {
        return this._search;
    }

    get releaseYearFrom() {
        return this._releaseYearFrom;
    }

    get releaseYearTo() {
        return this._releaseYearTo;
    }

    get ratingFrom() {
        return this._ratingFrom;
    }

    get ratingTo() {
        return this._ratingTo;
    }

    get durationFrom() {
        return this._durationFrom;
    }

    get durationTo() {
        return this._durationTo;
    }

    get categories(): Option[] {
        return this._categories.map(el => ({
            key: el.documentId,
            value: el.title,
        }));
    }

    get selectedCategories(): Option[] {
        return this._selectedCategories;
    }

    get selectedAgeLimits(): Option[] {
        return this._selectedAgeLimits;
    }

    get isFilmsLoading() {
        return this._isFilmsLoading;
    }

    setSearchText(text: string = "") {
        this._search = text;
    }

    setFilters(options: Option[] = []) {
        this._selectedCategories = options;
    }

    setAgeLimits(options: Option[] = []) {
        this._selectedAgeLimits = options;
    }

    setAdvancedFilters(filters: {
        releaseYearFrom?: number | null;
        releaseYearTo?: number | null;
        ratingFrom?: number | null;
        ratingTo?: number | null;
        durationFrom?: number | null;
        durationTo?: number | null;
    }) {
        this._releaseYearFrom = filters.releaseYearFrom ?? null;
        this._releaseYearTo = filters.releaseYearTo ?? null;
        this._ratingFrom = filters.ratingFrom ?? null;
        this._ratingTo = filters.ratingTo ?? null;
        this._durationFrom = filters.durationFrom ?? null;
        this._durationTo = filters.durationTo ?? null;
    }

    setReleaseYearFrom(value: number | null) {
        this._releaseYearFrom = value;
    }

    setReleaseYearTo(value: number | null) {
        this._releaseYearTo = value;
    }

    setRatingFrom(value: number | null) {
        this._ratingFrom = value;
    }

    setRatingTo(value: number | null) {
        this._ratingTo = value;
    }

    setDurationFrom(value: number | null) {
        this._durationFrom = value;
    }

    setDurationTo(value: number | null) {
        this._durationTo = value;
    }

    async fetchFilms(page = 1, pageSize = COUNT_OF_FILMS_ON_PAGE) {
        const selectedCategories = this._selectedCategories;
        const search = this._search;
        const selectedAgeLimits = this._selectedAgeLimits;

        this._isFilmsLoading = true;

        try {
            const { films, pagination } = await FilmsAPI.fetchFilms(
                page,
                pageSize,
                {
                    categories: selectedCategories,
                    search: search,
                    ageLimits: selectedAgeLimits,

                    releaseYearFrom: this._releaseYearFrom,
                    releaseYearTo: this._releaseYearTo,
                    ratingFrom: this._ratingFrom,
                    ratingTo: this._ratingTo,
                    durationFrom: this._durationFrom,
                    durationTo: this._durationTo,
                }
            );
            runInAction(() => {
                this._films = films;
                this._pagination = pagination;
            });
        } catch (error) {
            console.error("Failed to fetch films:", error);
        } finally {
            runInAction(() => {
                this._isFilmsLoading = false;
            });
        }
    }

    async fetchNextFilms() {
        if (!this._pagination || this._pagination.page >= this._pagination.pageCount) return;
        const nextPage = this._pagination.page + 1;
        try {
            const { films, pagination } = await FilmsAPI.fetchFilms(
                nextPage,
                this._pagination.pageSize,
                {
                    categories: this._selectedCategories,
                    search: this._search,
                    ageLimits: this._selectedAgeLimits,

                    releaseYearFrom: this._releaseYearFrom,
                    releaseYearTo: this._releaseYearTo,
                    ratingFrom: this._ratingFrom,
                    ratingTo: this._ratingTo,
                    durationFrom: this._durationFrom,
                    durationTo: this._durationTo,
                }
            );
            runInAction(() => {
                this._films = [...this._films, ...films];
                this._pagination = pagination;
            });
        } catch (error) {
            console.error("Failed to fetch next films:", error);
        }
    }

    async fetchCategories(force = false) {
        if (!force && this._categories.length > 0) return;
        try {
            const categories = await CategoriesAPI.fetchCategories();
            runInAction(() => {
                this._categories = categories;
            });
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    }

    destroy() {
        this._films = [];
        this._pagination = null;
        this._selectedCategories = [];
        this._selectedAgeLimits = [];
        this._search = "";
        this._isFilmsLoading = false;

        this._releaseYearFrom = null;
        this._releaseYearTo = null;
        this._ratingFrom = null;
        this._ratingTo = null;
        this._durationFrom = null;
        this._durationTo = null;
    }
}