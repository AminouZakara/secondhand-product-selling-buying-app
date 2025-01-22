import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import auth, { firebase } from '@react-native-firebase/auth';


const Door = () => {
    const navigation = useNavigation();
    const [userAuth, setUserAuth] = useState(null)


    //---- SignInWithGoogle ---- react native expo google login and save user data in firebase
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate("Main")
                setUserAuth(user)
            } else {
                navigation.navigate("Login")
                setUserAuth(null)
            }
        });
        return subscriber;
    }, []);
}

export default Door

const styles = StyleSheet.create({})