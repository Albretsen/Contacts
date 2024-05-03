import { PaperProvider } from 'react-native-paper';
import { SnackbarProvider } from './providers/SnackbarProvider';
import { AuthProvider } from './contexts/AuthContext';

import { AppNavigator } from './screens/AppNavigator';
import { theme } from './styles/theme';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <SnackbarProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </SnackbarProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}