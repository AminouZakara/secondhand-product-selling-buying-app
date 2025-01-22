import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const Categories = ({ ventachaCategoryList }) => {
  const navigation = useNavigation();

  return (
    <View style={{
      backgroundColor:"beige",
      width:"100%",
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: "600",
        color: 'black',
      }}> Categories</Text>
    
<FlatList
//index<=7&&
        data={ventachaCategoryList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) =>(
          <TouchableOpacity
          onPress={()=> navigation.navigate('SingleCategory',{
            category: item.name
          })} 
          key={index} 
          style={styles.item}>
            <View style={styles.imageContainer}>
            <Image source={{ uri: item.icon }} style={styles.image} />
            </View>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
  item:{
    marginTop:20,
    marginRight:10,
    marginBottom:10,
    justifyContent:"center",
    alignItems:"center",
    width: 95,
    height:95,

  },
  imageContainer:{
    justifyContent:"center",
    alignItems:"center",
    width: 65,
    height: 65,
    backgroundColor:"white",
    borderWidth:0.2,
    borderColor: "green",
    borderRadius:70,
    elevation:1.8,
    shadowColor:"green",
    shadowOpacity:0.8,
    shadowOffset:10



  },
  image: {
    width: 50,
    height: 50,
   
  },
  itemText:{
    color:"black",
    marginTop:3,
    fontSize: 16,
    letterSpacing:0.6,
    fontWeight:"600",
    fontFamily:"Helvetica",
    textAlign:"center",
  }
})