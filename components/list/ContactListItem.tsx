import { List, Avatar, TouchableRipple } from "react-native-paper";
import type { Contact } from "../../types/Contact";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from "../../styles/theme";

interface ContactListItemProps {
    contact: Contact;
    navigation: NativeStackNavigationProp<any>;
}

export default function ContactListItem({ contact, navigation }: ContactListItemProps) {
    return (
        <TouchableRipple
            onPress={() => navigation.navigate('View', { contact })}
            rippleColor={theme.colors.primaryContainer}
        >
            <List.Item
                title={contact.Info.Name}
                left={() => <Avatar.Text size={40} label={contact.Info.Name.slice(0, 1).toUpperCase()} />}
            />
        </TouchableRipple>)
}