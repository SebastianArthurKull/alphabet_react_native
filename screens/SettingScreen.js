import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Dimensions } from "react-native";
import Database from '../database'

export function SettingScreen() {
    const [alphabet, setAlphabet] = useState([])
    const { width } = Dimensions.get('window');
    const itemSize = width / 5; // Adjust the item size as needed

    // Function to handle item selection
    function handleItemPress(item) {
        if (item.selected === 1) {
            Database.deselectItem(item.name)
                .then(() => {
                    // Update the state of the deselected item
                    setAlphabet(alphabet.map(i => i.name === item.name ? {...i, selected: 0} : i));
                })
                .catch(error => {
                    console.log('Error occurred while deselecting item:', error);
                });
        } else {
            Database.selectItem(item.name)
                .then(() => {
                    // Update the state of the selected item
                    setAlphabet(alphabet.map(i => i.name === item.name ? {...i, selected: 1} : i));
                })
                .catch(error => {
                    console.log('Error occurred while selecting item:', error);
                });
        }
    }

    // Render individual list item
    function renderItem({ item }) {
        return (
            <TouchableOpacity
                style={{
                    width: itemSize,
                    height: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: item.selected === 1 ? 'lightblue' : 'white',
                }}
                onPress={() => handleItemPress(item)}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    useEffect(() => {
        Database.getAllRows(rows => {
            setAlphabet(rows.map(row => ({name: row.name, selected: row.selected})));
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={alphabet}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                numColumns={5} // Fixed number of columns (adjust as needed)
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }} // Add padding and bottom spacing
            />
        </View>
    );
}
