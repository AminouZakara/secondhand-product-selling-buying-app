import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, getFirestore, updateDoc, doc, where, query } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { app } from '../../firebaseConfig';
import auth from '@react-native-firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';


const CreateNewSlider = () => {
    const user = auth().currentUser;
    const navigation = useNavigation();
    const route = useRoute();
    const post = route.params?.post;
    {
        post ? (
            console.log("Post", post),
            console.log("Post id", post.id)
        ) : (
            console.log("No route post")
        )
    }

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const db = getFirestore(app);
    // USeEffect
    useEffect(() => {
        getVentachaCategoryList();
        getUserData();
        getAddress();

    }, [])


    {/* Used to get user data from firestore end */ }
    const [userData, setUserData] = useState([])
    const getUserData = async () => {
        setUserData([])
        setIsLoading(true)
        try {
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
    console.log("User Data from CreateNewPost: ", userData.phoneNumber)
    {/* Used to get user data end */ }

    {/* Used to get ventachaCategory */ }
    const [ventachaCategoryList, setVentaCategoryList] = useState([])

    const getVentachaCategoryList = async () => {
        setIsLoading(true)
        try {
            setVentaCategoryList([]);
            const querySnapshot = await getDocs(collection(db, "ventachaCategory"));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                setVentaCategoryList((prev) => [...prev, doc.data()]);
                setIsLoading(false)
            });
        } catch (error) {
            console.log("Oops! cannot get ventachaCategory: ...", error)
            setIsLoading(false)
        }

    }
    //console.log("Ventacha Category List: ", ventachaCategoryList)
    {/* Used to get ventachaCategory end */ }
    {/* Used to get Address*/ }
    // get Address from firestore in the collection of "ventachaAddress"
    const [addressList, setAddressList] = useState([]);
    const getAddress = async () => {
        setIsLoading(true)
        try {
            setAddressList([])
            const querySnapshot = await getDocs(collection(db, "ventachaAddress"));
            querySnapshot.forEach((doc) => {
                setAddressList((prev) => [...prev, doc.data()]);
            });
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }
    // console.log("These are the current Addresses: ", addressList);

    {/* Used to get Address end */ }

    {/* Used to pick image*/ }

    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    {/* Used to pick image end */ }
    console.log("params", route.params);

    const onSubmitMethod = async (value) => {
        setIsSubmitting(true)
        //if route.params .id is not null, then it is an edit
        if (route.params) {
            try {
                const docRef = doc(db, "ventachaSliderPost", route.params.id);
                await updateDoc(docRef, {
                    ...post,
                    status: "active",
                    title: value.title,
                    price: value.price,
                    address: value.address,
                    category: value.category,
                    description: value.description,
                    editedAt: new Date(),
                });
                console.log("Document updated");
                setIsSubmitting(false)
                Alert.alert(
                    "Slider Post Updated",
                    "Your slider post has been updated successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.goBack(),

                        }
                    ]
                );
                // alert("Document updated");
            }
            catch (error) {
                console.log(error);
                setIsSubmitting(false)
            }
        } else {
            try {
                value.image = image;
                // convert image url to a blob file 
                {/*
                    const blob = await fetch(value.image).then(res => res.blob());
                        */ }
                const resp = await fetch(value.image);
                const blob = await resp.blob();
                //store the blob file in the database
                const storage = getStorage();
                const storageRef = ref(storage, 'ventachaSlider/' + Date.now() + ".jpg");
                uploadBytes(storageRef, blob).then((snapshot) => {
                    console.log('Uploaded a blob or file!');

                }).then((resp) => {
                    getDownloadURL(storageRef).then(async (downloadURL) => {
                        value.image = downloadURL;
                        console.log("Download URL: ", downloadURL);
                        //update the database with the download URL
                        const docRef = addDoc(collection(db, "ventachaSliderPost"), value)
                            .then((docRef) => {
                                console.log("Document written with ID: ", docRef.id);
                                setIsSubmitting(false)
                                setImage(null)
                                Alert.alert(
                                    "Success",
                                    "Your Slider post has been uploaded successfully! Would you like to add another one?",
                                    [

                                        {
                                            text: 'Oui', onPress: () => console.log("Your Slider post has been uploaded successfully!")
                                        },
                                        {
                                            text: 'Non', onPress: () => {

                                                navigation.navigate("Main");
                                                console.log("Your Slider post has been uploaded successfully!")
                                            }
                                        }

                                    ]

                                );

                            })
                    })
                })
            } catch (error) {
                console.log(error);
                setIsSubmitting(false)
            }
        }


    }
    {/* 
         validate={values => {
                        const errors = {};
                        if (!values.title) {
                            errors.title = 'Title is Required';
                            ToastAndroid.show(errors.title, ToastAndroid.SHORT);
                        }
                        if (!values.description) {
                            errors.description = 'Description is Required';
                            ToastAndroid.show(errors.description, ToastAndroid.SHORT);
                        }
                        if (!values.price) {
                            errors.price = 'Price is Required';
                            ToastAndroid.show(errors.price, ToastAndroid.SHORT);
    
                        }
                        if (!values.address) {
                            errors.address = 'Address is Required';
                            ToastAndroid.show(errors.address, ToastAndroid.SHORT);
    
                        }
                        if (!values.category) {
                            errors.category = 'Category is Required';
                            ToastAndroid.show(errors.category, ToastAndroid.SHORT);
    
                        }
                        if (!values.image) {
                            errors.image = 'Image is Required';
                            ToastAndroid.show(errors.image, ToastAndroid.SHORT);
    
                        }
                        return errors;
                    }
                    }
        */}
    return (
        <View>
            {
                isLoading ? (
                    <View style={{ marginTop: 40 }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <View style={{ padding: 10 }}>
                        <Formik
                            initialValues={{
                                status: "active",
                                title: post ? post.title : '',
                                description: post ? post.description : '',
                                price: post ? post.price : '',
                                address: post ? post.address : '',
                                category: post ? post.category : '',
                                image: post ? post.image : '',
                                userName: user.displayName,
                                userEmail: user.email,
                                phoneNumber: userData?.phoneNumber ? userData?.phoneNumber : '',
                                userImage: user.photoURL,
                                userId: user.uid,
                                createdAt: Date.now()
                            }}
                            onSubmit={(value => onSubmitMethod(value))}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
                                <View style={{ padding: 10 }}>
                                    {/*Image Picker*/}
                                    {
                                        post ? (
                                            <Image source={{ uri: post.image }} style={styles.image} />

                                        ) : (
                                            <TouchableOpacity onPress={pickImage}>
                                                {image ?
                                                    <Image source={{ uri: image }} style={styles.image} /> : <Image
                                                        source={require("../../assets/images/placeholder.jpg")}
                                                        style={styles.image}
                                                    />}

                                            </TouchableOpacity>
                                        )
                                    }

                                    <TextInput
                                        style={styles.input}
                                        placeholder="Title"
                                        onChangeText={handleChange('title')}
                                        onBlur={handleBlur('title')}
                                        value={values?.title}
                                    />
                                    <TextInput
                                        style={[styles.input, { height: 150, textAlignVertical: "top" }]}
                                        placeholder="Description"
                                        onChangeText={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                        multiline
                                        value={values?.description}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Price"
                                        keyboardType="numeric"
                                        onChangeText={handleChange('price')}
                                        onBlur={handleBlur('price')}
                                        value={values?.price}
                                    />

                                    {/*Ventacha Category Dropdown List with picker*/}
                                    <Picker
                                        selectedValue={values?.category}
                                        onValueChange={(itemValue, itemIndex) => setFieldValue('category', itemValue)}
                                        style={styles.picker}>

                                        {ventachaCategoryList.length > 0 && ventachaCategoryList.map((item, index) => (
                                            item && <Picker.Item label={item.name} value={item.name} key={index} />
                                        ))}
                                    </Picker>

                                    {/*Address Dropdown List with picker*/}
                                    <Picker
                                        selectedValue={values?.address}
                                        onValueChange={(itemValue, itemIndex) => setFieldValue('address', itemValue)}
                                        style={styles.picker}>

                                        {addressList.length > 0 && addressList.map((item, index) => (
                                            item && <Picker.Item label={`${item.city} - ${item.region}`} value={`${item.city} - ${item.region}`} key={index} />
                                        ))}
                                    </Picker>

                                    {
                                        route.params ? (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#4CAF50',
                                                    padding: isSubmitting ? 8 : 13,
                                                    borderRadius: 10,
                                                }}
                                                onPress={handleSubmit}
                                                disabled={isSubmitting}
                                            >
                                                {
                                                    isSubmitting ?
                                                        <ActivityIndicator size="large" color='#fff' /> :
                                                        <Text style={styles.buttonText}>Update</Text>
                                                }
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#4CAF50',
                                                    padding: isSubmitting ? 8 : 13,
                                                    borderRadius: 10,
                                                }}
                                                onPress={handleSubmit}
                                                disabled={isSubmitting}
                                            >
                                                {
                                                    isSubmitting ?
                                                        <ActivityIndicator size="large" color='#fff' /> :
                                                        <Text style={styles.buttonText}>Submit</Text>
                                                }
                                            </TouchableOpacity>
                                        )
                                    }


                                </View>
                            )}

                        </Formik>
                    </View>
                )
            }


        </View>
    )
}

export default CreateNewSlider

const styles = StyleSheet.create({
    image: {
        width: 140,
        height: 140,
        resizeMode: "contain",
        borderRadius: 15

    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 18,
        marginTop: 10,
        marginBottom: 5,

    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: "center"
    },
    picker: {
        paddingHorizontal: 16,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 18,
        marginTop: 10,
        marginBottom: 5
    }

})