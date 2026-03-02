import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { MultiDropdown } from "@/components/MultiDropdown";
import { useEffect, useState } from "react";
import { FilmsWindow } from "./FilmsWIndow";
import { useLocalStore } from "@/hooks/useLocalStore";
import { FilmsStore } from "@/store/FilmsStore";
import { observer } from "mobx-react-lite";
import { useInfinityScroll } from "@/hooks/useInfinityScroll";
import { useSearchParams } from "react-router";
import { reaction, type IReactionDisposer } from "mobx";
import type { Option } from "@/components/MultiDropdown/MultiDropdown";

import styles from "./FilmsPage.module.scss";


export const FilmsPage = observer(() => {
    const filmsStore = useLocalStore(() => new FilmsStore());
    const [searchParams, setSearchParams] = useSearchParams();
    const searchParamsKey = searchParams.toString();

    const [search, setSearch] = useState("");

    useEffect(() => {
        let cancelled = false;
        let dispose: IReactionDisposer | undefined;

        (async () => {
            await filmsStore.fetchCategories();
            if (cancelled) return;

            dispose = reaction(
                () => filmsStore.categories,
                async (availableCategories) => {
                    if (cancelled) return;

                    const params = new URLSearchParams(searchParamsKey);

                    const searchQuery = params.get("search") || "";
                    const categoriesQuery = params.get("categories") || "";
                    const categoryKeys = categoriesQuery ? categoriesQuery.split(",").filter(Boolean) : [];

                    const categoryByKey = new Map(availableCategories.map((c) => [c.key, c] as const));
                    const validatedCategories = categoryKeys
                    .map((key) => categoryByKey.get(key))
                    .filter((v): v is Option => v !== undefined);

                    setSearch(searchQuery);
                    filmsStore.setSearchText(searchQuery);
                    filmsStore.setFilters(validatedCategories);

                    await filmsStore.fetchFilms();
                },
                { fireImmediately: true }
            );
        })();

        return () => {
            cancelled = true;
            dispose?.();
        };
    }, [filmsStore, searchParamsKey]);

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    const handleSearch = () => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                const normalized = search.trim();

                if (normalized) next.set("search", normalized);
                else next.delete("search");

                return next;
            },
            { replace: true }
        );
    };

    const handleSetFilters = (filters: Option[]) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                const categories = filters.map((f) => f.key).filter(Boolean);

                if (categories.length > 0) next.set("categories", categories.join(","));
                else next.delete("categories");

                return next;
            },
            { replace: true }
        );
    };

    const trigger = useInfinityScroll(() => filmsStore.fetchNextFilms());
    const categories = filmsStore.categories;
    const selected = filmsStore.selectedCategories;

    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Cinema
            </Text>
            
            <Text view="p-20" tag="h2" color="secondary" className={styles.subtitle}>
                Подборка для вечера уже здесь: фильмы, сериалы и рекомендации. <br/> 
                Найди что посмотреть — за пару секунд.
            </Text>

            <div className={styles.search}>
                <Input value={search} onChange={setSearch} placeholder="Искать фильм" />
                <Button onClick={handleSearch} >Найти</Button>
            </div>

            <div className={styles.filters}>
                <MultiDropdown
                    options={categories}
                    getTitle={(value) => value.map(el => el.value).join(", ")}
                    value={selected}
                    onChange={handleSetFilters}
                    placeholder="Жанры"
                />
            </div>

            <div className={styles.films_title}>
                <Text view="subtitle" weight="bold">Все фильмы</Text>
                <Text view="p-20" color="accent">{filmsStore.pagination?.total || 0}</Text>
            </div>

            <FilmsWindow films={filmsStore.films} loading={filmsStore.isFilmsLoading} />

            {trigger}
        </>
    );
});
