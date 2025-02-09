import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableHighlightBase, Alert } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../API_BACKENDS/Backend_API'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RouterType } from './Navigation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { io, Socket } from 'socket.io-client'
import CookieManager from '@react-native-cookies/cookies';
const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassowrd] = useState('')
    const navigation = useNavigation<NavigationProp<RouterType>>() 
    const handelSubmit=async()=>{
        if(!email.trim() || !password.trim()){
            Alert.alert("error", "All fields are requireds")
            return;
        }
        try {
            const res = await axios.post(`${BACKEND_URL}/api/signin`,{
                email,
                password
            })
            // CookieManager.set("authorization",res.data.token)
           // initSocketConnection()
            AsyncStorage.setItem("UserId", res.data.user._id)
            AsyncStorage.setItem("Username", res.data.user.username)
            AsyncStorage.setItem("token", res.data.token)
            // console.log(res.data.token)
            Alert.alert("success","Signin Successfull");
            // console.log(res.data)
            setEmail('')
            setPassowrd('')
            navigation.navigate("Chats")
        } catch (error) {
            console.log("ERROR",error)
            Alert.alert("error", "Internal server error")
            
        }
    }
    // async function initSocketConnection() {
    //     try {
    //       let userId = await AsyncStorage.getItem('UserId');
         
      
    //       const socket: Socket = io(BACKEND_URL, {
    //         auth: {
    //           userId,
    //         },
    //       });
      
    //       // Socket.IO event handlers
    //       socket.on('connect', () => {
    //         console.log('Connected to Socket.IO server with userId:', userId);
    //       });
      
    //       socket.on('disconnect', () => {
    //         console.log('Disconnected from Socket.IO server');
    //       });
      
    //       return socket;
    //     } catch (error) {
    //       console.error('Error initializing Socket.IO connection:', error);
    //       throw error;
    //     }
    //   }
    return (
        <>
            <View style={styles.container}>
                <Text style={{textAlign:"center", fontSize:20, fontWeight:"bold"}}>Sign in your account</Text>

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