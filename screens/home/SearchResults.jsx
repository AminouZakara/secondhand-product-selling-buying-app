import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import LatestPost from '../../component/home/LatestPost';

const SearchResults = () => {
    const route = useRoute();
    const filtered = route.params.filteredProducts;
    const [isLoading, setIsLoading] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    useEffect(() => {
        setFilteredProducts(filtered)
    }, [filtered])

    console.log("filtered", filtered);
    console.log("filtered length", filteredProducts?.length);


    if (isLoading) {
        return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={{
                backgroundColor: '#f0f0f0',
                padding: 4,
            }}>
                {
                    filteredProducts?.length > 0 ? (
                        <LatestPost latestPostList={filteredProducts} />
                    ) : (
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 20,
                            
                        }}>
                            <Text style={{textAlign:"center", fontSize: 20, color: '#000000' }}>No results found</Text>
                        </View>
                    )

                }
            </View>
        </View>
    )
}

export default SearchResults

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})