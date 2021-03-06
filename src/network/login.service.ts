import { Emitter } from "../util/emitter";
import { urlPrefix } from "./entity.service";

export class LoginService {
    static localStorageKey = 'token';

    token: string | null = localStorage.getItem(LoginService.localStorageKey);

    loggedInEv = new Emitter<void>();

    public async login(username: string, password: string) {
        const response = await fetch(`${urlPrefix}/api-token-auth/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username, password
            })
        });

        const json = await response.json();
        this.token = json.token;
        localStorage.setItem(LoginService.localStorageKey, json.token);

        this.loggedInEv.emit();

        return this.token;
    }

    logout() {
        this.token = null;
    }

    public async register(username: string, password: string) {
        const response = await fetch(`${urlPrefix}/api-token-auth/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username, password
            })
        });

        const json = await response.json();
        this.token = json.token;
        localStorage.setItem(LoginService.localStorageKey, json.token);

        this.loggedInEv.emit();

        return this.token;
    }

    loggedIn(): boolean {
        return !!this.token;
    }

    getToken(): string | null {
        return this.token;
    }
}

export const loginService = new LoginService();