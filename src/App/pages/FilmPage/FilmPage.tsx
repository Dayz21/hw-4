import { useNavigate, useParams } from "react-router";
import { BackButton } from "./components/BackButton";
import { ROUTES } from "@/config/routes";
import { useEffect } from "react";
import { StarIcon } from "@/components/Icons/StarIcon/StarIcon";
import { Text } from "@/components/Text";
import { getFormattedTime } from "@/utils/getFormattedTime";
import { VideoFrame } from "@/components/VideoFrame";
import { FilmsCarousel } from "@/components/FilmsCarousel";
import { ImagesSlider } from "./components/ImagesSlider";
import { useLocalStore } from "@/hooks/useLocalStore";
import { FilmStore } from "@/store/FilmStore";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/Button";
import { rootStore } from "@/store/rootStore";

import styles from "./FilmPage.module.scss";


export const FilmPage: React.FC = observer(() => {
    const navigate = useNavigate();
    const { filmId } = useParams();
    const filmStore = useLocalStore(() => new FilmStore());

    useEffect(() => {
        if (!filmId) return;
        filmStore.fetchFilm(filmId);
    }, [filmId, filmStore]);

    useEffect(() => {
        filmStore.fetchRecommendations();
    }, [filmStore]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [filmStore.film]);
    
    const film = filmStore.film;
    const recommendations = filmStore.recommendations;
    const isAuthorized = rootStore.userStore.isAuthorized;

    return (
        <>
            <BackButton
                className={styles.back_button} 
                onClick={() => navigate(ROUTES.films.get())} 
            />

            <div className={styles.film}>
                <VideoFrame src={film?.trailerUrl} title={film?.title} />

                <div className={styles.info}>
                    {
                        film !== null ?
                        <div className={styles.info_header}>
                            <Text view="subtitle" weight="bold" tag="h1">{film?.title}</Text>
                            <div className={styles.rating}>
                                <Text view="p-24" weight="medium">{film?.rating}</Text>
                                <StarIcon color="original" size={24} />
                            </div>
                        </div>
                        :
                        <div className={styles.title_skeleton} />
                    }

                    {film !== null && isAuthorized && (
                        <div className={styles.actions}>
                            <Button onClick={() => rootStore.favoritesStore.toggleFavorite(film.id)} outlined>
                                {rootStore.favoritesStore.contains(film.id) ? "В избранном" : "В избранное"}
                            </Button>
                        </div>
                    )}

                    {
                        film !== null ?
                        <div className={styles.brief}>
                            <Text view="p-20" weight="medium">{film?.releaseYear}</Text>
                            <Text view="p-20" weight="medium">•</Text>
                            <Text view="p-20" weight="medium">{film?.category.title}</Text>
                            <Text view="p-20" weight="medium">•</Text>
                            <Text view="p-20" weight="medium">{film?.ageLimit}+</Text>
                            <Text view="p-20" weight="medium">•</Text>
                            <Text view="p-20" weight="medium">{getFormattedTime(film?.duration || 0)}</Text>
                        </div>
                        :
                        <div className={styles.brief_skeleton} />
                    }

                    {
                        film !== null ?
                        <Text view="p-20" color="secondary">{film?.description}</Text>
                        :
                        <div className={styles.description_skeleton_container}>
                            <div className={styles.description_skeleton} />
                            <div className={styles.description_skeleton} />
                            <div className={styles.description_skeleton} />
                            <div className={styles.description_skeleton} />
                            <div className={styles.description_skeleton} />
                        </div>
                    }
                </div>
            </div>

            <div className={styles.images_slider_container}>
                <Text view="subtitle" weight="bold" className={styles.recomendations_title}>Галерея</Text>

                <ImagesSlider images={film?.gallery?.map((image) => image.url) || []} />
            </div>

            <div className={styles.recomendations_container}>
                <Text view="subtitle" weight="bold" className={styles.recomendations_title}>Рекомендации</Text>
                    
                <FilmsCarousel
                    films={recommendations}
                    loading={filmStore.isRecommendationsLoading}
                    onFilmClick={(film) => {
                        if (film.documentId === filmId) return;
                        filmStore.resetFilm();
                        navigate(ROUTES.film.get(film.documentId));
                    }} 
                />
            </div>
        </>
    );
});