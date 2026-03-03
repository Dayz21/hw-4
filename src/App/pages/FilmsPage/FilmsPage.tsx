import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { MultiDropdown } from "@/components/MultiDropdown";
import { NumberInput } from "@/components/NumberInput";
import { useEffect } from "react";
import { FilmsWindow } from "./FilmsWIndow";
import { useLocalStore } from "@/hooks/useLocalStore";
import { FilmsStore } from "@/store/FilmsStore";
import { observer } from "mobx-react-lite";
import { useInfinityScroll } from "@/hooks/useInfinityScroll";
import { useSearchParams } from "react-router";
import { reaction, type IReactionDisposer } from "mobx";
import type { Option } from "@/components/MultiDropdown/MultiDropdown";

import styles from "./FilmsPage.module.scss";

import { parseNumberParam } from "@/utils/numberInput";

import {
    AGE_LIMIT_OPTIONS,
    DURATION_MAX,
    DURATION_MIN,
    RATING_MAX,
    RATING_MIN,
    YEAR_MAX,
    YEAR_MIN,
} from "@/config/config";


export const FilmsPage = observer(() => {
    const filmsStore = useLocalStore(() => new FilmsStore());
    const [searchParams, setSearchParams] = useSearchParams();
    const searchParamsKey = searchParams.toString();

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

                    const yearFromQuery = parseNumberParam(params.get("yearFrom"));
                    const yearToQuery = parseNumberParam(params.get("yearTo"));
                    const ratingFromQuery = parseNumberParam(params.get("ratingFrom"));
                    const ratingToQuery = parseNumberParam(params.get("ratingTo"));
                    const durationFromQuery = parseNumberParam(params.get("durationFrom"));
                    const durationToQuery = parseNumberParam(params.get("durationTo"));

                    const ageLimitsQuery = params.get("ageLimits") || "";
                    const ageLimitKeys = ageLimitsQuery ? ageLimitsQuery.split(",").filter(Boolean) : [];

                    const categoryByKey = new Map(availableCategories.map((c) => [c.key, c] as const));
                    const validatedCategories = categoryKeys
                    .map((key) => categoryByKey.get(key))
                    .filter((v): v is Option => v !== undefined);

                    const ageLimitByKey = new Map(AGE_LIMIT_OPTIONS.map((o) => [o.key, o] as const));
                    const validatedAgeLimits = ageLimitKeys
                        .map((key) => ageLimitByKey.get(key))
                        .filter((v): v is Option => v !== undefined);

                    filmsStore.setSearchText(searchQuery);
                    filmsStore.setFilters(validatedCategories);

                    filmsStore.setAgeLimits(validatedAgeLimits);
                    filmsStore.setAdvancedFilters({
                        releaseYearFrom: yearFromQuery,
                        releaseYearTo: yearToQuery,
                        ratingFrom: ratingFromQuery,
                        ratingTo: ratingToQuery,
                        durationFrom: durationFromQuery,
                        durationTo: durationToQuery,
                    });

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
                const normalized = filmsStore.search.trim();

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

    const handleSetAgeLimits = (limits: Option[]) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                const keys = limits.map((l) => l.key).filter(Boolean);

                if (keys.length > 0) next.set("ageLimits", keys.join(","));
                else next.delete("ageLimits");

                return next;
            },
            { replace: true }
        );
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const yf = filmsStore.releaseYearFrom;
            const yt = filmsStore.releaseYearTo;
            const rf = filmsStore.ratingFrom;
            const rt = filmsStore.ratingTo;
            const df = filmsStore.durationFrom;
            const dt = filmsStore.durationTo;

            setSearchParams(
                (prev) => {
                    const prevString = prev.toString();
                    const next = new URLSearchParams(prev);

                    const setOrDelete = (key: string, value: number | null) => {
                        if (value == null) next.delete(key);
                        else next.set(key, String(value));
                    };

                    setOrDelete("yearFrom", yf);
                    setOrDelete("yearTo", yt);
                    setOrDelete("ratingFrom", rf);
                    setOrDelete("ratingTo", rt);
                    setOrDelete("durationFrom", df);
                    setOrDelete("durationTo", dt);

                    const nextString = next.toString();
                    return nextString === prevString ? prev : next;
                },
                { replace: true }
            );
        }, 400);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        filmsStore.releaseYearFrom,
        filmsStore.releaseYearTo,
        filmsStore.ratingFrom,
        filmsStore.ratingTo,
        filmsStore.durationFrom,
        filmsStore.durationTo,
        setSearchParams,
    ]);

    const trigger = useInfinityScroll(() => filmsStore.fetchNextFilms());
    const categories = filmsStore.categories;
    const selected = filmsStore.selectedCategories;
    const selectedAgeLimits = filmsStore.selectedAgeLimits;

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
                <Input value={filmsStore.search} onChange={filmsStore.setSearchText} placeholder="Искать фильм" />
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

                <MultiDropdown
                    options={AGE_LIMIT_OPTIONS}
                    getTitle={(value) => value.map((el) => el.value).join(", ")}
                    value={selectedAgeLimits}
                    onChange={handleSetAgeLimits}
                    placeholder="Возраст"
                />
            </div>

            <div className={styles.range_filters}>
                <div className={styles.range_group}>
                    <Text view="p-14" color="secondary">Год</Text>
                    <div className={styles.range_pair}>
                        <NumberInput
                            value={filmsStore.releaseYearFrom}
                            onChange={filmsStore.setReleaseYearFrom}
                            placeholder="от"
                            min={YEAR_MIN}
                            max={YEAR_MAX}
                            kind="int"
                        />
                        <NumberInput
                            value={filmsStore.releaseYearTo}
                            onChange={filmsStore.setReleaseYearTo}
                            placeholder="до"
                            min={YEAR_MIN}
                            max={YEAR_MAX}
                            kind="int"
                        />
                    </div>
                </div>

                <div className={styles.range_group}>
                    <Text view="p-14" color="secondary">Рейтинг</Text>
                    <div className={styles.range_pair}>
                        <NumberInput
                            value={filmsStore.ratingFrom}
                            onChange={filmsStore.setRatingFrom}
                            placeholder="от"
                            step="0.1"
                            min={RATING_MIN}
                            max={RATING_MAX}
                            kind="float"
                        />
                        <NumberInput
                            value={filmsStore.ratingTo}
                            onChange={filmsStore.setRatingTo}
                            placeholder="до"
                            step="0.1"
                            min={RATING_MIN}
                            max={RATING_MAX}
                            kind="float"
                        />
                    </div>
                </div>

                <div className={styles.range_group}>
                    <Text view="p-14" color="secondary">Длительность, мин</Text>
                    <div className={styles.range_pair}>
                        <NumberInput
                            value={filmsStore.durationFrom}
                            onChange={filmsStore.setDurationFrom}
                            placeholder="от"
                            min={DURATION_MIN}
                            max={DURATION_MAX}
                            kind="int"
                        />
                        <NumberInput
                            value={filmsStore.durationTo}
                            onChange={filmsStore.setDurationTo}
                            placeholder="до"
                            min={DURATION_MIN}
                            max={DURATION_MAX}
                            kind="int"
                        />
                    </div>
                </div>
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
