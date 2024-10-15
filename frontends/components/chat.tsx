import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import FooterPage from "./footer";
import axios from "axios";
import { BACKEND_URL } from "../API_BACKENDS/Backend_API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { RouterType } from "./Navigation";

interface User {
  loginUsername: string;
  acceptUserId: string;
  loginUserId: string ;
  _id: string;
  username: string;
  profileImage: string;
}

interface UserData {
  message: string;
  allAcceptsUser: User[];
}

const ChatApp = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [idUserlogin, setUserIdLogin] = useState<string | null>(null);
  const [roomId,setRoomId] = useState<string| null>(null);
   
  const navigation = useNavigation<NavigationProp<RouterType>>();
  const route = useRoute();

  useEffect(() => {
    const fetchUsersData = async () => {
      const userIdLogin = await AsyncStorage.getItem("UserId");
      const loginUsername = await AsyncStorage.getItem("Username");
      setUserIdLogin(userIdLogin);

      try {
        const res = await axios.get(`${BACKEND_URL}/api/all/accepts`);
        setUserData(res.data);
      } catch (error) {
        console.log("ERROR hello", error);
      }
    };
    fetchUsersData();
  }, []);

  const showDataByUser = async(user: User) => {
    const filterUsers = (users: User[], userId: string | null) => {
      return users.filter(user => 
        (user.loginUserId === userId && user.acceptUserId !== userId) ||
        (user.acceptUserId === userId && user.loginUserId !== userId)
      );
    };

    const sentUserId = user.loginUserId === idUserlogin ? user.acceptUserId : user.loginUserId;
    const loginUserId = await AsyncStorage.getItem("UserId")
   
    try {
      const res = await axios.post(`${BACKEND_URL}/api/message`,{
       
        
        loginUserId,
        sentUserId,
      })
      // console.log(res.data)
        setRoomId(res.data.room._id);
    } catch (error) {
      console.log("ERROR hi",error)
    }
    // console.log("RoomId hi:", roomId)
    navigation.navigate("ChatUser", { 
        id: user._id, 
        username: user.loginUserId === idUserlogin ? user.username : user.loginUsername,
        profileImage:user.profileImage,
        sentIdUser:roomId as string,
    });
  };

   const   handel = (sentUserId:string)=>{
    AsyncStorage.setItem("sentId",sentUserId);
    // console.log(userIdLogin)
  }
  

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.header}>Messages</Text>
          {userData?.allAcceptsUser.filter(user=>(user.loginUserId === idUserlogin && user.acceptUserId !== idUserlogin)
          || (user.acceptUserId === idUserlogin && user.loginUserId !== idUserlogin)).map(user => (
              <TouchableOpacity key={user._id} onPress={() =>{ showDataByUser(user);handel(user._id)}}>
                <View style={styles.userCard}>
                  <View style={styles.avatar}>
                    <Image 
                      style={styles.image}
                      source={{
                        uri: user.profileImage 
                      }}
                    />
                    <View style={styles.onlineIndicator} />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.username}>{user.loginUserId === idUserlogin ? user.username : user.loginUsername}</Text>
                    <Text style={styles.lastMessage}>Hey, how are you?</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>2:30 PM</Text>
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>2</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      {/* <FooterPage /> */}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
    marginLeft: 8,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  timeContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChatApp;