import type { ILocalStore } from "@/hooks/useLocalStore";
import { CategoriesAPI } from "@/api/CategoriesAPI";
import { FilmsAPI } from "@/api/FilmsAPI";
import type { CategoryType } from "@/store/models/Category";
import type { FilmType } from "@/store/models/Film";
import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { COUNT_OF_FILMS_ON_CATEGORIES_PAGE } from "@/config/config";

type CategoryFilmsState = {
    isLoading: boolean;
    films: FilmType[];
};

type PrivateFields = "_categories" | "_isLoading" | "_categoryFilms";

export class CollectionsStore implements ILocalStore {
    private _categories: CategoryType[] = [];
    private _isLoading = false;
    private _categoryFilms: Record<string, CategoryFilmsState> = {};

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _categories: observable.ref,
            _isLoading: observable,
            _categoryFilms: observable.ref,
            categories: computed,
            isLoading: computed,
            categoryFilms: computed,
            init: action.bound,
            fetchCategories: action.bound,
            fetchFilmsForCategories: action.bound,
            destroy: action.bound,
        });
    }

    get categories() {
        return this._categories;
    }

    get isLoading() {
        return this._isLoading;
    }

    get categoryFilms() {
        return this._categoryFilms;
    }

    private getCategoryOption(category: CategoryType): Option {
        return { key: category.documentId, value: category.title };
    }

    getFilms(documentId: string): FilmType[] {
        return this._categoryFilms[documentId]?.films ?? [];
    }

    getCategoryLoading(documentId: string): boolean {
        return this._categoryFilms[documentId]?.isLoading ?? false;
    }

    async init() {
        await this.fetchCategories();
        await this.fetchFilmsForCategories();
    }

    async fetchCategories() {
        this._isLoading = true;

        try {
            const categories = await CategoriesAPI.fetchCategories();
            runInAction(() => {
                this._categories = categories;
            });
        } catch (error) {
            console.error("Failed to fetch collections", error);
        } finally {
            runInAction(() => {
                this._isLoading = false;
            });
        }
    }

    async fetchFilmsForCategories() {
        const categories = this._categories;
        if (categories.length === 0) return;

        runInAction(() => {
            const next: Record<string, CategoryFilmsState> = { ...this._categoryFilms };
            for (const category of categories) {
                const key = category.documentId;
                next[key] = {
                    isLoading: true,
                    films: next[key]?.films ?? [],
                };
            }
            this._categoryFilms = next;
        });

        await Promise.all(
            categories.map(async (category) => {
                try {
                    const option = this.getCategoryOption(category);
                    const { films } = await FilmsAPI.fetchFilms(
                        1,
                        COUNT_OF_FILMS_ON_CATEGORIES_PAGE,
                        { categories: [option] },
                    );

                    runInAction(() => {
                        this._categoryFilms = {
                            ...this._categoryFilms,
                            [category.documentId]: {
                                isLoading: false,
                                films,
                            },
                        };
                    });
                } catch (error) {
                    console.error("Failed to fetch films for category", category.title, error);
                    runInAction(() => {
                        this._categoryFilms = {
                            ...this._categoryFilms,
                            [category.documentId]: {
                                isLoading: false,
                                films: [],
                            },
                        };
                    });
                }
            })
        );
    }

    destroy() {
        this._categories = [];
        this._categoryFilms = {};
        this._isLoading = false;
    }
}
