import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import LatestPost from '../../component/home/LatestPost';


const SoldProducts = () => {
    const user = auth().currentUser;
    const db = getFirestore(app)
    const navigation = useNavigation();
    const [myProduct, setMyProduct] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getMyProduct()
    }, [])
    const getMyProduct = async () => {
        setLoading(true)
        try {
            setMyProduct([])
            // bring the products where userId = user.uid and status = sold
            const q = query(collection(db, "ventachaUserPost"), where("userId", "==", user.uid), where("status", "==", "sold"))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(doc => {
                setMyProduct(prev => [...prev, { id: doc.id, ...doc.data() }])
            })
            setLoading(false)
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <View style={styles.container}>
            {
                loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 60 }} />
                    </View>
                ) : (
                    <>
                        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", padding: 10, backgroundColor: "#f0f0f0" }}>

                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    padding: 10,
                                    elevation: 5,
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{ color: "green", fontSize: 16 }}>Active Products</Text>
                            </TouchableOpacity>

                            <Text style={{ color: "orange", fontSize: 18, fontWeight: "bold" }}>Sold Products</Text>

                        </View>
                        <View>
                            {
                                myProduct.length > 0 ? (
                                    <LatestPost latestPostList={myProduct} />

                                ) : (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ marginTop: 30, fontSize: 18, fontWeight: '400' }}>No Sold Product Found</Text>
                                    </View>
                                )

                            }

                        </View>
                    </>

                )
            }
        </View>
    )
}

export default SoldProducts

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8
    },

    myProduct: {
        textAlign: "center",
        fontWeight: "400",
        paddingBottom: 10,
        fontSize: 20,
        color: '#000',
    },
})