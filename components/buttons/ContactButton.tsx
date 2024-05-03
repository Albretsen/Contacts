import { View, Linking } from "react-native";
import { Button } from "react-native-paper";
import { Contact } from "../../types/Contact";
import { useSnackbar } from "../../hooks/useSnackbar";

export default function ContactButtons({ contact }: { contact: Contact }) {
    const { showSnack } = useSnackbar();

    const handleEmailPress = () => {
        const emailUrl = `mailto:${contact.Info.DefaultEmail.EmailAddress}`;
        Linking.canOpenURL(emailUrl).then(supported => {
            if (supported) {
                Linking.openURL(emailUrl);
            } else {
                showSnack("Unable to open email app");
            }
        });
    };

    const handleCallPress = () => {
        const phoneUrl = `tel:${contact.Info.DefaultPhone.CountryCode}${contact.Info.DefaultPhone.Number}`;
        Linking.canOpenURL(phoneUrl).then(supported => {
            if (supported) {
                Linking.openURL(phoneUrl);
            } else {
                showSnack("Unable to make a call");
            }
        });
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', gap: 8 }}>
            <Button style={{ flex: 1, borderRadius: 8 }} icon="email" mode="contained" onPress={handleEmailPress}>
                Email
            </Button>
            <Button style={{ flex: 1, borderRadius: 8 }} icon="phone" mode="contained" onPress={handleCallPress}>
                Call
            </Button>
        </View>
    );
}