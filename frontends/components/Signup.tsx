import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../API_BACKENDS/Backend_API'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RouterType } from './Navigation'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Signup = () => {
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassowrd] = useState('')

    const navigation = useNavigation<NavigationProp<RouterType>>()

    const handelSubmit=async()=>{
        if(!username.trim() || !email.trim() || !password.trim()){
            Alert.alert("error", "All fields are requirdes")
            return;
        }
        try {
            const res = await axios.post(`${BACKEND_URL}/api/signup`,{
                username,
                email,
                password,
            })
            // console.log(res.data)
            Alert.alert("success", "Account Create Successfull")
            
            AsyncStorage.setItem("UserId", res.data.createUser._id)
            setUserName('')
            setEmail('')
            setPassowrd('')
            navigation.navigate("Chats")
        } catch (error) {
            console.log("ERROR",error)
            Alert.alert("error", "Internal server error")
        }
    }
    return (
        <>
            <View style={styles.container}>
                <Text style={{textAlign:"center", fontSize:20, fontWeight:"bold"}}>Create a new account</Text>
                <TextInput
                    placeholder='Username'
                    style={styles.input}
                    value={username}
                    onChangeText={(text)=>setUserName(text)}
                />

                <TextInput
                    placeholder='@example.com'
                    style={styles.input}
                    value={email}
                    onChangeText={(text)=>setEmail(text)}
                />
                <TextInput
                    placeholder='password'
                    style={styles.input}
                    value={password}
                    onChangeText={(text)=>setPassowrd(text)}
                />
                <TouchableOpacity style={styles.button} onPress={()=>handelSubmit()}>
                    <Text style={styles.btn}>Create account new</Text>
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