import type React from "react";
import type { FilmType } from "@/store/models/Film";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { CARD_HEIGHT, COUNT_OF_FILMS_ON_PAGE } from "@/config/config";
import { ROUTES } from "@/config/routes";
import { useCardsCount } from "@/hooks/useDisplayWidth";
import { useNavigate } from "react-router";
import { CardSkeleton } from "@/components/Card/CardSkeleton";
import { List, type RowComponentProps} from "react-window";
import { observer } from "mobx-react-lite";

import styles from "./FilmsPage.module.scss";
import { rootStore } from "@/store/rootStore";

const FilmRow = observer(({data, index, style}: RowComponentProps<{ data: FilmType[][] }>) => {
    const navigate = useNavigate();
    const films = data[index];
    const isAuthorized = rootStore.userStore.isAuthorized;

    return (
        <div style={style} className={styles.films_row}>
            {
                films.map(film => (
                    <Card
                        key={film.id}
                        title={film.title}
                        description={film.description}
                        imageUrl={film.poster.url}
                        genre={film.category.title}
                        releaseYear={film.releaseYear}
                        ageRating={film.ageLimit}
                        rating={film.rating}
                        timing={film.duration}
                    >
                        {isAuthorized && (
                            <Button onClick={() => rootStore.favoritesStore.toggleFavorite(film.id)} outlined>
                                {rootStore.favoritesStore.contains(film.id) ? "В избранном" : "В избранное"}
                            </Button>
                        )}
                        <Button onClick={() => navigate(ROUTES.film.get(film.documentId))}>Смотреть</Button>
                    </Card>
                ))
            }
        </div>
    );
});

export type FilmsWindowProps = {
    films: FilmType[];
    loading: boolean;
}

export const FilmsWindow: React.FC<FilmsWindowProps> = ({ films, loading }) => {
    const count = useCardsCount();
    const rows = Math.ceil(films.length / count);
    const data = Array.from({ length: rows }, (_, index) => {
        const start = index * count;
        return films.slice(start, start + count);
    });

    if (loading) {
        return (
            <div className={styles.films_skeleton}>
                {
                    Array.from({ length: COUNT_OF_FILMS_ON_PAGE }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))
                }
            </div>
        )
    }
    
    return (
        <List
            className={styles.films}
            rowComponent={FilmRow}
            rowCount={rows}
            rowHeight={CARD_HEIGHT}
            rowProps={{ data }}
        />
    );
}
