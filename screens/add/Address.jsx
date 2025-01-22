import { ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { addDoc, collection, getDocs, getFirestore, onSnapshot } from 'firebase/firestore'
import { app } from '../../firebaseConfig'

const Address = () => {
    const db = getFirestore(app);
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    // get Address from firestore in the collection of "ventachaAddress"
    const [address, setAddress] = useState([]);
    useEffect(() => {
        getAddress()
    }, [])
    const getAddress = async () => {
        setLoading(true)
        try {
            setAddress([])
            const unsub = onSnapshot(
                collection(db, "ventachaAddress"),
                (querySnapshot) => {
                    const go = [];
                    querySnapshot.forEach((doc) => {
                        go.push({ id: doc.id, ...doc.data() });
                    });
                    setAddress(go);
                    setLoading(false)
                }
            );
            return () => unsub();
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }
    //console.log("These are the current Addresses: ", address);





    // add Address to firestore in the collection "ventachaAddress"
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const addAddress = async () => {
        // if the name of the city exists in firestore say the data exists
        if (!region || !city) {
            Alert.alert(
                "Detaille non Validé!",
                'Veuillez remplir tous les champs.',
                [
                    {
                        text: 'Cancel', onPress: () => console.log("Cancel Pressed"), style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => console.log("OK")
                    }
                ],
                { cancelable: true }
            );
        } else if (address.find((item) => item.city === city)) {
            //addrees existe dans la base de données
            Alert.alert(
                "Detaille non Validé!",
                'Cette ville existe déjà dans la base de données.'
            );
            return;
        } else {
            setIsSubmitting(true);
            try {
                const docRef = await addDoc(collection(db, "ventachaAddress"), {
                    region: region,
                    city: city
                })
                setIsSubmitting(false);
                Alert.alert(" Address Added", "Your address has been added successfully");
                //then reset the form and refresh the page


                console.log("These are the current Addresses: ", address);
            } catch (error) {
                console.error(error);
                setIsSubmitting(false);
            }
        }

    }
    return (
        <KeyboardAvoidingView>
            <ScrollView>

                <View style={{ backgroundColor: "green" }}>
                    <View style={{ marginTop: 40, paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>Add New Address</Text>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.button}>
                            <Text style={{ color: "white", fontWeight: "500" }}>Add Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ marginTop: 15, fontWeight: "400", fontSize: 20, textAlign: "center" }}>Create New Address</Text>

                {/* add a form of 2 input fields and 1 button */}
                <View style={{ marginHorizontal: 10, marginVertical: 10, padding: 10, borderRadius: 10, elevation: 5 }}>
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={{ fontSize: 16, color: "black" }}>City :</Text>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10 }}
                            placeholder="Enter City"
                            value={city}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>

                    <View>
                        <Text style={{ fontSize: 16, color: "black" }}>Region :</Text>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10 }}
                            placeholder="Enter Region"
                            value={region}
                            onChangeText={(text) => setRegion(text)}
                        />
                    </View>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#4CAF50',
                            padding: 13,
                            borderRadius: 10,
                        }}
                        onPress={addAddress}
                    >
                        {
                            isSubmitting ?
                                <ActivityIndicator size="large" color="#fff" />
                                :
                                <Text style={{
                                    textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "600"
                                }}>Add Address</Text>
                        }
                    </TouchableOpacity>


                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Address

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        width: 80,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 10,
    }
})