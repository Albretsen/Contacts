import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'react-native-paper';
import { ParamList } from '../types/ParamList';

import HomeScreen from './HomeScreen';
import ViewScreen from './ViewScreen';
import EditScreen from './EditScreen';
import NewContactScreen from './NewContactScreen';
import SignInScreen from './SignInScreen';

const Stack = createNativeStackNavigator<ParamList>();

export const AppNavigator = () => {
    const { idToken, clearAuthTokens } = useAuth();

    const renderHomeScreen = () => (
        <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
                headerRight: () => (
                    <Button onPress={clearAuthTokens}>Sign out</Button>
                ),
            }}
        />
    );

    const renderAuthScreens = () => (
        <>
            {renderHomeScreen()}
            <Stack.Screen name="View" component={ViewScreen} />
            <Stack.Screen name="Edit" component={EditScreen} />
            <Stack.Screen name="New contact" component={NewContactScreen} />
        </>
    );

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                {idToken ? renderAuthScreens() : <Stack.Screen name="Sign in" component={SignInScreen} />}
            </Stack.Navigator>
        </NavigationContainer>
    );
};