import { useReducer, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';
import useAuthFetch from '../services/auth';
import { createNewContact } from '../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types/ParamList';
import { LoadingFullScreen } from '../components/loading/LoadingFullScreen';
import { useSnackbar } from '../hooks/useSnackbar';

type NewContactScreenProps = NativeStackScreenProps<ParamList, 'New contact'>;

interface EditState {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    address1: string;
    address2?: string;
    address3?: string;
    postalCode: string;
    city: string;
    country: string;
    region: string;
}

type ActionType = {
    type: keyof EditState;
    payload: string;
};

const reducer = (state: EditState, action: ActionType): EditState => {
    return { ...state, [action.type]: action.payload };
};

export default function NewContactScreen({ navigation }: NewContactScreenProps) {
    const [isSaving, setIsSaving] = useState(false);

    const queryClient = useQueryClient();

    const { uniFetch } = useAuthFetch();

    const { showSnack } = useSnackbar();

    const initialState: EditState = {
        name: '',
        email: '',
        phone: '',
        countryCode: '',
        address1: '',
        address2: '',
        address3: '',
        postalCode: '',
        city: '',
        country: '',
        region: '',
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleChange = (name: keyof EditState, value: string) => {
        dispatch({ type: name, payload: value });
    };

    const handleSave = async () => {
        const newContact: any = {
            Info: {
                Name: state.name,
                DefaultPhone: {
                    CountryCode: state.countryCode,
                    Number: state.phone
                },
                DefaultEmail: {
                    EmailAddress: state.email
                },
                InvoiceAddress: {
                    AddressLine1: state.address1,
                    AddressLine2: state.address2,
                    AddressLine3: state.address3,
                    City: state.city,
                    Country: state.country,
                    PostalCode: state.postalCode,
                    Region: state.region
                }
            }
        };

        try {
            setIsSaving(true);
            await uniFetch(createNewContact, newContact);
            setIsSaving(false);
            queryClient.invalidateQueries({
                queryKey: ['contacts']
            });
            navigation.goBack();
        } catch (error) {
            setIsSaving(false);
            showSnack('Creating contact failed.')
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={handleSave}>Save</Button>
            ),
        });
    }, [handleSave]);

    if (isSaving) return <LoadingFullScreen message="Saving" />

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, paddingBottom: 16 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
        >
            <ScrollView style={styles.scrollView}>
                {Object.keys(initialState).map((key) => (
                    <TextInput
                        key={key}
                        style={styles.textInput}
                        label={key.replace(/([A-Z])/g, ' $1').replace(/^./, match => match.toUpperCase())}
                        value={state[key as keyof EditState]}
                        onChangeText={(text) => handleChange(key as keyof EditState, text)}
                        mode="outlined"
                    />
                ))}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginHorizontal: 16,
        flexDirection: 'column',
        gap: 8
    },
    textInput: {
        marginTop: 16
    },
});