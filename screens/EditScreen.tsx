import { useReducer, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, BackHandler } from 'react-native';
import { Contact } from '../types/Contact';
import { TextInput, Button, Text, Dialog, Portal } from 'react-native-paper';
import { updateContact, deleteContact } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import useAuthFetch from '../services/auth';
import { useSnackbar } from '../hooks/useSnackbar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types/ParamList';
import { LoadingFullScreen } from '../components/loading/LoadingFullScreen';

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
        const updatedContact: Contact = {
            ID: contact.ID,
            Info: {
                ...contact.Info,
                Name: state.name,
                DefaultPhone: {
                    ...contact.Info.DefaultPhone,
                    CountryCode: state.phone.split(' ')[0],
                    Number: state.phone.split(' ')[1]
                },
                DefaultEmail: {
                    ...contact.Info.DefaultEmail,
                    EmailAddress: state.email
                },
                InvoiceAddress: {
                    ...contact.Info.InvoiceAddress,
                    AddressLine1: state.address1,
                    AddressLine2: state.address2,
                    AddressLine3: state.address3,
                    PostalCode: state.postalCode,
                    City: state.city,
                    Country: state.country,
                    Region: state.region
                }
            }
        };

        mutation.mutate(updatedContact);
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
                <Button style={{ borderRadius: 8, marginVertical: 16 }} buttonColor="darkred" icon="delete" mode="contained" onPress={() => setShowDeleteConfirmation(true)}>
                    Delete
                </Button>
            </ScrollView>
            <Portal>
                <Dialog visible={showDeleteConfirmation} onDismiss={() => setShowDeleteConfirmation(false)}>
                    <Dialog.Title>Confirm Deletion</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete {contact.Info.Name}?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowDeleteConfirmation(false)}>Cancel</Button>
                        <Button onPress={handleDelete}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={showUnsavedChangesDialog} onDismiss={() => setShowUnsavedChangesDialog(false)}>
                    <Dialog.Title>Unsaved Changes</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to leave without saving changes?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowUnsavedChangesDialog(false)}>Cancel</Button>
                        <Button onPress={() => navigation.goBack()}>Leave</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: 'column',
        gap: 8
    },
    textInput: {
        marginTop: 16
    }
});
