import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { useRef } from "react";
import { observer } from "mobx-react-lite";

import type { FilmType } from "@/store/models/Film";
import { Card } from "@/components/Card/Card";
import { CardSkeleton } from "@/components/Card/CardSkeleton";
import { Button } from "@/components/Button/Button";
import { BackControlButton, FrontControlButton } from "@/components/CarouselControls";
import { rootStore } from "@/store/rootStore";

import "swiper/css";
import styles from "./FilmsCarousel.module.scss";

export type FilmsCarouselProps = {
    films: FilmType[];
    loading?: boolean;
    onFilmClick?: (film: FilmType) => void;
};

export const FilmsCarousel: React.FC<FilmsCarouselProps> = observer(({ films, loading = false, onFilmClick }) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const isAuthorized = rootStore.userStore.isAuthorized;

    const showSkeletons = loading;

    return (
        <div className={styles.container}>
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                spaceBetween={10}
                slidesPerView={1}
                loop
                resizeObserver
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    1400: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                }}
            >
                {showSkeletons
                    ? Array(6)
                          .fill(0)
                          .map((_, index) => (
                              <SwiperSlide key={index}>
                                  <CardSkeleton />
                              </SwiperSlide>
                          ))
                    : films.map((film) => (
                          <SwiperSlide key={film.id}>
                              <Card
                                  title={film.title}
                                  description={film.description}
                                  imageUrl={film.poster.url}
                                  genre={film.category.title}
                                  releaseYear={film.releaseYear}
                                  ageRating={film.ageLimit}
                                  rating={film.rating}
                                  timing={film.duration}
                                  onClick={() => onFilmClick?.(film)}
                              >
                                  {isAuthorized && (
                                      <Button onClick={() => rootStore.favoritesStore.toggleFavorite(film.id)} outlined>
                                          {rootStore.favoritesStore.contains(film.id) ? "В избранном" : "В избранное"}
                                      </Button>
                                  )}
                                  <Button onClick={() => onFilmClick?.(film)}>Смотреть</Button>
                              </Card>
                          </SwiperSlide>
                      ))}
            </Swiper>

            <BackControlButton onClick={() => swiperRef.current?.slidePrev()} />
            <FrontControlButton onClick={() => swiperRef.current?.slideNext()} />
        </div>
    );
});
