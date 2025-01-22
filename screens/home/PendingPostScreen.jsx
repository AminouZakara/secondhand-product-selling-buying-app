
import { FlatList, Image, TouchableOpacity, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import Ionicons from '@expo/vector-icons/Ionicons';
import LatestPost from '../../component/home/LatestPost'


const PendingPostScreen = () => {
  const db = getFirestore(app);
  const navigation = useNavigation();
  const user = auth().currentUser;
  const [pendingPosts, setPendingPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPendingPosts();
  }, [])
  // get instants ventachaUserPosts from firestore where status is 'pending'

  const getPendingPosts = async () => {
    setLoading(true)

    try {
      setPendingPosts([])
      const unsub = onSnapshot(query(collection(db, 'ventachaUserPost'), where('status', '==', 'pending')),
        (querySnapshot) => {
          const go = [];
          querySnapshot.forEach((doc) => {
            go.push({ id: doc.id, ...doc.data() });
          });
          setPendingPosts(go);
          setLoading(false)
        }
      );
      return () => unsub();
    } catch (error) {
      console.log(error);
    }
  }

  //console.log("Pending Posts", pendingPosts.length);

  return (
    <View>
      {
        loading ? (
          <View style={{}} >
            <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 60 }} />
          </View >
        ) :
          (
            <View>
              {
                pendingPosts.length > 0 ? (
                  <LatestPost latestPostList={pendingPosts} />
                  ) : (
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 60}}>
                      <Text style={{color: 'green', fontSize: 18}}>No pending posts
                      </Text>
                      </View>
                      )
              }
            </View>
          )

      }
    </View>
  )
}

export default PendingPostScreen

const styles = StyleSheet.create({})