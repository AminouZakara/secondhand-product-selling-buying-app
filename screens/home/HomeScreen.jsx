import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { getFirestore, collection, getDocs, query, orderBy, where, onSnapshot } from "firebase/firestore";
import Header from '../../component/home/Header'
import { app } from '../../firebaseConfig'
import Categories from '../../component/home/Categories';
import LatestPost from '../../component/home/LatestPost';
import Slider from '../../component/home/Slider';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import AppLoader from '../../component/home/AppLoader';




const HomeScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    // place the name of the App on right corner, the notification icon on left corner and the search bar bellow them
    navigation.setOptions({
      headerTitle: () => <Header />,
      headerStyle: {
        backgroundColor: "green",
        height: 120,
        borderBottomColor: "transparent",
        shadowColor: "transparent"
      },
    });
  }, [navigation]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const db = getFirestore(app);
  const user = auth().currentUser;
  //useStates
  const [sliderList, setSliderList] = useState([])
  const [ventachaCategoryList, setVentaCategoryList] = useState([])
  const [latestPostList, setLatestPostList] = useState([])
  //------- useStates end ------------------

  // useEffect
  useEffect(() => {
    getSliderList();
    getVentachaCategoryList();
    getLatestPostList();
    getUserData();
    getPendingPosts();
  }, [])
  // useEffect end

  {/* Used to get sliderList */ }
  const getSliderList = async () => {
    setSliderList([])
    setIsLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "ventachaSliderPost"), orderBy("createdAt", "desc"));
      querySnapshot.forEach((doc) => {
        setSliderList((prev) => [...prev, { id: doc.id, ...doc.data() }]);
      });
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  }
  {/*------- Used to get sliderList end ------- */ }

  {/* Used to get ventachaCategory */ }
  const getVentachaCategoryList = async () => {
    setIsLoading(true)
    try {
      setVentaCategoryList([]);
      const querySnapshot = await getDocs(collection(db, "ventachaCategory"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setVentaCategoryList((prev) => [...prev, { id: doc.id, ...doc.data() }]);
        setIsLoading(false)
      });
    } catch (error) {
      console.log("Oops! cannot get ventachaCategory: ...", error)
      setIsLoading(false)
    }

  }
  {/* Used to get ventachaCategory end */ }

  {/* Used to get the LatestPost */ }
  const getLatestPostList = async () => {
    setIsLoading(true)
    try {
      setLatestPostList([])
      const unsub = onSnapshot(query(collection(db, 'ventachaUserPost'), where('status', '==', 'accepted'), orderBy("createdAt", "desc")),
        (querySnapshot) => {
          const go = [];
          querySnapshot.forEach((doc) => {
            go.push({ id: doc.id, ...doc.data() });
          });
          setLatestPostList(go);
          setIsLoading(false)
        }
      );
      return () => unsub();
    } catch (error) {
      console.log("Oops! cannot get latestPost: ", error)
      setIsLoading(false)
    }
  }
  console.log("Ventacha Latest Post", latestPostList.length)

  //get user data from firestore
  const [userData, setUserData] = useState([])
  const getUserData = async () => {
    setIsLoading(true)
    try {
      setUserData([])
      const q = query(collection(db, "ventachaUsers"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots.
        setUserData(doc.data());
      });
      setIsLoading(false)
    } catch (error) {
      console.log("Oops! cannot get user data: ", error)
      setIsLoading(false)
    }
  }
  console.log("User role: ", userData.role)
  {/* Used to get user data end */ }
  // get ventachaUserPosts from firestore where status is 'pending'
  const [pendingPosts, setPendingPosts] = useState([])
  const getPendingPosts = async () => {
    setIsLoading(true)
    try {
      setPendingPosts([])
      const unsub = onSnapshot(query(collection(db, 'ventachaUserPost'), where('status', '==', 'pending')),
        (querySnapshot) => {
          const go = [];
          querySnapshot.forEach((doc) => {
            go.push({ id: doc.id, ...doc.data() });
          });
          setPendingPosts(go);
          setIsLoading(false)
        }
      );
      return () => unsub();
    } catch (error) {
      console.error(error);
    }
  }
  console.log("Pending Posts", pendingPosts.length);



  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)

    }, 3000)
    auth().onAuthStateChanged(user => {


    });


    return () => clearTimeout(timer);

  }, []);

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

      }}>

        <Image source={require('../../assets/images/logo.png')} style={{
          width: 100,
          height: 100,
        }} />

      </View>
    );
  }
  return (
    <View style={styles.container}>
      {
        isLoading ? (
          <View style={{
            position: 'absolute',
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,.5)",
            justifyContent: "center"
          }}>
            <Image source={require('../../assets/images/logo.png')} style={{
              width: 300,
              height: 300,
            }} />
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : (
          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >

              {/* Slider */}
              <View style={{
              }}>
                <Slider sliderList={sliderList} />
              </View>

              {/* Categories */}
              <View style={{
                paddingTop: 10,
                paddingLeft: 10,


              }}>
                <Categories ventachaCategoryList={ventachaCategoryList} />
              </View>

              {/* Latest Posts */}
              <View style={{
                borderTopWidth: 8,
                borderColor: "white"

              }}>
                <View style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: 'black', }}>Latest Posts</Text>
                  </View>

                  <View>
                    {/*  if  user is Admin then show the pending */}
                    {userData.role === 'Admin' && (
                      <TouchableOpacity
                        style={{
                          width: 100,
                          padding: 10,
                          backgroundColor: "green",
                          borderRadius: 10
                        }}
                        onPress={() => { navigation.navigate('PendingPostScreen') }}
                      >
                        <Text style={{
                          textAlign: "center",
                          fontSize: 18,
                          color: "white",
                          fontWeight: "bold",
                        }}>
                          Pending
                        </Text>

                        {/*show the number of the userData on the top right corner the pending like notification */}
                        <View style={{
                          position: "absolute", top: 0, right: 0,
                          backgroundColor: "red", color: "white", padding: 5, borderRadius: 10
                        }}
                        >
                          <Text style={{ fontSize: 12, color: "white" }}>{pendingPosts.length}</Text>

                        </View>


                      </TouchableOpacity>
                    )}

                  </View>
                </View>
                {
                  latestPostList.length > 0 ? (
                    <LatestPost latestPostList={latestPostList} />
                  ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ marginTop: 30, fontSize: 20, fontWeight: 'bold' }}>No Posts Found</Text>
                    </View>
                  )
                }
              </View>
            </ScrollView>

          </View>
        )

      }


    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'beige',
  },
})