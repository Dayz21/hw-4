import { useNavigate, useParams } from "react-router";
import { BackButton } from "./components/BackButton";
import { ROUTES } from "@/config/routes";
import { useEffect, useState } from "react";
import { FilmsAPI } from "@/api/FilmsAPI";
import { StarIcon } from "@/components/Icons/StarIcon/StarIcon";
import { Text } from "@/components/Text";
import { getFormattedTime } from "@/utils/getFormattedTime";
import { VideoFrame } from "@/components/VideoFrame";
import { COUNT_OF_RECOMMENDATIONS } from "@/config/config";
import { CardsSlider } from "./components/CardsSlider";
import type { FilmType } from "@/api/types/Film";

import styles from "./FilmPage.module.scss";
import { ImagesSlider } from "./components/ImagesSlider";



export const FilmPage: React.FC = () => {
    const navigate = useNavigate();
    const { filmId } = useParams();
    const [film, setFilm] = useState<FilmType | null>(null);

    useEffect(() => {
        if (!filmId) return;

        FilmsAPI
            .fetchFilmById(filmId)
            .then(setFilm)
            .catch(console.error);
    }, [filmId]);

    const [recommendations, setRecommendations] = useState<FilmType[]>([]);
    useEffect(() => {
        FilmsAPI
            .fetchFilms(1, COUNT_OF_RECOMMENDATIONS, undefined, undefined, true)
            .then(({ films }) => setRecommendations(films))
            .catch(console.error);
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [film]);

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
                    
                <CardsSlider 
                    cards={recommendations}
                    onCardClick={(film) => {
                        if (film.documentId === filmId) return;
                        setFilm(null);
                        navigate(ROUTES.film.get(film.documentId));
                    }} 
                />
            </div>
        </>
    );
}