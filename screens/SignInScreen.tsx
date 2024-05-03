import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import WebView from 'react-native-webview';
import useAuthFetch from '../services/auth';

export default function SignInScreen() {
    const auth = useAuth();
    const { fetchidToken } = useAuthFetch();

    const [authCode, setAuthCode] = useState('');
    const [showWebView, setShowWebView] = useState(true);

    const authUrl = 'https://test-login.softrig.com/connect/authorize?client_id=f4054775-f725-4b21-a047-3dae421f4345&redirect_uri=https://www.unimicro.no/&response_type=code&prompt=login&scope=AppFramework%20profile%20openid%20offline_access&state=test';

    const handleNavigationChange = (navState: any) => {
        const { url } = navState;
        if (url.includes('https://www.unimicro.no/') && url.includes('code=')) {
            const code = new URLSearchParams(new URL(url).search).get('code');
            if (code) {
                setAuthCode(code);
                setShowWebView(false);
            }
        }
    };

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['todos'],
        queryFn: () => fetchidToken(authCode),
        enabled: !!authCode,
    })

    useEffect(() => {
        if (data?.token_type == 'Bearer') {
            auth.setAuthTokens({ idToken: data.id_token, refreshToken: data.refresh_token })
        }
    }, [data])

    return (
        <View style={{ flex: 1 }}>
            {showWebView ? (
                <WebView
                    source={{ uri: authUrl }}
                    style={{ flex: 1 }}
                    onNavigationStateChange={handleNavigationChange}
                />
            ) : (
                <ActivityIndicator animating={true} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                </ActivityIndicator>
            )}
        </View>
    );
}