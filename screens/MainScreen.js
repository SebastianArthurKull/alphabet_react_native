import {ActivityIndicator, Dimensions, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import Database from '../database'
import {useIsFocused} from "@react-navigation/native";


export function MainScreen() {
    const {width, height} = Dimensions.get('window');
    const [letter, setLetter] = useState('');
    const [letters, setLetters] = useState([]);
    const [loading, setLoading] = useState(true)
    const [lastIndex, setLastIndex] = useState(0)
    const isFocused = useIsFocused()


    useEffect(() => {

        if (isFocused) {
            Database.getAllSelectedRows(rows => {
                const names = rows.map(e => e.name)
                setLetters(names)
                if (names.length > 0) {
                    setRandomLetter(names)
                } else {
                    setLetter("")
                }
                setLoading(false)
            })
        }
    }, [isFocused])

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }

    function setRandomLetter(names) {
        let randomIndex
        if (names.length === 1) {
            randomIndex = getRandomInt(names.length)
        } else {
            do {
                randomIndex = getRandomInt(names.length)
            } while (randomIndex === lastIndex)
        }
        setLastIndex(randomIndex)
        setLetter(letters[randomIndex])
    }

    return (<TouchableOpacity
        style={{flex: 1}}
        onPress={() => setRandomLetter(letters)}
    >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: Math.min(width, height)}}>{letter}</Text>
        </View>
    </TouchableOpacity>);
}
