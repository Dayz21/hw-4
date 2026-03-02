import { useNavigate } from "react-router";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { ROUTES } from "@/config/routes";
import { observer } from "mobx-react-lite";
import { rootStore } from "@/store/rootStore";

import styles from "./AccountPage.module.scss";

export const AccountPage: React.FC = observer(() => {
    const navigate = useNavigate();

    const user = rootStore.userStore.user;
    const isLoading = rootStore.userStore.isLoading;
    const isAuthorized = rootStore.userStore.isAuthorized;

    const handleLogout = async () => {
        await rootStore.userStore.logout();
        navigate(ROUTES.login.get());
    };

    if (!isAuthorized && !isLoading) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Аккаунт
                </Text>

                <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                    Войдите, чтобы увидеть данные профиля.
                </Text>

                <div className={styles.actions}>
                    <Button onClick={() => navigate(ROUTES.login.get())}>Войти</Button>
                    <Button outlined onClick={() => navigate(ROUTES.register.get())}>Регистрация</Button>
                </div>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Аккаунт
                </Text>

                <div className={styles.center}>
                    <Loader />
                </div>
            </>
        );
    }

    if (!isAuthorized || user === null) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Аккаунт
                </Text>

                <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                    Не получилось загрузить профиль. Попробуйте войти заново.
                </Text>

                <div className={styles.actions}>
                    <Button onClick={handleLogout}>Выйти</Button>
                    <Button outlined onClick={() => navigate(ROUTES.login.get())}>Войти снова</Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Аккаунт
            </Text>

            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Данные профиля и быстрые действия.
            </Text>

            <div className={styles.card}>
                <div className={styles.row}>
                    <Text view="p-20" weight="medium">Имя пользователя</Text>
                    <Text view="p-20" color="secondary">{user.username}</Text>
                </div>

                <div className={styles.row}>
                    <Text view="p-20" weight="medium">Email</Text>
                    <Text view="p-20" color="secondary">{user.email}</Text>
                </div>

                <div className={styles.actions}>
                    <Button onClick={() => navigate(ROUTES.favorites.get())}>Избранное</Button>
                    <Button outlined onClick={handleLogout}>Выйти</Button>
                </div>
            </div>
        </>
    );
});
