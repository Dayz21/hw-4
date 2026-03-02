import { API } from "./API";
import { toUserType, type UserType } from "@/store/models/User";

class AuthAPIClass {
    async login(identifier: string, password: string): Promise<void> {
        const response = await API.post(`/auth/local`, {
            identifier,
            password,
        });
        localStorage.setItem("token", response.data.jwt);
    }

    async register(username: string, email: string, password: string): Promise<void> {
        const response = await API.post(`/auth/local/register`, {
            username,
            email,
            password,
        });
        localStorage.setItem("token", response.data.jwt);
    }

    async logout(): Promise<void> {
        localStorage.removeItem("token");
    }

    async me(): Promise<UserType> {
        const response = await API.get(`/users/me`);
        return toUserType(response.data);
    }
}

export const AuthAPI = new AuthAPIClass();