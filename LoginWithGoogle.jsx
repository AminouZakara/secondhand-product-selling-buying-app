import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth, { firebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { app } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';


const LoginWithGoogle = () => {
    const navigation = useNavigation();
    const [userAuth, setUserAuth] = useState(null)
    const db = getFirestore(app)
    GoogleSignin.configure({
        webClientId: process.env.NEXT_PUBLIC_FIREBASE_WEB_CLIENT_ID
    });

    //---- SignInWithGoogle ---- react native expo google login and save user data in firebase
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            if (user) {
                setUserAuth(user)
            } else {
                setUserAuth(null)
            }
        });
        return subscriber;
    }, []);


    async function onGoogleButtonPress() {
        try {
            const result = await GoogleSignin.signIn();
            const token = result.data.idToken;
            const credential = firebase.auth.GoogleAuthProvider.credential(token);
            const userCredntial = await auth().signInWithCredential(credential);
            //setAuthUser to user credential
            setUserAuth(userCredntial.user);
            console.log(userCredntial.user);

            //once user signed in keep them signed in for the next visit
            const userRef = doc(db, "ventachaUsers", userCredntial.user.uid);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    name: user.user.displayName,
                    email: user.user.email,
                    photoURL: user.user.photoURL,
                    lastLogin: new Date(),
                });
                // console.log('User created');
            } else {
                await updateDoc(userRef, {
                    lastLogin: new Date(),
                });
                // console.log('User already exists');
            }
            navigation.navigate("Main")
        } catch (error) {
            console.error(error);
        }
    }

    //Sign out
    const SignOut = () => {
        auth().signOut()
            .then(() => {
                setUserAuth(null);
                console.log('Signed out');
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Sign out of current user
    async function onSignOutPress() {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setUserAuth(null);
            console.log('User signed out');
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: "white",
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <TouchableOpacity
                style={{
                    backgroundColor: "#0384fc",
                    padding: 10,
                    borderRadius: 10,
                    width: 200,
                    height: 40,
                }}
                onPress={onGoogleButtonPress}>
                <Text style={{ textAlign: "center", color: "white" }}>Facebook</Text>
            </TouchableOpacity>
            <View
                style={{ marginTop: 25, flexDirection: "row", }}
            >
                <Text style={{ textAlign: "center", color: "gray", fontSize: 15 }}>
                    Creer un compte avec
                </Text>
                <Pressable
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={{ textAlign: "center", color: "#176BEF", fontSize: 15 }}> Google Sign-In </Text>
                </Pressable>
            </View>


            <View style={{
                marginTop: 150,
                alignSelf: "center"
            }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "orange",
                        padding: 5,
                        borderRadius: 10,
                    }}
                    onPress={onSignOutPress}>
                    <Text style={{ textAlign: "center", color: "white" }}>Out</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default LoginWithGoogle

const styles = StyleSheet.create({})