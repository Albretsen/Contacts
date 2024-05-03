import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types/ParamList';
import Search from '../components/search/Search';
import ContactList from '../components/list/ContactList';

type HomeScreenProps = NativeStackScreenProps<ParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                margin: 16,
                flex: 1
            }}>
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <ContactList navigation={navigation} searchQuery={searchQuery} />
            </View>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('New contact')}
                accessibilityLabel='Create a new contact'
            />
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
