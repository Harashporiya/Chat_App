import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RouterType } from './Navigation';

const Home = () => {
    const navigation = useNavigation<NavigationProp<RouterType>>();
    return (
        <>
            <View>
                <StatusBar barStyle={"light-content"} backgroundColor={"deepskyblue"} />
            </View>
          
            <View style={styles.container}>
           <View style={styles.imageContainer}>
           <Image style={styles.image} source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAgA1U0N2b4xlZeMiRSh8PVkjuPNgEqIH6fg&s"}}/>
           
           <Text style={styles.welcome}>Welcome to </Text>
           <Text style={styles.welcome}>Quick Chat</Text>
           </View>
                <TouchableOpacity onPress={() => navigation.navigate("Signin")} style={styles.btn}>
                    <Text style={styles.button}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.btn1}>
                    <Text style={styles.button}>Sign up</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.text}>Signin or Create an Account to get Started</Text>
                </View>

            </View>

        </>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        textAlign: 'center',
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
       

    },
    container: {
        flex: 2,
        backgroundColor:"white",
        justifyContent:"center"
    },
    btn: {
        margin: 10,
        backgroundColor: "gold",
        borderRadius: 10,
    },
    btn1: {
        margin: 10,
        backgroundColor: "dodgerblue",
        borderRadius: 10,
    },
    text: {
        textAlign: "center",
        fontSize: 18,
        color: "gray"
    },
    image:{
        height:100,
        width:100,
        
    },
    imageContainer:{
    alignItems:"center",
    marginBottom:40
    },
    welcome:{
        fontSize:40
    }
})

export default Home