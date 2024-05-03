import { View, StyleSheet } from 'react-native';
import { Avatar, Text, FAB, Button } from 'react-native-paper';
import ContactButtons from '../components/buttons/ContactButton';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchContact } from '../services/api';
import useAuthFetch from '../services/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types/ParamList';
import { validateAndNormalizeContact } from '../utility/validation';
import { LoadingFullScreen } from '../components/loading/LoadingFullScreen';

type ViewScreenProps = NativeStackScreenProps<ParamList, 'View'>;

export default function ViewScreen({ route, navigation}: ViewScreenProps) {
    const { uniFetch } = useAuthFetch();

    const [contact, setContact] = useState(route.params.contact);

    const { data, isLoading } = useQuery({
        queryKey: ['contact', contact?.ID], 
        queryFn: () => uniFetch(fetchContact, contact?.ID),
    });

    useEffect(() => {
        if (data) setContact(validateAndNormalizeContact(data));
    }, [data])

    const renderAddress = () => {
        if (!contact.Info.InvoiceAddress) return null;
    
        const { AddressLine1, City, Region, Country, PostalCode } = contact.Info.InvoiceAddress;
    
        const addressParts = [
            AddressLine1.trim(),
            `${PostalCode ? PostalCode + ',' : ''} ${City}`.trim(),
            Region.trim(),
            Country.trim()
        ].filter(Boolean).join('\n');
    
        if (!addressParts.trim()) return null;
    
        return (
            <View style={{ marginTop: 16 }}>
                <Text variant='bodyLarge'>Address</Text>
                <Text variant='bodyMedium'>{addressParts}</Text>
            </View>
        );
    };

    const renderEmail = () => {
        if (!contact.Info.DefaultEmail.EmailAddress) return null;
        return (
            <View style={{ marginTop: 16 }}>
                <Text variant='bodyLarge'>Email</Text>
                <Text variant='bodyMedium'>{contact.Info.DefaultEmail.EmailAddress}</Text>
            </View>
        );
    };

    const renderPhone = () => {
        if (!contact.Info.DefaultPhone.Number) return null;
        return (
            <View style={{ marginTop: 16 }}>
                <Text variant='bodyLarge'>Phone</Text>
                <Text variant='bodyMedium'>{`${contact.Info.DefaultPhone.CountryCode} ${contact.Info.DefaultPhone.Number}`.trim()}</Text>
            </View>
        );
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => navigation.navigate('Edit', { contact })}>Edit</Button>
            ),
        });
    }, [contact]);

    if (isLoading) {
        return <LoadingFullScreen message={"Loading " + route.params.contact.Info.Name}/>
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                alignItems: 'center',
                gap: 16,
                margin: 32,
            }}>
                <Avatar.Text size={100} label={"A"} />
                <Text variant="headlineSmall">{contact.Info.Name}</Text>
            </View>
            <View style={{
                marginHorizontal: 16
            }}>
                <ContactButtons contact={contact} />
                {renderEmail()}
                {renderPhone()}
                {renderAddress()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})