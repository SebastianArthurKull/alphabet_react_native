import React, {useEffect, useState} from "react";
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {FontAwesome} from '@expo/vector-icons';
import {MainScreen} from './screens/MainScreen';
import {SettingScreen} from './screens/SettingScreen';
import Database from './database'



export default function App() {
    const Stack = createStackNavigator();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Database.initializeDatabase().then(resolved => {
            console.log(resolved.message)
            setLoading(false)
        }, rejected => {
            console.log(rejected.message)
            setLoading(false)

        })
    }, [])

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    return (<NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Main"
                component={MainScreen}
                options={({navigation}) => ({
                    title: 'App', headerRight: () => (<TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                        <FontAwesome name="cogs" size={24} style={{marginRight: 15}}/>
                    </TouchableOpacity>),
                })}
            />
            <Stack.Screen
                name="Setting"
                component={SettingScreen}
                options={{
                    title: 'Settings',
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>);

}
``
