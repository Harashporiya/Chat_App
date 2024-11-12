import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import FooterPage from "../footer";
import axios from "axios";
import { BACKEND_URL } from "../../API_BACKENDS/Backend_API";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  createdAt: string;
  loginUserId: string;
  sentFriendId: string | null;
  _id: string;
  username: string;
  profileImage: string;
}

interface UserData {
  message: string;
  userdata: User[];
  allUser: User[];
}



const NotificationsPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // const [allUser, setAllusers] = useState<UserData | null>(null);
  // const [acceptuser, setAcceptedUser] = useState();
  const fetchUsersData = async () => {
    const loggedInUserId = await AsyncStorage.getItem("UserId");
    setUserId(loggedInUserId);

    try {
      // const resUsersAll = await axios.get(`${BACKEND_URL}/api/all/users`);
      // const usersRes = await axios.get(`${BACKEND_URL}/api/all/accepts`);
      // setAcceptedUser(usersRes.data)
      // setAllusers(resUsersAll.data)
      // console.log(resUsersAll.data)
      const res = await axios.get(`${BACKEND_URL}/api/friend/sent`);
      const filteredRequests = res.data.userdata.filter((request: User) => request.sentFriendId === loggedInUserId);
      setUserData({ ...res.data, userdata: filteredRequests });
    } catch (error) {
      console.log("Failed to fetch users data: ", error);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUsersData().finally(() => setRefreshing(false));
  }, []);

  const handleAccept = async (username: string, acceptUserId: string,profileImage:string) => {
    const loginUserId = await AsyncStorage.getItem("UserId");
    const loginUsername = await AsyncStorage.getItem("Username");
 

    try {
      const res = await axios.post(`${BACKEND_URL}/api/accepts`, {
        username,
        acceptUserId,
        loginUsername,
        loginUserId,
        profileImage
        // userIdProfileImage:allUser?.allUser.filter((userId:any)=>{
        //   userId._id === acceptUserId || userId._id === loginUsername
        // })
      });

      console.log(res.data)
      
      Alert.alert("Success", "Friend request accepted");
    } catch (error) {
      console.log("ERROR", error);
      Alert.alert("Error", "Failed to accept friend request");
    }
  };

  const accepts = async(friendId: string) => {
    try {
      const res = await axios.delete(`${BACKEND_URL}/api/friend/delete/${friendId}`);
      await fetchUsersData(); 
    } catch (error) {
      console.log("ERROR hello", error);
    }
  };

  const handleDecline = async (friendId: string) => {
    try {
      const res = await axios.delete(`${BACKEND_URL}/api/delete/${friendId}`);
      Alert.alert("Success", "Friend request declined");
      await fetchUsersData(); 
    } catch (error) {
      console.log("ERROR", error);
      Alert.alert("Error", "Failed to decline friend request");
    }
  };

  return (
    <>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.container}>
          {userData && userData.userdata.length > 0 ? (
            userData.userdata.map((user) => (
              <View key={user._id} style={styles.userCard}>
                <View style={styles.avatar}>
                  <Image style={styles.image} source={{ uri: user.profileImage }} />
                </View>
                <View style={styles.userInfo}>
                  <View style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text>{user.createdAt.slice(0,10)}</Text>
                  </View>
                  <Text style={styles.lastMessage}>New Friend request</Text>
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => (handleAccept(user.username, user.loginUserId,user.profileImage),accepts(user._id))}
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
            <View style={styles.imageContainer}>
              <Image style={styles.imageNotFound} source={{uri:"https://cdni.iconscout.com/illustration/premium/thumb/no-notification-illustration-download-in-svg-png-gif-file-formats--bell-ring-empty-inbox-simple-error-state-pack-user-interface-illustrations-6024629.png?f=webp"}}/>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 12,
  },
  image: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#f0f0f0",
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    flexDirection: "row",
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
  imageNotFound:{
    height: 200,
    width: 200,
   
  },
  imageContainer:{
    flex:1,
    alignItems:"center",
    justifyContent:'center',
    marginTop:300
  }
});

export default NotificationsPage;
