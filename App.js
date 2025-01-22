import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';



export default function App() {
  const [isLoading, setIsLoading] = useState(true)

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
      
                <Image source={require('./assets/images/logo.png')} style={{
                  width: 100,
                  height: 100,
                  }} />
                
                </View>
    );
  }
  return (
    <>
      <StatusBar style="light" />
      <StackNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
