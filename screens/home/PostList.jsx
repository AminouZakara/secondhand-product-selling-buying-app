import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';


const PostList = ({ post, index, id }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('PostDetails', {
                postTitle: post.title,
                post: post,
                id: id
            })}

            key={index}
            style={{
                margin: 4,
                padding:8,
                flex: 1,
                borderWidth: 0.5,
                borderColor: '#ddd',
                borderRadius: 10,
                backgroundColor: "#fff"
            }}
            >
           
                
                    <Image source={{ uri: post.image }} style={{
                        width: "100%",
                        height: 130,
                        resizeMode: "contain",
                        alignSelf:"center",
                    }} />
                    <View style={{ marginTop: 8, }}>
                        <Text style={{ color: "black", fontWeight: "500", fontSize: 22 }}><Text style={{ color: "grey", fontWeight: "400", fontSize: 25 }}>D</Text>{post.price}  </Text>
                        <Text style={{ color: "black", fontWeight: "300", fontSize: 18, }}>{post.title}</Text>

                        <View style={{
                        paddingTop: 14,
                        paddingBottom: 8,
                        flexDirection: "row",
                    }}><Ionicons name="location-sharp" size={20} color="darkgreen" />
                        <Text style={{ color: "orange", fontWeight: "400", fontSize: 14 }}>{post.address} </Text>
                    </View>
                    </View>
                    


        </TouchableOpacity>
    )
}

export default PostList

const styles = StyleSheet.create({})