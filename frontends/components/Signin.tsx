import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableHighlightBase } from 'react-native'
import React from 'react'

const Signin = () => {
    return (
        <>
            <View style={styles.container}>
                <Text style={{textAlign:"center", fontSize:20, fontWeight:"bold"}}>Sign in your account</Text>

                <TextInput
                    placeholder='@example.com'
                    style={styles.input}
                />
                <TextInput
                    placeholder='password'
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.btn}>Signin</Text>
                </TouchableOpacity>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: "gray",
        fontSize: 18,
        margin: 20,
        padding:10
    },
    button: {
        backgroundColor: "deepskyblue",
        margin: 10,
        borderRadius: 10,
    },
    btn: {
       fontWeight:"bold",
        fontSize: 18,
        padding: 8,
        color:"white",
        textAlign:"center"
    }
})

export default Signin