import React, { useCallback, useState } from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator } from 'react-native-paper';
import ContactListItem from './ContactListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchContacts } from '../../services/api';
import useAuthFetch from '../../services/auth';
import { validateAndNormalizeContacts } from '../../utility/validation';

interface ContactListProps {
    navigation: NativeStackNavigationProp<any>;
    searchQuery: string
}

export default function ContactList({ navigation, searchQuery }: ContactListProps) {
    const { idToken } = useAuth();
    const { uniFetch } = useAuthFetch();
    const queryClient = useQueryClient();

    const [refreshing, setRefreshing] = useState(false);

    const { data: contacts, error, isLoading } = useQuery({
        queryKey: ['contacts', searchQuery],
        queryFn: () => uniFetch(fetchContacts, searchQuery),
        select: data => validateAndNormalizeContacts(data),
        enabled: !!idToken
    });

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        queryClient.invalidateQueries({
            queryKey: ['contacts', searchQuery]
        }).finally(() => {
            setRefreshing(false);
        });
    }, [queryClient, searchQuery]);

    if (isLoading) return <ActivityIndicator animating={true} style={{ margin: 16 }} />;
    if (error) return <Text style={{ margin: 16 }}>An error occurred: {error.message}</Text>;

    return (
        <View style={{ flex: 1 }}>
            <FlashList
                data={contacts}
                renderItem={({ item }) => <ContactListItem contact={item} navigation={navigation} />}
                keyExtractor={(item, index) => `contact-${index}`}
                estimatedItemSize={100}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
}