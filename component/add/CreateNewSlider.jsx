import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { app } from '../../firebaseConfig';
import auth from '@react-native-firebase/auth';

const CreateNewSlider = () => {
    const user = auth().currentUser;
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const db = getFirestore(app);
    {/* Used to get ventachaCategory */ }
    const [ventachaCategoryList, setVentaCategoryList] = useState([])
    useEffect(() => {
        getVentachaCategoryList();
    }, [])
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
    console.log("Ventacha Category List: ", ventachaCategoryList)
    {/* Used to get ventachaCategory end */ }
  {/* Used to get Address*/ }
    // get Address from firestore in the collection of "ventachaAddress"
    const [addressList, setAddressList] = useState([]);
    useEffect(() => {
        getAddress()
    }, [])
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

    const onSubmitMethod = async (value) => {
        setIsSubmitting(true)
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
                        Alert.alert("Success", " Your Slider post has been uploaded successfully");
                    })
            })
        })

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
                            initialValues={{ title: '', description: '', price: '', address: '', category: '', image: '', userName: user.displayName, userEmail: user.email, userImage: user.photoURL, userId: user.uid, createdAt: Date.now() }}
                            onSubmit={(value => onSubmitMethod(value))}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
                                <View style={{ padding: 10 }}>
                                    {/*Image Picker*/}
                                    <TouchableOpacity onPress={pickImage}>
                                        {image ?
                                            <Image source={{ uri: image }} style={styles.image} /> : <Image
                                                source={require("../../assets/images/placeholder.jpg")}
                                                style={styles.image}
                                            />}

                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Title"
                                        onChangeText={handleChange('title')}
                                        onBlur={handleBlur('title')}
                                        value={values?.title}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Description"
                                        onChangeText={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                        numberOfLines={4}
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