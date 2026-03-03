import { Input } from "@/components/Input";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Link, useNavigate } from "react-router";
import { ROUTES } from "@/config/routes";
import styles from "./Auth.module.scss";
import { AuthAPI } from "@/api/AuthAPI";

export const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    const handleRegister = async () => {
        try {
            await AuthAPI.register(username, email, password);
            navigate(ROUTES.films.get());
        } catch (error) {
            console.error("Registration error:", error);
        }
    }

    return (
        <div className={styles.auth_page}>
            <Text view="title" tag="h1" weight="bold" align="center" className={styles.title}>Регистрация</Text>

            <div className={styles.auth_inputs}>
                <Input placeholder="Username" label="Имя пользователя" value={username} onChange={setUsername} />
                <Input placeholder="Email" label="Email" value={email} onChange={setEmail} />
                <Input placeholder="Password" type="password" label="Пароль" value={password} onChange={setPassword} />
            </div>

            <Button className={styles.auth_button} onClick={handleRegister}>Зарегистрироваться</Button>
            <Link to={ROUTES.login.get()} className={styles.another_action}>
                <Text view="p-14" color="secondary" align="center" >Уже есть аккаунт? Войдите</Text>
            </Link>
        </div>
    );
}