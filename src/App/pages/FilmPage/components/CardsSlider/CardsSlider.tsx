import { Swiper } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { FilmType } from "@/api/types/Film";
import { SwiperSlide } from "swiper/react";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { useRef } from "react";
import { ArrowRightIcon } from "@/components/Icons/ArrowRightIcon";

import "swiper/css";
import styles from "./CardsSlider.module.scss";
import { CardSkeleton } from "@/components/Card/CardSkeleton";

type CardsSliderProps = {
    cards: FilmType[];
    onCardClick?: (film: FilmType) => void;
}

export const CardsSlider: React.FC<CardsSliderProps> = ({ cards, onCardClick }) => {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className={styles.container}>
            <Swiper
                onSwiper={(swiper) => swiperRef.current = swiper}
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
                {
                    cards.length > 0 ?
                    cards.map(film => (
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
                                onClick={() => onCardClick?.(film)}
                            >
                                <Button onClick={() => {}} outlined>В избранное</Button>
                                <Button onClick={() => onCardClick?.(film)}>Смотреть</Button>
                            </Card>
                        </SwiperSlide>
                    ))
                    :
                    Array(3).fill(0).map((_, index) => (
                        <SwiperSlide key={index}>
                            <CardSkeleton />
                        </SwiperSlide>
                    ))
                }
            </Swiper>

            <button onClick={() => swiperRef.current?.slidePrev()} className={styles.nav_button_left}>
                <ArrowRightIcon size={30} angle={180} />
            </button>

            <button onClick={() => swiperRef.current?.slideNext()} className={styles.nav_button_right}>
                <ArrowRightIcon size={30} />
            </button>
        </div>
    );
}