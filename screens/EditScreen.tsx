import { useReducer, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, BackHandler, KeyboardAvoidingView, Platform } from 'react-native';
import { Contact } from '../types/Contact';
import { TextInput, Button, Text, Dialog, Portal, FAB } from 'react-native-paper';
import { updateContact, deleteContact } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import useAuthFetch from '../services/auth';
import { useSnackbar } from '../hooks/useSnackbar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types/ParamList';
import { LoadingFullScreen } from '../components/loading/LoadingFullScreen';
import ConfirmDialog from '../components/dialog/ConfirmDialog';
import { updateContactObj } from '../utility/updateContactObj';

type EditScreenProps = NativeStackScreenProps<ParamList, 'Edit'>;

interface EditState {
    [key: string]: string;
}

type ActionType = {
    type: string;
    payload: string;
};

const reducer = (state: EditState, action: ActionType): EditState => {
    return { ...state, [action.type]: action.payload };
};

export default function EditScreen({ route, navigation }: EditScreenProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);

    const { showSnack } = useSnackbar();

    const { contact } = route.params;
    const { idToken } = useAuth();
    const queryClient = useQueryClient();

    const { uniFetch } = useAuthFetch();

    const initialState: EditState = {
        name: contact.Info.Name,
        email: contact.Info.DefaultEmail.EmailAddress,
        phone: `${contact.Info.DefaultPhone.CountryCode} ${contact.Info.DefaultPhone.Number}`,
        address1: contact.Info.InvoiceAddress.AddressLine1,
        address2: contact.Info.InvoiceAddress.AddressLine2 ?? '',
        address3: contact.Info.InvoiceAddress.AddressLine3 ?? '',
        postalCode: contact.Info.InvoiceAddress.PostalCode,
        city: contact.Info.InvoiceAddress.City,
        country: contact.Info.InvoiceAddress.Country,
        region: contact.Info.InvoiceAddress.Region,
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleChange = (name: string, value: string) => {
        dispatch({ type: name, payload: value });
    };

    const mutation = useMutation({
        mutationKey: ['update_contact'],
        mutationFn: (updatedContact: Contact) => uniFetch(updateContact, updatedContact),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            queryClient.invalidateQueries({ queryKey: ['contact', contact.ID] });
            navigation.goBack();
        },
        onError: () => {
            showSnack('Error updating contact');
        },
    });

    const handleSave = () => {
        mutation.mutate(updateContactObj(contact, state));
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={handleSave}>Save</Button>
            ),
        });

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (isUnsavedChanges()) {
                setShowUnsavedChangesDialog(true);
                return true;
            }
            return false;
        });

        return () => {
            backHandler.remove();
        };
    }, [handleSave]);

    const isUnsavedChanges = () => {
        return Object.keys(initialState).some((key) => state[key] !== initialState[key]);
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteContact(idToken || "", contact.ID || "");
            queryClient.invalidateQueries({
                queryKey: ['contacts']
            });
            showSnack(`${contact.Info.Name} has been deleted.`);
            setIsDeleting(false);
            navigation.navigate('Home');
        } catch (error) {
            showSnack("Error deleting contact.")
        }
    };

    if (isDeleting) return <LoadingFullScreen message="Deleting" />;

    if (mutation.isPending) return <LoadingFullScreen message="Saving" />;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
        >
            <View style={{ flex: 1, marginHorizontal: 16 }}>
                <ScrollView style={styles.scrollView}>
                    {Object.keys(initialState).map((key) => (
                        <TextInput
                            key={key}
                            style={styles.textInput}
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, match => match.toUpperCase())}
                            value={state[key]}
                            onChangeText={(text) => handleChange(key, text)}
                            mode="outlined"
                        />
                    ))}
                    <View style={{ height: 16}}></View>
                </ScrollView>
                <FAB
                    icon="delete"
                    style={styles.fab}
                    color="white"
                    onPress={() => setShowDeleteConfirmation(true)}
                    accessibilityLabel='Delete contact'
                />
                <ConfirmDialog
                    visible={showDeleteConfirmation}
                    onDismiss={() => setShowDeleteConfirmation(false)}
                    onConfirm={handleDelete}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete ${contact.Info.Name}?`}
                />
                <ConfirmDialog
                    visible={showUnsavedChangesDialog}
                    onDismiss={() => setShowUnsavedChangesDialog(false)}
                    onConfirm={() => navigation.goBack()}
                    title="Unsaved Changes"
                    message="Are you sure you want to leave without saving changes?"
                />
            </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: 'column',
        gap: 8,
        paddingBottom: 8
    },
    textInput: {
        marginTop: 16
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "darkred",
    },
});