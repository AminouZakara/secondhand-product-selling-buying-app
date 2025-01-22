import { ActivityIndicator, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import CreateNewPost from '../../component/add/CreateNewPost';
import Ionicons from '@expo/vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const AddScreen = () => {
  const db = getFirestore(app);
  const navigation = useNavigation();
  const user = auth().currentUser;
  console.log("uid", user.uid);
  const [isLoading, setIsLoading] = useState(false);

  //useEffects
  useEffect(() => {
    getUserData();
  }, [])
  {/* Used to get user data from firestore end */ }
  const [userData, setUserData] = useState([])
  const getUserData = async () => {
    setUserData([])
    setIsLoading(true)
    try {
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
  console.log("User Data from Add Post: ", userData)
  {/* Used to get user data end */ }

  return (
    <KeyboardAvoidingView>
      {
        isLoading ? 
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator size="large" color="green" />
        </View>
         :
        <ScrollView>
        <View style={{ paddingTop: 0 }}>
          <View style={{ backgroundColor: "green" }}>
            <View style={{ marginTop: 40, paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>Add New Post</Text>
              {
                userData.role == "Admin" && (
                  <View style={{ flexDirection: "row", }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddSlider')}
                      style={styles.button}>
                      <Text style={{ color: "white", fontWeight: "500" }}>Add Slider</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Address')}
                      style={{
                        marginLeft: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#4CAF50",
                        borderRadius: 10
                      }}
                    >
                      <Ionicons name="location-sharp" size={24} color="white" />
                      <Ionicons name="add-outline" size={10} color="white" />
                    </TouchableOpacity>
                  </View>
                )
              }
            </View>
          </View>


          <Text style={{ marginTop: 15, fontWeight: "400", fontSize: 20, textAlign: "center" }}>Create New Post and Start Selling</Text>




          <CreateNewPost />

        </View>
      </ScrollView>
      }
     
    </KeyboardAvoidingView>

  )
}

export default AddScreen

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    width: 80,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
  }
})