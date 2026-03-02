import { Input } from "@/components/Input";
import styles from "./Auth.module.scss";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Link, useNavigate } from "react-router";
import { ROUTES } from "@/config/routes";
import { AuthAPI } from "@/api/AuthAPI";

export const LoginPage: React.FC = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            await AuthAPI.login(identifier, password);
            navigate(ROUTES.films.get());
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return (
        <div className={styles.auth_page}>
            <Text view="title" tag="h1" weight="bold" align="center" className={styles.title}>Вход</Text>

            <div className={styles.auth_inputs}>
                <Input placeholder="Username or Email" label="Имя пользователя или email" value={identifier} onChange={setIdentifier} />
                <Input placeholder="Password" type="password" label="Пароль" value={password} onChange={setPassword} />
            </div>

            <Button className={styles.auth_button} onClick={handleLogin}>Войти</Button>
            <Link to={ROUTES.register.get()} className={styles.another_action}>
                <Text view="p-14" color="secondary" align="center" >Нет аккаунта? Зарегистрируйтесь</Text>
            </Link>
        </div>
    );
}