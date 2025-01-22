import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import auth from "@react-native-firebase/auth"

const EditProfile = () => {
    const navigation = useNavigation();
    const user = auth().currentUser;
    const db = getFirestore(app)
    const route = useRoute();
    const userData = route.params.userData;
    console.log("User Data from Edit Profile", userData.name);

    const [loading, setLoading] = useState(false);
    // useEffect
    useEffect(() => {
        getUserData()
    }, [])
    {/* Used to get user data from firestore end */ }
    const [gUserData, setGUserData] = useState([])
    const getUserData = async () => {
        setLoading(true)
        try {
            setGUserData([])
            const q = query(collection(db, "ventachaUsers"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots.
                setGUserData(doc.data());
            });
            setLoading(false)
        } catch (error) {
            console.log("Oops! cannot get user data: ", error)
            setLoading(false)
        }
    }

    console.log("User Data: ", gUserData)
    {/* Used to get user data end */ }
    //update user info by adding user phone number to the user data on firebase
    const getUser = (type) => {
        if (userData) {
            switch (type) {
                case "name":
                    return userData.name
                case "email":
                    return userData.email
                case "city":
                    return userData.city
                case "address":
                    return userData.address
                case "phoneNumber":
                    return userData.phoneNumber
            }

        } else
            return ""
    };



    const [name, setName] = useState(getUser('name'));
    const [email, setEmail] = useState(getUser('email'));
    const [city, setCity] = useState(getUser('city'));
    const [address, setAddress] = useState(getUser('address'));
    const [phoneNumber, setPhoneNumber] = useState(getUser('phoneNumber'));
    const [photoURL, setPhotoURL] = useState(getUser('photoURL'));
    const handleInfo = () => {
        const user = auth().currentUser;
        const userRef = doc(db, 'ventachaUsers', user.uid);
        const userUpdate = {
            name: name,
            email: email,
            city: city,
            address: address,
            phoneNumber: phoneNumber,
            photoURL: userData.photoURL,
            userId: user.uid,
            lastLogin: new Date(),
            // photoURL: photoURL
        };
        const q = query(collection(db, "ventachaUserPost"), where("userId", "==", user.uid));
        // get the them and update them
       



        if (userData) {
            //Update User
            Alert.alert(
                `Modification`,
                `Voulez-vous vraiment modifier les  informations?`,
                [
                    {

                        text: 'Annuler',
                        onPress: () => navigation.goBack()
                    },
                    {
                        text: 'Oui', onPress: () => {
                            setLoading(true)
                            //update 
                            getDocs(q).then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    const post = doc.data();
                                    const postUpdate = {
                                        phoneNumber: phoneNumber,
                                    };
                                    updateDoc(doc.ref, postUpdate);
                                });
                            });
                            updateDoc(userRef, userUpdate)
                                .then(() => {
                                    Alert.alert(
                                        `Modification`,
                                        `Les informations ont été modifiées avec succès`,
                                        [
                                          
                                            {
                                                text: 'Ok',
                                                onPress: () => navigation.goBack()
                                            }
                                        ]
                                    );
                                    setLoading(false)
                                    console.log(" user is updated successfully");

                                }).catch((error) => {
                                    Alert.alert(
                                        `Modification`,
                                        `Une erreur est survenue`,
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    setLoading(false)
                                                    navigation.goBack()
                                                    console.log("Error:", error);

                                                }
                                            }
                                        ]
                                    );
                                });
                        }

                    }
                ]
            )

        }

    }





    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 10,
                alignItems: "center",
            }}
        >
            <View style={{ marginTop: 50 }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                        Nom Prenom
                    </Text>

                    <TextInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholder="Nom Prenom"
                        placeholderTextColor={"orange"}
                        style={{
                            fontSize: name ? 18 : 18,
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                            width: 300,
                            color: name ? "green" : "orange"

                        }}
                    />
                </View>
                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                        Email
                    </Text>

                    <TextInput
                        value={email}
                        editable={false}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="enter your email address"

                        style={{
                            fontSize: email ? 18 : 18,
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                            width: 300,
                            color: "grey"
                        }}
                    />
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                        Phone
                    </Text>

                    <TextInput
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text)}
                        placeholder="96-52-43-34"
                        placeholderTextColor={phoneNumber ? 'green' : "orange"}
                        numberOfLines={1}
                        keyboardType='numeric'

                        style={{
                            fontSize: phoneNumber ? 18 : 18,
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                            width: 300,
                            color: phoneNumber ? "green" : "orange"
                        }}
                    />
                </View>


                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                        Ville
                    </Text>

                    <TextInput
                        value={city}
                        onChangeText={(text) => setCity(text)}
                        placeholder="Ville"
                        placeholderTextColor={"orange"}
                        style={{
                            fontSize: city ? 18 : 18,
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                            width: 300,
                            color: city ? "green" : "orange"


                        }}
                    />
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                        Address
                    </Text>

                    <TextInput
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                        placeholder="enter your address"
                        numberOfLines={2}
                        multiline={true}
                        placeholderTextColor={address ? 'green' : "orange"}

                        style={{
                            fontSize: address ? 18 : 18,
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                            width: 300,
                            color: address ? "green" : "orange"
                        }}
                    />
                </View>


            </View>



            <TouchableOpacity
                onPress={handleInfo}
                style={{
                    width: 300,
                    backgroundColor: "green",
                    padding: 14,
                    borderRadius: 7,
                    marginTop: 50,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <Text

                    style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                    }}
                >
                    Modifier
                </Text>
            </TouchableOpacity>






        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({})