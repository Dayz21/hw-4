import type { ILocalStore } from "@/hooks/useLocalStore";
import type { FilmType } from "./models/Film";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { FilmsAPI } from "@/api/FilmsAPI";
import type { PaginationType } from "./models/Pagination";
import type { CategoryType } from "./models/Category";
import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import { CategoriesAPI } from "@/api/CategoriesAPI";
import { COUNT_OF_FILMS_ON_PAGE } from "@/config/config";

type private_fields = "_films" | "_pagination" | "_categories" | "_selectedCategories" | "_search" | "_isFilmsLoading";

export class FilmsStore implements ILocalStore {
    private _films: FilmType[] = [];
    private _categories: CategoryType[] = []
    private _selectedCategories: Option[] = [];
    private _pagination: PaginationType | null = null;
    private _search: string = "";
    private _isFilmsLoading = false;

    constructor() {
        makeObservable<this, private_fields>(this, {
            _films: observable.ref,
            _pagination: observable.ref,
            _categories: observable.ref,
            _selectedCategories: observable.ref,
            _search: observable,
            _isFilmsLoading: observable,

            films: computed,
            pagination: computed,
            categories: computed,
            selectedCategories: computed,
            isFilmsLoading: computed,

            fetchFilms: action.bound,
            fetchNextFilms: action.bound,
            fetchCategories: action.bound,
            setFilters: action.bound,
            setSearchText: action.bound,
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

    get categories(): Option[] {
        return this._categories.map(el => ({
            key: el.documentId,
            value: el.title,
        }));
    }

    get selectedCategories(): Option[] {
        return this._selectedCategories;
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

    async fetchFilms(page = 1, pageSize = COUNT_OF_FILMS_ON_PAGE) {
        const selectedCategories = this._selectedCategories;
        const search = this._search;

        this._isFilmsLoading = true;

        try {
            const { films, pagination } = await FilmsAPI.fetchFilms({
                page,
                pageSize,
                categories: selectedCategories,
                search: search,
            });
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
            const { films, pagination } = await FilmsAPI.fetchFilms({
                page: nextPage,
                pageSize: this._pagination.pageSize,
                categories: this._selectedCategories,
                search: this._search,
            });
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
        this._search = "";
        this._isFilmsLoading = false;
    }
}