import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Text } from "@/components/Text";
import { useLocalStore } from "@/hooks/useLocalStore";
import { useInfinityScroll } from "@/hooks/useInfinityScroll";
import { FilmsWindow } from "@/pages/FilmsPage/FilmsWIndow";
import { RecommendationsStore } from "@/store/RecommendationsStore";

import styles from "./RecommendationsPage.module.scss";

export const RecommendationsPage: React.FC = observer(() => {
    const store = useLocalStore(() => new RecommendationsStore());

    useEffect(() => {
        store.fetchFilms();
    }, [store]);

    const trigger = useInfinityScroll(() => store.fetchNextFilms());

    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Рекомендации
            </Text>

            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Подборка избранных фильмов, которые стоит посмотреть.
            </Text>

            <div className={styles.films_title}>
                <Text view="subtitle" weight="bold">Все рекомендации</Text>
                <Text view="p-20" color="accent">{store.pagination?.total || 0}</Text>
            </div>

            <FilmsWindow films={store.films} loading={store.isLoading} />

            {trigger}
        </>
    );
});
