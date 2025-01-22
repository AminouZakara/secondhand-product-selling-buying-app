import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';


const AppLoader = ({ visible = true }) => {
    const { height, width } = useWindowDimensions();
    return (
        visible && (
            <View style={[styles.container, { width, height }]}>
                <View style={{ flex: 1, alignItems: "center", backgroundColor: "white", }} >

                    {/* show the background logo image */}
                    <Image source={require('../../assets/images/logo.png')} style={{
                        width: "50%", height: 150,
                        resizeMode: "contain",
                        marginVertical: 20,
                        marginTop: 150
                    }}
                    />
                    <View style={{
                        backgroundColor: "white", height: 70,

                    }}>
                        <DotIndicator color='orange' size={15} count={5} />
                    </View>





                </View>
            </View>

        )

    )
}

export default AppLoader

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,.5)",
        justifyContent: "center"
    },
    loader: {
        height: 90,
        marginHorizontal: 80,
        borderRadius: 10,
        paddingHorizontal: 20,

    }
})