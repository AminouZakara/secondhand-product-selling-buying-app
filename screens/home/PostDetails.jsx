import { ActivityIndicator, Alert, Image, Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import auth from '@react-native-firebase/auth';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';



const PostDetails = () => {
    const db = getFirestore(app)
    const route = useRoute();
    const params = route.params;
    const user = auth().currentUser;
    const [isLoading, setIsLoading] = useState(false)

    const [product, setProduct] = useState([]);
    useEffect(() => {
        setProduct(params.post)
        shareButton();
    }, [params, navigation, product])

    useEffect(() => {
        getUserData();
    }, [])
    // console.log("Product", product);

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
            //set the message in 3 lines
            message: `Regarde ce produit sur Vantacha;\nTitre: ${product.title} \nPrix: ${product.price} CFA \nDescription: ${product.description} \nLink: ${product?.link} \n`,
        })
            .then(result => console.log(result))
            .catch(error => console.error(error));
    }
    console.log("Product title:", product.title);
    console.log("Product title:", product.price);
    
    //sendEmailMessage
    const sendEmailMessage = () => {
        const Subject = "Regarding " + product.title;
        const Body = "Hello, " + product.userName + "." + " I am interested in your product " + product.title + ". Please me know more about it.";
        const email = product.userEmail;
        const emailBody = "Subject: " + Subject + "\n\n" + Body;
        Linking.openURL('mailto:' + email + '?body=' + emailBody);
    }
    //Delete userPost
    const deleteUserPost = () => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
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
        try {
            deleteDoc(doc(db, "ventachaUserPost", product.id))
            navigation.goBack();
        }
        catch (error) {
            console.error(error);
        }
    }

    //console.log("Product's userId: ", product.userId);

    {/* Used to get user data from firestore end */ }
    const [userData, setUserData] = useState([])
    const getUserData = async () => {
        setIsLoading(true)
        try {
            setUserData([])
            const q = query(collection(db, "ventachaUsers"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots.
                setUserData(doc.data());
            });
            setIsLoading(false)
        } catch (error) {
            console.log("Oops! cannot get user data: ", error)
            setIsLoading(false)
        }
    }
    //console.log("User Data: ", userData.role)
    {/* Used to get user data end */ }

    {/* update the status where doc.id equals to params.id */ }
    // console.log(params.id);

    const [isStatusUpdating, setIsStatusUpdating] = useState(false)

    const updateStatus = async () => {
        setIsStatusUpdating(true)
        try {
            const docRef = doc(db, "ventachaUserPost", params.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    status: "accepted"
                });
                console.log("Status updated");
                setIsStatusUpdating(false)
                navigation.goBack();

            } else {
                console.log("No such document!");
            }
        }
        catch (error) {
            console.log("Oops! cannot update status: ", error)
            setIsStatusUpdating(false)
        }
    }
    {/* update the status where doc.id equals to params.id */ }

    {/* Used to update the status of the post from pending to approved end */ }

    //console.log("product Id:", product.id);
    //console.log("product userId:", product.userId);
    //console.log("user userId:", user.uid);


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
                            const docRef = doc(db, "ventachaUserPost", product.id);
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
            "You can only message this person",
            [
                {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                },
            ],

        )
    }

    return (
        <View style={styles.container}>
            {
                isLoading ? (
                    <View style={styles.loader} >
                        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 60 }} />
                    </View >
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        >
                        <Image
                            source={{ uri: product.image }}
                            style={styles.image} />
                        <View style={{ paddingTop: 8, paddingHorizontal: 15 }}>
                            <Text style={{ marginVertical: 5, color: "black", fontWeight: "400", fontSize: 20, fontFamily: 'Quicksand-Light', }}>{product.title}</Text>

                            <Text style={{ marginBottom: 5, color: "green", fontWeight: "400", fontSize: 24 }}><Text style={{ color: "grey", fontWeight: "400", fontSize: 25 }}>D</Text>{product.price}</Text>
                            <Text style={{ color: "orange", fontWeight: "400", fontSize: 16 }}>{product.category} </Text>
                            <Text style={{ marginVertical: 5 }}><Text style={{ fontSize: 17, color: "black", fontWeight: "400" }}>Description:</Text>  {product.description}</Text>
                        </View>

                        {/* if the userData's role is admin show the approve button  */}
                        {
                            userData.role === "Admin" && (
                                <View>
                                    {product.status === "pending" ? (
                                        <TouchableOpacity
                                            onPress={updateStatus}
                                            disabled={isStatusUpdating}
                                            style={{
                                                padding: 6,
                                                width: 80,
                                                backgroundColor: "green",
                                                alignSelf: "flex-end",
                                                borderRadius: 10,
                                                marginRight: 10,
                                            }}
                                        >
                                            {
                                                isStatusUpdating ? (
                                                    <ActivityIndicator size="small" color="white" />
                                                ) : (
                                                    <Text style={{
                                                        textAlign: "center", color: "white", fontSize: 16, fontWeight: "400"
                                                    }}>Approve</Text>
                                                )
                                            }
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={{
                                            padding: 6,
                                            alignSelf: "flex-end",
                                            borderRadius: 10,
                                            marginRight: 10,
                                        }}>
                                            <Feather name="check-circle" size={24} color="green" />
                                        </View>
                                    )}

                                </View>
                            )
                        }

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
                            {
                                product?.userId === user?.uid ? (
                                    // edit post
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Main", {
                                            screen: "Add",
                                            params: { id: product.id, post: product }
                                        })}
                                        style={{

                                        }}
                                    >
                                        <AntDesign name="edit" size={28} color="green" />

                                    </TouchableOpacity>

                                ) : (
                                    // send message to user
                                    <TouchableOpacity onPress={message}>
                                        <MaterialCommunityIcons name="message-processing-outline" size={40} color="white" />
                                    </TouchableOpacity>
                                )
                            }




                        </View>
                        {
                            product?.userId === user?.uid ? (
                                // Mark the post as sold not deleteUserPost
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
                                // pick the user phone number from the userData and make a call
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
        </View>


    )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    image: {
        width: "100%",
        height: 290,
        resizeMode:"contain",

    },
})