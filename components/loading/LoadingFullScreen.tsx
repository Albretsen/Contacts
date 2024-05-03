import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export const LoadingFullScreen = ({ message }: { message: string }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', margin: 16, alignContent: 'center' }}>
            <ActivityIndicator animating={true} />
            <Text style={{ textAlign: 'center', margin: 8 }}>{message}</Text>
        </View>
    )
}