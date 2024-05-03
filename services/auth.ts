import { useContext } from "react";
import { useAuth } from "../contexts/AuthContext";

type ApiFunction<T, U> = (idToken: string, ...args: U[]) => Promise<T>;

const useAuthFetch = () => {
    const { idToken, refreshToken, setAuthTokens, clearAuthTokens } = useAuth();

    const uniFetch = async <T, U>(apiFunction: ApiFunction<T, U>, ...args: U[]): Promise<T> => {
        try {
            return await apiFunction(idToken || "", ...args);
        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes('401') || error instanceof Error && error.message.includes('403')) { 
                const newTokens = await fetchRefreshToken();
                if (newTokens.id_token) {
                    setAuthTokens({ idToken: newTokens.id_token, refreshToken: newTokens.refresh_token});
                    return await apiFunction(newTokens.id_token, ...args);
                } else {
                    clearAuthTokens();
                    throw new Error('Token refresh failed'); 
                }
            }
            throw error;
        }
    };

    const fetchidToken = async (code: string) => {
        const response = await fetch('https://test-login.softrig.com/connect/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://www.unimicro.no/',
                client_id: 'f4054775-f725-4b21-a047-3dae421f4345',
                client_secret: process.env.EXPO_PUBLIC_CLIENT_SECRET || "",
            }).toString(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch access token');
        }
        return response.json();
    };

    const fetchRefreshToken = async () => {
        const response = await fetch('https://test-login.softrig.com/connect/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken || "",
                client_id: 'f4054775-f725-4b21-a047-3dae421f4345',
                client_secret: process.env.EXPO_PUBLIC_CLIENT_SECRET || "", 
            }).toString(),
        });
        if (!response.ok) {
            clearAuthTokens();
            throw new Error('Failed to refresh token');
        }
        return response.json();
    };

    return { uniFetch, fetchidToken, fetchRefreshToken };
}

export default useAuthFetch;