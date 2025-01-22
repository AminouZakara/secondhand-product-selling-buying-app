import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

const Slider = ({ sliderList }) => {
  //console.log("Slider:", sliderList)
  const navigation = useNavigation();
  const user = auth().currentUser;
  return (
    <View style={{
      backgroundColor: "white",
      height: 180,
      width: "100%",
      
      
    }}>
      <View>
        <FlatList
          data={sliderList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View key={index} style={{
              flexDirection: "row",
              height: 180,
              //margin right : 10, margin left only beginning of the list 10
              marginHorizontal: 4,
              marginRight: 0,
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: 0.5,
              borderRightColor: "green",

            }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("SliderDetails", {
                  sliderTitle: item.title,
                  slider: item
                })}
                style={{
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    width: 150,
                    height: 165,
                    flexDirection: "column",
                    marginTop: 2, 
                    paddingLeft: 2
                  }}
                >
                  <Text 
                  style={{fontWeight:"600"}}
                  >{item.title}</Text>
                  
                  <Text 
                  style={{color:"grey", fontSize:13, marginTop:5 
                  }}>{item.description} </Text>

                  <Text 
                  style={{fontWeight:"900", fontSize:16, marginTop:10 
                  }}>{item.price} CFA</Text>
                </View>

                <Image source={{ uri: item.image }} style={styles.sliderImage} />


              </TouchableOpacity>

            </View>
          )}

        />
      </View>
    </View>
  )
}

export default Slider

const styles = StyleSheet.create({
  sliderImage: {
    width: 230,
    height: 170,
    resizeMode: "contain",
  }
})