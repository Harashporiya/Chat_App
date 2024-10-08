import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const Signup = () => {
    return (
        <>
            <View style={styles.container}>
                <Text style={{textAlign:"center", fontSize:20, fontWeight:"bold"}}>Create a new account</Text>
                <TextInput
                    placeholder='Username'
                    style={styles.input}
                />

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
        justifyContent: "center",
        margin:10,
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: "gray",
        fontSize: 18,
        margin: 10,
        padding:10
    },
    button: {
        backgroundColor: "deepskyblue",
        margin: 10,
        borderRadius: 10,
        marginTop:20
    },
    btn: {
        fontSize: 18,
        padding: 8,
        color:"white",
        textAlign:"center"
    }
})

export default Signup