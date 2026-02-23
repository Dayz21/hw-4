import { Image } from "@/components/Image";
import { Swiper, SwiperSlide } from "swiper/react";
import { BackControlButton, FrontControlButton } from "../ControlButtons";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import styles from "./ImagesSlider.module.scss";

export type ImagesSliderProps = {
    images: string[];
    className?: string;
}

export const ImagesSlider: React.FC<ImagesSliderProps> = ({ images, className }) => {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div style={{position: "relative"}}>
            <Swiper
                className={className}
                spaceBetween={10}
                slidesPerView={1}
                onSwiper={(swiper) => swiperRef.current = swiper}
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
                resizeObserver
                loop
            >
                {
                    images.length > 0 ?
                    images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image src={image} width="100%" aspect={16 / 9} className={styles.image} />
                        </SwiperSlide>
                    ))
                    :
                    Array(3).fill(0).map((_, index) => (
                        <SwiperSlide key={index}>
                            <div className={styles.image_skeleton} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>

            <FrontControlButton onClick={() => swiperRef.current?.slideNext()} />
            <BackControlButton onClick={() => swiperRef.current?.slidePrev()} />
        </div>
    );
}