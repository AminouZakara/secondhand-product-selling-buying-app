import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import LatestPost from '../../component/home/LatestPost'

const Explore = () => {
    const [loading, setLoading] = useState(false);

    const db = getFirestore(app)
    useEffect(() => {
        getAllProduct();
    }, [])
    // used to get All the Product
    const [allProducts, setAllProducts] = useState([]);
    const getAllProduct = async () => {
        setAllProducts([]);
        setLoading(true)
        try {
            const q = query(collection(db, "ventachaUserPost"), orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(doc => {
                setAllProducts(prev => [...prev, doc.data()])
                //console.log(doc.id, '=>', doc.data())
            });
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }
    //console.log("All Products", allProducts);

    return (
        <View style={styles.container}>

            <Text style={styles.headerText}>Explore More</Text>
            {
                loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 60 }} />
                    </View>
                ) : (
                    <View style={{paddingTop:8}}>
                        <LatestPost latestPostList={allProducts} />
                    </View>

                )
            }
        </View>
    )
}

export default Explore

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        padding: 10,
        flex: 1,
    },
    headerText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "500",
        color: "orange",
        shadowColor: "green"
    }
})