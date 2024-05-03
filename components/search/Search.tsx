import { Searchbar } from 'react-native-paper';

interface SearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function Search({ searchQuery, setSearchQuery }: SearchProps) {
    return (
        <Searchbar
            placeholder="Search all contacts"
            onChangeText={setSearchQuery}
            value={searchQuery}
            searchAccessibilityLabel="Search all contacts"
            clearAccessibilityLabel="Clear"
        />
    );
}