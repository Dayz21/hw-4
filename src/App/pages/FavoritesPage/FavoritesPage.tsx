import { observer } from "mobx-react-lite";
import { Text } from "@/components/Text";
import { rootStore } from "@/store/rootStore";
import { Loader } from "@/components/Loader";
import { FilmsWindow } from "@/pages/FilmsPage/FilmsWIndow";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router";
import { ROUTES } from "@/config/routes";

import styles from "./FavoritesPage.module.scss";

export const FavoritesPage: React.FC = observer(() => {
    const navigate = useNavigate();
    const isUserLoading = rootStore.userStore.isLoading;
    const isAuthorized = rootStore.userStore.isAuthorized;

    const favorites = rootStore.favoritesStore.favorites;
    const isLoading = rootStore.favoritesStore.isLoading;

    if (isUserLoading) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Избранное
                </Text>

                <div className={styles.center}>
                    <Loader />
                </div>
            </>
        );
    }

    if (!isAuthorized) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Избранное
                </Text>

                <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                    Войдите в аккаунт, чтобы видеть сохранённые фильмы.
                </Text>

                <div className={styles.actions}>
                    <Button onClick={() => navigate(ROUTES.login.get())}>Войти</Button>
                    <Button outlined onClick={() => navigate(ROUTES.register.get())}>Регистрация</Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Избранное
            </Text>

            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Здесь собраны фильмы, которые вы добавили в избранное.
            </Text>

            <div className={styles.favorites_title}>
                <Text view="subtitle" weight="bold">Все избранные</Text>
                <Text view="p-20" color="accent">{favorites.length}</Text>
            </div>

            {isLoading ? (
                <div className={styles.center}>
                    <Loader />
                </div>
            ) : favorites.length === 0 ? (
                <Text view="p-20" className={styles.empty} color="secondary">
                    Пока пусто — добавьте что-нибудь в избранное на странице фильмов.
                </Text>
            ) : (
                <FilmsWindow films={favorites.map((f) => f.film)} loading={false} />
            )}
        </>
    );
});
