import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import LatestPost from '../../component/home/LatestPost';

const SingleCategory = () => {
    const route = useRoute();
    const category = route.params.category;
   // console.log("Categ", category);
    const db = getFirestore(app);
   // console.log("Category:", route.params.category);

    const [singleCategoryList, setSingleCategoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        route && getSingleCategoryList()
    }, [route])
    const getSingleCategoryList = async () => {
        try {
            setLoading(true)
            setSingleCategoryList([]);
            const q = query(collection(db, "ventachaUserPost"), where("category", "==", category));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                //setSingleCategoryList to doc and doc id
                setSingleCategoryList(prev => [...prev, { id: doc.id, ...doc.data()
                    }])
            })
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }
   // console.log("category:", singleCategoryList);
    return (
        <View>
            {
                loading ?
                    <View style={{

                    }}>
                        <Text style={{
                            marginTop: 10,
                            fontSize: 16,
                            color: 'green',
                            textAlign: 'center',
                        }}>Loading...</Text>
                    </View>
                    :
                    <View style={styles.container}>
                        {
                            singleCategoryList?.length > 0 ? <LatestPost latestPostList={singleCategoryList} heading={""} /> :
                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    height: '100%',
                                    width: '100%',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: 'grey',
                                        fontWeight: "500",
                                        marginVertical: 20,
                                    }}>No posts found</Text>
                                </View>
                        }

                    </View>
            }
        </View>

    )
}

export default SingleCategory

const styles = StyleSheet.create({
    container: {

    },
})