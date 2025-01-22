import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import auth, { firebase } from '@react-native-firebase/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';


const ProfileScreen = () => {
  const db = getFirestore(app);
  const user = auth().currentUser;
  const navigation = useNavigation();
  const [userAuth, setUserAuth] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // useEffect
  useEffect(() => {
    getUserData()
  }, [])
  //Sign out
  const SignOut = () => {
    //ask the user if he really wanna logout
    Alert.alert(
      'Logout',
      'Are you sure you wanna logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            auth().signOut().then(() => {
              setUserAuth(null);
              console.log('Signed out')
              navigation.navigate('Login')
            })
          }
        }
      ]
    );
  }


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
  console.log("User Data: ", userData)
  {/* Used to get user data end */ }

  return (
    <View>
      <View style={styles.subContainer}>
        <Image
          source={{ uri: user.photoURL }}
          style={styles.userImage} />
        <TouchableOpacity 
        onPress={() => navigation.navigate("EditProfile", {
          userData: userData,
        })} 
        style={{ marginBottom: 10 }}>
          <AntDesign name="edit" size={24} color="green" />
        </TouchableOpacity>

        <Text style={styles.userFullname}>{user.displayName}</Text>
        <Text style={styles.userEmail}> {user.email} </Text>
      </View>

      {/* My product*/}
      <TouchableOpacity
        onPress={() => navigation.navigate("MyProduct")}
        style={{
          paddingTop: 100,
          flexDirection: "row",
          alignItems: "center",

        }}>
        <Image
          source={require('../../assets/images/products.jpg')}
          style={styles.myProduct} />

        <Text style={styles.productTitle}> My Product </Text>

      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={SignOut}

        style={{
          paddingTop: 100,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Image
          source={require('../../assets/images/logout.jpg')}
          style={styles.logout} />
        <Text style={styles}> Logout </Text>
      </TouchableOpacity>



    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  subContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10
  },
  userFullname: {
    fontSize: 20,
    color: '#000',
  },
  userEmail: {
    fontSize: 15,
    color: '#000',
  },
  myProduct: {
    width: 100,
    height: 100,
    margin: 20
  },
  productTitle: {
    fontSize: 15,
    color: '#000',

  },
  logout: {
    width: 60,
    height: 60,
    margin: 10
  }
})