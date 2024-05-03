import React, { createContext, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

export const SnackbarContext = createContext({
    showSnack: (message: string) => { }
});

export const SnackbarProvider = ({ children }: any) => {
    const [snackMessage, setSnackMessage] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000); 

            return () => clearTimeout(timer);
        }
    }, [visible, snackMessage]);

    const showSnack = (message: string) => {
        setSnackMessage(message);
        setVisible(true);
    };

    const onDismissSnackBar = () => {
        setVisible(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnack }}>
            <View style={styles.container}>
                {children}
                <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                >
                    {snackMessage}
                </Snackbar>
            </View>
        </SnackbarContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
});
