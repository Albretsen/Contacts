import React from 'react';
import { Portal, Dialog, Button, Text } from 'react-native-paper';

interface ConfirmDialogProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

function ConfirmDialog(props: ConfirmDialogProps) {
    const { visible, onDismiss, onConfirm, title, message } = props;

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text>{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={onConfirm}>Confirm</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default ConfirmDialog;