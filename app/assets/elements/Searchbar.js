import React from 'react';
import {
    View,
    Modal,
    ActivityIndicator,
    FlatList
} from "react-native";
import styles from './styles';
import { SearchBar } from 'react-native-elements';

export default Search = (props) => (
    <Modal
        {...props}
    >
        <View style={styles.searchContainer}>
            <SearchBar
                {...props}
            />
            <FlatList
                {...props}
            />
        </View>
    </Modal>
)