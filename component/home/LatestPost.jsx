import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PostList from '../../screens/home/PostList'

const LatestPost = ({ latestPostList, heading }) => {
  //console.log("Latest Post:....", latestPostList)
  //<Text style={{fontSize:18, fontWeight:"500", color:"darkgreen", }}> {heading} </Text>
  return (
    <View
    showsVerticalScrollIndicator={false}

     style={{
      paddingHorizontal: 4,
    }}>
      <FlatList
        data={latestPostList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        renderItem={({ item, index }) => (
         <PostList id={item.id} post={item} />
        )}
      />
    </View>
  )
}

export default LatestPost

const styles = StyleSheet.create({

})