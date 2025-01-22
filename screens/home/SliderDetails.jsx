import { Alert, Image, Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, deleteDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import auth from '@react-native-firebase/auth';

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
            'Are you sure you want to delete this slider?',
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
            const q = query(collection(db, 'ventachaUserPost'), where('userId', '==', product.userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref).then(res => {
                    console.log(res);
                    navigation.goBack();
                })
            });
        }
        catch (error) {
            console.error(error);
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
        {
            product?.userId === user.uid ? (
                <TouchableOpacity
                    onPress={()=> deleteUserPost(product?.id)}
                    style={{
                        backgroundColor: "red",
                        padding: 5,
                        borderRadius: 10,
                    }}>
                    <Text style={{
                        color: "white",
                        fontSize: 15,
                        fontWeight:"600"
                    }}>Delete</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={sendEmailMessage}>
                    <MaterialCommunityIcons name="message-processing-outline" size={40} color="white" />
                </TouchableOpacity>
            )
        }




    </View>

    <TouchableOpacity

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
        <Ionicons name="call-outline" size={34} color="green" style={{ borderColor: "#9eb5a3", borderWidth: 4, backgroundColor: "white", borderRadius: 35, padding: 6, textAlign: "center" }} />


    </TouchableOpacity>

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