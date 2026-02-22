import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { MultiDropdown } from "@/components/MultiDropdown";
import { useEffect, useState, useRef } from "react";
import { FilmsAPI } from "@/api/FilmsAPI";
import { Card } from "@/components/Card";
import { CategoriesAPI } from "@/api/CategoriesAPI";
import { toOptionType } from "@/api/types/Category";
import { COUNT_OF_FILMS_ON_PAGE } from "@/config/config";
import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import type { FilmType } from "@/api/types/Film";

import styles from "./FilmsPage.module.scss";
import { CardSkeleton } from "@/components/Card/CardSkeleton";

export const FilmsPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const curSearch = useRef("");

    const [options, setOptions] = useState<Option[]>([]);
    const [filters, setFilters] = useState<Option[]>([]);
    useEffect(() => {
        CategoriesAPI
            .fetchCategories()
            .then(categories => setOptions(categories.map(toOptionType)))
            .catch(console.error);
    }, []);


    const page = useRef(1);
    const [totalFilms, setTotalFilms] = useState(0);
    const [films, setFilms] = useState<FilmType[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        FilmsAPI
            .fetchFilms(page.current, COUNT_OF_FILMS_ON_PAGE)
            .then(({ films, total }) => {
                setFilms(films);
                setTotalFilms(total);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    
    const fetchFilms = (filters?: Option[], search?: string, reset: boolean = false) => {
        FilmsAPI
            .fetchFilms(page.current, COUNT_OF_FILMS_ON_PAGE, filters, search)
            .then(({ films, total }) => {
                setFilms(prev => reset ? films : [...prev, ...films]);
                setTotalFilms(total);
            })
            .catch(console.error);
    }

    const onSearch = () => {
        page.current = 1;
        curSearch.current = search;

        setLoading(true);
        fetchFilms(filters, search, true);
        setLoading(false);
    }

    const onSetFilters = (filters: Option[]) => {
        page.current = 1;
        setFilters(filters);

        setLoading(true);
        fetchFilms(filters, curSearch.current, true);
        setLoading(false);
    }
    
    const triggerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && films.length >= page.current * COUNT_OF_FILMS_ON_PAGE) {
                page.current += 1;
                fetchFilms(filters, curSearch.current);
            }
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        });
        
        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    })

    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Cinema
            </Text>
            
            <Text view="p-20" tag="h2" color="secondary" className={styles.subtitle}>
                Подборка для вечера уже здесь: фильмы, сериалы и новинки. <br/> 
                Найди что посмотреть — за пару секунд.
            </Text>

            <div className={styles.search}>
                <Input value={search} onChange={setSearch} placeholder="Искать фильм" />
                <Button onClick={onSearch} >Найти</Button>
            </div>

            <div className={styles.filters}>
                <MultiDropdown
                    options={options}
                    getTitle={(value) => value.map(el => el.value).join(", ")}
                    value={filters}
                    onChange={onSetFilters}
                    placeholder="Жанры"
                />
            </div>

            <div className={styles.films_title}>
                <Text view="subtitle" weight="bold">Все фильмы</Text>
                <Text view="p-20" color="accent">{totalFilms}</Text>
            </div>

            <div className={styles.films}>
                {
                    !loading ? 
                    films.map(data => (
                        <Card
                            key={data.id}
                            title={data.title}
                            description={data.shortDescription}
                            imageUrl={data.poster.url}
                            genre={data.category.title}
                            releaseYear={data.releaseYear}
                            ageRating={data.ageLimit}
                            rating={data.rating}
                            timing={data.duration}
                        >
                            <Button onClick={() => {}} outlined>В избранное</Button>
                            <Button onClick={() => {}}>Смотреть</Button>
                        </Card>
                    ))
                    :
                    Array.from({ length: COUNT_OF_FILMS_ON_PAGE }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))
                }
            </div>

            <div className={styles.trigger} ref={triggerRef} />
        </>
    );
};