import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import FooterPage from "../footer";
import axios from "axios";
import { BACKEND_URL } from "../../API_BACKENDS/Backend_API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RouterType } from "../Navigation";

interface User {
  sentFriendId: string | null;
  _id: string;
  username: string;
  profileImage: string;
}

interface UserData {
  message: string;
  userdata: User[];
}

const NotificationsPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      const loggedInUserId = await AsyncStorage.getItem("UserId");
      setUserId(loggedInUserId);
    //   console.log(loggedInUserId);

      try {
        const res = await axios.get(`${BACKEND_URL}/api/sent`);
        
        const filteredRequests = res.data.userdata.filter((request: User) => request.sentFriendId === loggedInUserId);
        setUserData({ ...res.data, userdata: filteredRequests });
        // console.log("Filtered Requests:", filteredRequests);
      } catch (error) {
        console.log("Failed to fetch users data: ", error);
      }
    };
    fetchUsersData();
  }, []);

 
    const handleAccept =async (username:string,acceptUserId:string ) => {
   
     try {
      const res = await axios.post(`${BACKEND_URL}/api/accepts`,{
        username, acceptUserId
      });
      Alert.alert("success", "Friend request accept")
      console.log(res.data)
     } catch (error) {
      console.log("ERROR",error);
      Alert.alert("error", "Friend request accept error")
     }
      
    };
  

  const handleDecline = (friendId: string) => {
   
    console.log(`Declined friend request from: ${friendId}`);
   
  };



  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {userData && userData.userdata.length > 0 ? (
            userData.userdata.map((user) => (
              <View key={user._id} style={styles.userCard}>
                <View style={styles.avatar}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: user.profileImage,
                    }}
                  />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.lastMessage}>New Friend request</Text>
                  <View style={styles.button}>
                    <TouchableOpacity 
                      style={styles.acceptButton} 
                      onPress={() => handleAccept(user._id, user.username)}
                    >
                      <Text style={styles.buttonText}>ACCEPT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.declineButton} 
                      onPress={() => handleDecline(user._id)}
                    >
                      <Text style={styles.buttonText}>DECLINE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No friend requests sent.</Text>
          )}
        </View>
      </ScrollView>
      <FooterPage />
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
  button: {
    flexDirection: "row",
    marginHorizontal: -10,
    marginLeft: 40,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 8,
  },
  declineButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default NotificationsPage;
