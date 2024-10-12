import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import FooterPage from "../footer";
import axios from "axios";
import { BACKEND_URL } from "../../API_BACKENDS/Backend_API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { RouterType } from "../Navigation";

interface User {
  _id: string;
  username: string;
  profileImage: string;
}

interface UserData {
  message: string;
  allUser: User[];
}

const UserPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [idUser, setUserId] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RouterType>>();
  const [acceptedUsers, setAcceptedUsers] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      const userId = await AsyncStorage.getItem("UserId");
      setUserId(userId);

      try {
        const res = await axios.get(`${BACKEND_URL}/api/all/users`);
        setUserData(res.data);
      } catch (error) {
        console.log("Failed to fetch users data: ", error);
      }
    };
    fetchUsersData();
  }, []);

  const userIdSave = async (friendId1: string, friendUsername: string) => {
    const loginUserId = await AsyncStorage.getItem("UserId");
    const username = await AsyncStorage.getItem("Username");

    if (!loginUserId || !username) {
      Alert.alert("Error", "User ID or username not found.");
      return;
    }
    
    setLoadingId(friendId1);

    try {
      const response = await axios.get(`${BACKEND_URL}/api/sent`);
      const existingRequests = response.data.userdata;

      const requestExists = existingRequests.some((request: { userId: string; sentFriendId: string; }) =>
        (request.userId === loginUserId && request.sentFriendId === friendId1) ||
        (request.sentFriendId === loginUserId && request.userId === friendId1)
      );

      if (requestExists) {
        Alert.alert("Error", "Friend request already exists.");
        setLoadingId(null);
        return;
      }

      const res = await axios.post(`${BACKEND_URL}/api/userId`, { loginUserId, username, sentFriendId: friendId1, sentFriendUsername: friendUsername });
      console.log("hello comes");
      // setAcceptedUsers([...acceptedUsers, friendId]);
    } catch (error) {
      console.log("ERROR", error);
      Alert.alert("Error", "An error occurred while sending the request.");
      
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.header}>Messages</Text>
          {userData?.allUser.filter(user => user._id !== idUser).map(user => (
            <View key={user._id}>
              <View style={styles.userCard}>
                <View style={styles.avatar}>
                  <Image
                    style={styles.image}
                    source={{ uri: user.profileImage }}
                  />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.lastMessage}>New Friends request sent</Text>
                </View>
                <View style={styles.button}>
                  <TouchableOpacity
                    style={styles.friendButton}
                    onPress={() => userIdSave(user._id, user.username)}
                    disabled={acceptedUsers.includes(user._id) || loadingId === user._id}
                  >
                    <Text style={styles.buttonText}>
                      {loadingId === user._id
                        ? "Sending..."
                        : acceptedUsers.includes(user._id)
                        ? "Sent"
                        : "Add friend"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <FooterPage />
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
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a1a1a",
    marginLeft: 8,
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
    position: "relative",
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
    marginHorizontal: -10,
  },
  friendButton: {
    backgroundColor: "#4CAF50",
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

export default UserPage;