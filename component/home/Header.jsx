import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
const Header = () => {
  const navigation = useNavigation();

  //find the product searched from the search bar and display them in the FindScreen
  const [search, setSearch] = useState('')
  const handleSearch = () => {
    navigation.navigate('SearchResults', { search: search });
  }
  
  //navigation.navigate("notification")

  return (
    <View >
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 15, }}>
        <Text style={{ color: "orange", fontWeight: "600", fontSize: 20 }}>Ventacha</Text>
        <TouchableOpacity onPress={() => console.log("Notification Clicked")
         }>
          <Ionicons name="notifications-sharp" size={24} color="orange" />
        </TouchableOpacity>
      </View>
      <Pressable
        onPress={() => navigation.navigate("SearchScreen")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 0.5,
          borderColor: "orange",
          borderRadius: 15,
          backgroundColor: "white",
        }}>
        <AntDesign name="search1" size={24} color="green" />
        <TextInput
          placeholder='Voiture, telephone, moto, vélo,  etc...'
          placeholderTextColor="orange"
          editable={false}
          style={{
            paddingLeft: 10,
            width: "95%",
            fontSize: 18,
            fontWeight: "300",
            color: "green",
            opacity: 0.8,
          }}
        />
      </Pressable>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({

})