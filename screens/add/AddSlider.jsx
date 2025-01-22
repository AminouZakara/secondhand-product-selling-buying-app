import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import CreateNewSlider from '../../component/add/CreateNewSlider';
import Ionicons from '@expo/vector-icons/Ionicons';


const AddSlider = () => {
    const navigation = useNavigation();

    return (
        <KeyboardAvoidingView>
            <ScrollView>

            <View style={{ backgroundColor: "green" }}>
                <View style={{ marginTop: 40, paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
                      {
                                navigation.canGoBack() && (
                                  <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Ionicons name="arrow-back" size={24} color="white" />
                                  </TouchableOpacity>
                                  )
                              }
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.button}>
                        <Text style={{ color: "white", fontWeight: "500" }}>Add Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ marginTop: 15, fontWeight: "300", fontSize: 24, textAlign: "center" }}>Create New Slider</Text>

            <CreateNewSlider />
            </ScrollView>
        </KeyboardAvoidingView>

    )
}

export default AddSlider

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