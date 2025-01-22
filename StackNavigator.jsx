import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home/HomeScreen';
import AddScreen from './screens/add/AddScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AddSlider from './screens/add/AddSlider';
import SingleCategory from './screens/home/SingleCategory';
import PostDetails from './screens/home/PostDetails';
import Notification from './screens/home/Notification';
import Explore from './screens/explore/Explore';
import MyProduct from './screens/profile/MyProduct';
import Login from './Login';
import LoginWithGoogle from './LoginWithGoogle';
import Door from './Door';
import Address from './screens/add/Address';
import SliderDetails from './screens/home/SliderDetails';
import SearchScreen from './screens/home/SearchScreen';
import SearchResults from './screens/home/SearchResults';
import PendingPostScreen from './screens/home/PendingPostScreen';
import PendingPostDetails from './screens/home/PendingPostDetails';
import EditProfile from './screens/profile/EditProfile';
import SoldProducts from './screens/profile/SoldProducts';
import ActiveProducts from './screens/profile/ActiveProducts';


const StackNavigator = () => {
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    const BottomTabs = () => {
        return (
            <Tab.Navigator
                screenOptions={
                    {
                        headerStyle: {
                            backgroundColor: 'green',
                            height: 60,
                        },
                        headerTintColor: 'orange',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        tabBarStyle: {
                            //backgroundColor: 'green',
                            height: 60
                        },
                        tabBarActiveTintColor: 'green',
                        tabBarInactiveTintColor: 'orange',
                    }
                }
            >
                <Tab.Screen name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: "Home",
                        headerShown: true,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                        ),
                    }}
                />
                {/* 
                <Tab.Screen name="Explore"
                    component={Explore}
                    options={{
                        tabBarLabel: "Explore More",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? 'search-sharp' : 'search-outline'} color={color} size={24} />
                        ),
                    }}
                />
                */}

                <Tab.Screen name="Add"
                    component={AddScreen}
                    options={{
                        title: "Add New Post",
                        tabBarLabel: "Add",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                           
                            <MaterialIcons name={focused ? 'add-a-photo' : 'add-to-photos' } color={color} size={30} />
                        ),
                    }}
                />
                <Tab.Screen name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={
                                color} size={24} />
                        ),
                    }}
                />
            </Tab.Navigator>
        )
    }
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Door" component={Door} options={{ headerShown: false }} />
                <Stack.Screen name="LoginWithGoogle" component={LoginWithGoogle} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
                <Stack.Screen name='SearchScreen' component={SearchScreen} options={{ headerShown: false }} />
                <Stack.Screen name='SearchResults' component={SearchResults}
                    options={
                        ({ route }) => ({ title: route.params.searchItem, })
                    
                    }
                />
                <Stack.Screen name='AddSlider' component={AddSlider} options={{ headerShown: false }} />
                <Stack.Screen name='Address' component={Address} options={{ headerShown: false }} />
                <Stack.Screen name='SingleCategory' component={SingleCategory} options={({ route }) => ({
                    title: route.params.category,
                })} />
                <Stack.Screen name='PostDetails' component={PostDetails}
                    options={({ route }) => ({ title: route.params.postTitle, })} />

                <Stack.Screen name='SliderDetails' component={SliderDetails}
                    options={({ route }) => ({ title: route.params.sliderTitle, })} />

                {/* Pending */}
                <Stack.Screen name='PendingPostScreen' component={PendingPostScreen} options={{ 
                    title: 'Pending Posts',

                 }} />
                <Stack.Screen name='PendingPostDetails' component={PendingPostDetails} options={{ 
                    title: 'Pending Post Details',
                 }} />
                {/* Profie */}
                <Stack.Screen name='EditProfile' component={EditProfile} options={{
                    title: "Edit My Profile",
                    headerShown: true,
                }}
                />
                <Stack.Screen name='MyProduct' component={MyProduct} options={{
                    title: "My Products",
                    headerShown: true,
                }}
                />
                <Stack.Screen name='ActiveProducts' component={ActiveProducts} options={{
                    title: "Active Products",
                    headerShown: true,
                }}
                />
                
                <Stack.Screen name='SoldProducts' component={SoldProducts} options={{
                    title: "Sold Products",
                    headerShown: true,
                }}
                />
                
                <Stack.Screen name='notification' component={Notification} options={{
                    title: "Notification",
                    headerShown: true,
                }}
                />



            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})