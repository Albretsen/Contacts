import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  idToken: string | null;
  refreshToken: string | null;
  setAuthTokens: (tokens: { idToken: string, refreshToken: string }) => void;
  clearAuthTokens: () => void;
}

const AuthContext = createContext<AuthContextType>({
  idToken: null,
  refreshToken: null,
  setAuthTokens: () => {},
  clearAuthTokens: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [idToken, setidToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Load tokens from secure storage
  useEffect(() => {
    const loadTokens = async () => {
      const storedidToken = await SecureStore.getItemAsync('idToken');
      const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
      if (storedidToken && storedRefreshToken) {
        setidToken(storedidToken);
        setRefreshToken(storedRefreshToken);
      }
    };

    loadTokens();
  }, []);

  const setAuthTokens = async (tokens: { idToken: string, refreshToken: string }) => {
    await SecureStore.setItemAsync('idToken', tokens.idToken);
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
    setidToken(tokens.idToken);
    setRefreshToken(tokens.refreshToken);
  };

  const clearAuthTokens = async () => {
    await SecureStore.deleteItemAsync('idToken');
    await SecureStore.deleteItemAsync('refreshToken');
    setidToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ idToken, refreshToken, setAuthTokens, clearAuthTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);