import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const SearchScreen = () => {
    const db = getFirestore(app);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const [allProducts, setAllProducts] = useState([]);

    const [filteredProducts, setFilteredProducts] = useState([]);
    // useEffect
    useEffect(() => {
        getAllProducts();
    }, [])
    // useEffect end
    {/* Used to get AllProducts */ }
    const getAllProducts = async () => {
        setIsLoading(true)
        try {
            setAllProducts([])
            const q = query(collection(db, "ventachaUserPost"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setAllProducts((prev) => [...prev, { id: doc.id, ...doc.data() }]);
            });
            setIsLoading(false)
        } catch (error) {
            console.log("Oops! cannot get latestPost: ", error)
            setIsLoading(false)
        }
    }
    // console.log("allProducts", allProducts.title)

    {/* Used to filter the products */ }
    const handleSearchResult = () => {
        const filtered = allProducts.filter((product) => product.title.toLowerCase().includes(searchItem.toLowerCase()));
        setFilteredProducts(filtered);
        navigation.navigate("SearchResults", {
            searchItem: searchItem,
            filteredProducts: filtered,
        })
    }
    console.log("filteredProducts", filteredProducts)
    {/* Used to handle the search bar */ }


    return (
        <View style={styles.container}>
            <View
                style={{
                    paddingTop: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10

                }}>
                <View

                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderWidth: 0.5,
                        borderColor: "orange",
                        borderRadius: 15,
                        backgroundColor: "white",
                    }}>
                    <Ionicons onPress={() => navigation.goBack()} name="arrow-back-sharp" size={24} color="black" />
                    <TextInput
                        placeholder='Voiture, telephone, moto, vélo,  etc...'
                        placeholderTextColor="orange"
                        clearButtonMode="always"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={searchItem}
                        onChangeText={(text) => setSearchItem(text)}
                        style={{
                            paddingLeft: 10,
                            width: "85%",
                            fontSize: 18,
                            fontWeight: "300",
                            color: "green",
                            opacity: 0.8,
                        }}
                    />
                    <AntDesign onPress={() => handleSearchResult()} name="search1" size={24} color="green" />
                </View>

            </View>

            {/* search results options */}
            <View style={{
                width: "100%",
            }}>
                {/*Show search results */}
                {
                    searchItem ? 
                    <View style={{
                        flexDirection:"row",
                        justifyContent: "space-between",
                        paddingHorizontal: 10,
                        width: "100%"
                    }}>
                        <Text style={{ fontSize: 15, color: "green", fontWeight: "400", padding: 5, }}>Resultats</Text>
                        <Text style={{ fontSize: 15, color: "green", fontWeight: "400", padding: 5, }}>Categories</Text>
    
                    </View>
                    : null
                }
                
                <FlatList
                    data={allProducts}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        if (item.title.toLowerCase().includes(searchItem.toLowerCase())) {
                            if (searchItem === "") {
                                return null;
                            }
                            return (
                                <TouchableOpacity 
                                
                                onPress={()=> navigation.navigate('SingleCategory',{
                                    category: item.category
                                  })} 
                                >
                                    <View style={{
                                        width: "100%",
                                        flexDirection: 'row',
                                        padding: 8,
                                        paddingHorizontal: 16,
                                        justifyContent:"space-between"
                                    }}>
                                        <Text style={{fontWeight:"600", color:"grey"}}>{item.title}</Text>
                                        <Text style={{fontWeight:"300", color:"grey"}}> {item.category} </Text>
                                    </View>
                                </TouchableOpacity>
                           
    )}
                    }}
                />


            </View>
        </View >
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
})