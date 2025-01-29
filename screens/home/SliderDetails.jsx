import { ActivityIndicator, Alert, Image, Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import auth from '@react-native-firebase/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';


const SliderDetails = () => {
    const db = getFirestore(app)
    const route = useRoute();
    const params = route.params;
    const user = auth().currentUser;

    const [product, setProduct] = useState([]);
    useEffect(() => {
        setProduct(params.slider)
        shareButton();
    }, [params, navigation])
    console.log("Product", product);
    //Share this page on social media
    const navigation = useNavigation();
    const shareButton = () => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => shareProduct()}>
                    <Ionicons name="share-social-sharp" size={24} color="black" style={{ marginRight: 15 }} />
                </TouchableOpacity>

            ),
        });
    }
    const shareProduct = () => {
        Share.share({
            message: `Check out this product: ${product.title}, ${product.price} CFA. ${product.description}.`
        })
            .then(result => console.log(result))
            .catch(error => console.error(error));
    }
    // edit product
    const [isSelling, setIsSelling] = useState(false)
    // edit product
    const soldProduct = async () => {
        Alert.alert(
            "Confirm Sale",
            "Have you sold this product?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        setIsSelling(true)
                        try {
                            const docRef = doc(db, "ventachaSliderPost", product.id);
                            const docSnap = await getDoc(docRef);
                            if (docSnap.exists()) {
                                await updateDoc(docRef, {
                                    status: "sold"
                                });
                                console.log("Product updated");
                                setIsSelling(false)
                                Alert.alert(
                                    "Congraulations!!!",
                                    "We are glad you sold your product",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => navigation.goBack(),
                                        },
                                    ],
                                );
                            } else {
                                console.log("No such document!");
                            }
                        }
                        catch (error) {
                            console.log("Oops! cannot update product: ", error)
                            setIsSelling(false)
                        }
                    }
                },
                {
                    text: "No",
                    onPress: () => console.log("Not sold"),
                },
            ],
            { cancelable: false }
        );
    }
    {/* update the status where doc.id equals to params.id */ }

    //console.log("Product", product);

    // makeCall
    const makeCall = async () => {
        //make a call using linking
        const link = await Linking.openURL(`tel:${product.phoneNumber}`);
        console.log(link);
    }
    // message using linking
    const message = async () => {
        //make a call using linking and message "Hello" plus the user name then ask the user if the product is still available
        const link = await Linking.openURL(`sms:${product.phoneNumber}?body=Hello ${product.userName} is the ${product.title} still available?`);
        console.log(link);
    }

    // NoPhoneNumber, you can only message the user
    const NoPhoneNumber = () => {
        Alert.alert(
            "No Phone Number",
            "This product does not have a phone number",
            [
                {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                },
            ],

        )
    }
    //Delete userPost
    const [deleting, setDeleting] = useState(false);
    const deleteUserPost = () => {
        Alert.alert(
            'Delete Slider',
            'Are you sure you want to delete this slider post?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => deletePost()
                },
            ],
            { cancelable: false }
        );
    }
    const deletePost = async () => {
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "ventachaSliderPost", product.id))
            setDeleting(false);
            Alert.alert(
                'Slider Deleted',
                'Slider has been deleted',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                            console.log('Slider deleted')
                        },
                    },
                ],
                { cancelable: false }
            );
        }
        catch (error) {
            console.error(error);
            setDeleting(false);
        }
    }


    console.log("Product's UserId: ", product?.userId);
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <Image
                source={{ uri: product.image }}
                style={styles.image} />
            <View style={{ paddingTop: 8, paddingHorizontal: 15 }}>
                <Text style={{ marginVertical: 5, color: "black", fontWeight: "400", fontSize: 20, fontFamily: 'Quicksand-Light', }}>{product.title}</Text>

                <Text style={{ marginBottom: 5, color: "green", fontWeight: "400", fontSize: 24 }}>{product.price} <Text style={{ color: "orange", fontWeight: "500", fontSize: 15 }}>CFA </Text> </Text>
                <Text style={{ color: "orange", fontWeight: "400", fontSize: 16 }}>{product.category} </Text>
                <Text style={{ marginVertical: 5 }}><Text style={{ fontSize: 17, color: "black", fontWeight: "400" }}>Description:</Text>  {product.description}</Text>
            </View>

            {/* user info and send message to user */}
            <View style={{ justifyContent: "space-between", paddingRight: 20, backgroundColor: "#9eb5a3", elevation: 2.5, shadowColor: "orange", shadowRadius: 15, alignItems: "center", marginTop: 20, flexDirection: "row", flex: 1 }}>
                <View style={{
                    margin: 5,
                    marginRight: 20,

                }}>
                    <Image
                        source={{ uri: product?.userImage }}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 50,

                        }} />
                </View>
                <View>
                    <Text> {product?.userName} </Text>
                    <Text> {product?.userEmail} </Text>
                </View>

                {/* ------ edit post OR send message to user -----*/}

                {
                    product?.userId === user?.uid ? (
                        // edit post
                        <TouchableOpacity
                            onPress={() => navigation.navigate("AddSlider", {
                                id: product.id, 
                                post: product
                            })}
                            style={{

                            }}
                        >
                            <AntDesign name="edit" size={28} color="green" />

                        </TouchableOpacity>

                    ) : (
                        // send message to user
                        <View>
                            {
                                product?.phoneNumber ? (
                                    <TouchableOpacity onPress={message}>
                                        <MaterialCommunityIcons name="message-processing-outline" size={40} color="white" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={NoPhoneNumber}>
                                        <MaterialCommunityIcons name="message-processing-outline" size={40} color="white" />
                                    </TouchableOpacity>
                                )

                            }
                        </View>

                    )
                }







                {
                    product?.userId === user.uid ? (
                        <TouchableOpacity
                            onPress={() => deleteUserPost(product?.id)}
                            style={{
                                padding: 5,
                                borderRadius: 10,
                            }}>
                            {
                                deleting ? (
                                    <ActivityIndicator size="small" color="red" />
                                ) : (
                                    <AntDesign name="delete" size={26} color="red" />
                                )
                            }

                        </TouchableOpacity>
                    ) : ""
                }




            </View>

            {/* ----- Mark the post as sold not deleteUserPost 0r  make a call --- */}
            {
                product?.userId === user?.uid ? (

                    <TouchableOpacity
                        onPress={soldProduct}
                        style={{
                            backgroundColor: "orange",
                            marginVertical: 30,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignSelf: "center",
                            padding: 10,

                        }}>
                        {
                            isSelling ? (
                                <ActivityIndicator size="small" color="white" />

                            ) : (
                                <Text style={{
                                    color: "white",
                                    fontSize: 15,
                                    fontWeight: "600"
                                }}>Mark as Sold</Text>
                            )
                        }

                    </TouchableOpacity>
                ) : (

                    <TouchableOpacity

                    >
                        {
                            product?.phoneNumber ? (
                                <TouchableOpacity
                                    onPress={makeCall}
                                    style={{
                                        flexDirection: "row",
                                        backgroundColor: "#9eb5a3",
                                        margin: 8,
                                        marginTop: 30,
                                        borderRadius: 50,
                                        justifyContent: "center",
                                        alignSelf: "center",
                                    }}
                                >
                                    <Feather name="phone-call" size={30} color="green" style={{ borderColor: "green", borderWidth: 1, backgroundColor: "white", borderRadius: 35, padding: 10, textAlign: "center" }} />

                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={NoPhoneNumber}
                                    style={{
                                        flexDirection: "row",
                                        backgroundColor: "#9eb5a3",
                                        margin: 8,
                                        marginTop: 30,
                                        borderRadius: 50,
                                        justifyContent: "center",
                                        alignSelf: "center",
                                    }}
                                >
                                    <Ionicons name="call-outline" size={34} color="grey" style={{ borderColor: "grey", borderWidth: 1, backgroundColor: "white", borderRadius: 35, padding: 6, textAlign: "center" }} />


                                </TouchableOpacity>
                            )

                        }

                    </TouchableOpacity>
                )
            }


        </ScrollView>
    )
}

export default SliderDetails

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    },
    image: {
        width: "auto",
        height: 400,
        resizeMode: "cover",
    },
})