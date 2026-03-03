import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { ROUTES } from "@/config/routes";
import { FilmsCarousel } from "@/components/FilmsCarousel";
import { observer } from "mobx-react-lite";
import { useLocalStore } from "@/hooks/useLocalStore";
import { CollectionsStore } from "@/store/CollectionsStore";

import styles from "./CollectionsPage.module.scss";

export const CollectionsPage: React.FC = observer(() => {
    const navigate = useNavigate();

    const store = useLocalStore(() => new CollectionsStore());

    useEffect(() => {
        store.init();
    }, [store]);

    return (
        <div className={styles.page}>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Подборки
            </Text>

            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Выберите жанр — откроется подборка фильмов по категории.
            </Text>

            {store.isLoading ? (
                <div className={styles.center}>
                    <Loader />
                </div>
            ) : (
                <div className={styles.list}>
                    {store.categories.map((category) => {
                        const films = store.getFilms(category.documentId);
                        const loading = store.getCategoryLoading(category.documentId);

                        return (
                            <div key={category.documentId} className={styles.category}>
                                <div className={styles.header}>
                                    <Text view="subtitle" weight="bold">{category.title}</Text>
                                    <Button
                                        outlined
                                        onClick={() => navigate(`${ROUTES.films.get()}?categories=${category.documentId}`)}
                                    >
                                        Смотреть все
                                    </Button>
                                </div>

                                {loading ? (
                                    <FilmsCarousel films={[]} loading />
                                ) : films.length === 0 ? (
                                    <Text view="p-20" color="secondary" className={styles.empty}>
                                        В этой категории пока нет фильмов.
                                    </Text>
                                ) : (
                                    <FilmsCarousel
                                        films={films}
                                        onFilmClick={(film) => navigate(ROUTES.film.get(film.documentId))}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
});
