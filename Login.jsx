import { ActivityIndicator, Button, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth, { firebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { app } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const [userAuth, setUserAuth] = useState(null)
    const db = getFirestore(app)
    GoogleSignin.configure({
        webClientId: "922469794505-q4dv9me5677kfrhk2oin5n5emk8397dh.apps.googleusercontent.com"
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
        setIsLoading(true);
        try {
            const result = await GoogleSignin.signIn();
            const token = result.data.idToken;
            const credential = firebase.auth.GoogleAuthProvider.credential(token);
            const userCredntial = await auth().signInWithCredential(credential);
            //setAuthUser to user credential
            setUserAuth(userCredntial.user);
            console.log(userCredntial.user);
            // if user is a new sign in, save data
            const docRef = doc(db, "ventachaUsers", userCredntial.user.uid);
            if (userCredntial.additionalUserInfo.isNewUser) {
                await setDoc(docRef, {
                    name: userCredntial.user.displayName,
                    email: userCredntial.user.email,
                    photoURL: userCredntial.user.photoURL,
                    userId: userCredntial.user.uid,
                    city: "",
                    address: "",
                    phoneNumber: "",
                    role: 'user',
                    createdAt: new Date(),
                });
                console.log('User created');
                navigation.navigate('Main');
                setIsLoading(false)

            }
            else {
                await updateDoc(docRef, {
                    lastLogin: new Date(),
                });
                console.log('User already exists');
                navigation.navigate('Main');
                setIsLoading(false)


            }
        } catch (error) {
            console.error(error);
            setIsLoading(false)
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
        <View style={styles.container}>
            <Image
                source={require("./assets/images/Ventacha.png")}
                style={styles.logo}
            />
            <View style={{ width: "100%", alignItems: "center", }} >
                <Text style={{ fontSize: 20, fontWeight: "800", textAlign: "center" }}>Marché Ventacha Communautaire</Text>
                <Text style={{ marginTop: 20, textAlign: "center" }}>C'est un marché communautaire ou vous pouvez vendre et acheter des produits.</Text>
                <TouchableOpacity
                    onPress={onGoogleButtonPress}
                    style={styles.button}>
                    {
                        isLoading ? (
                            <ActivityIndicator size="large" color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Signin With Google</Text>
                        )
                    }
                </TouchableOpacity>
                <View
                    style={{ marginTop: 25, flexDirection: "row", alignItems: "baseline" }}
                >
                    <Text style={{ textAlign: "center", color: "gray", fontSize: 15 }}>
                        Creer un compte avec
                    </Text>
                    <Pressable
                        onPress={() => navigation.navigate('LoginWithGoogle')}
                    >
                        <Text style={{ textAlign: "center", color: "#176BEF", fontSize: 17 }}> Facebook </Text>
                    </Pressable> 
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        backgroundColor: "white",
        paddingHorizontal: 20

    },
    logo: {
        width: "100%",
        height: "50%",
        resizeMode: "contain",
        marginTop: 20
    },
    button: {
        width: "100%",
        borderRadius: 25,
        height: 50,
        backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    }

})