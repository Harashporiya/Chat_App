import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../../API_BACKENDS/Backend_API";
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

interface FriendRequest {
  loginUserId: string;
  sentFriendId: string;
  username: string;
  sentFriendUsername: string;
}

interface AcceptedUser {
  loginUserId: string;
  acceptUserId: string;
}

const UserPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [existingRequests, setExistingRequests] = useState<FriendRequest[]>([]);
  const [acceptedUsers, setAcceptedUsers] = useState<AcceptedUser[]>([]);

  const navigation = useNavigation<NavigationProp<RouterType>>();

 
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userId = await AsyncStorage.getItem("UserId");
        setCurrentUserId(userId);

       
        const [usersResponse, requestsResponse, acceptsResponse] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/all/users`),
          axios.get(`${BACKEND_URL}/api/sent`),
          axios.get(`${BACKEND_URL}/api/all/accepts`)
        ]);

        setUserData(usersResponse.data);
        setExistingRequests(requestsResponse.data.userdata || []);
        setAcceptedUsers(acceptsResponse.data.allAcceptsUser || []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        Alert.alert("Error", "Failed to load user data. Please try again.");
      }
    };

    fetchInitialData();
  }, []);

  const checkFriendshipStatus = (targetUserId: string): 'none' | 'pending' | 'accepted' => {
    if (!currentUserId) return 'none';

    
    const isAccepted = acceptedUsers.some(
      user => (user.loginUserId === currentUserId && user.acceptUserId === targetUserId) ||
              (user.loginUserId === targetUserId && user.acceptUserId === currentUserId)
    );
    if (isAccepted) return 'accepted';

   
    const isPending = existingRequests.some(
      request => (request.loginUserId === currentUserId && request.sentFriendId === targetUserId) ||
                 (request.loginUserId === targetUserId && request.sentFriendId === currentUserId)
    );
    if (isPending) return 'pending';

    return 'none';
  };

  const sendFriendRequest = async (friendId: string, friendUsername: string) => {
    if (!currentUserId) {
      Alert.alert("Error", "Please log in to send friend requests.");
      return;
    }

    const username = await AsyncStorage.getItem("Username");
    if (!username) {
      Alert.alert("Error", "Username not found.");
      return;
    }

    setLoadingId(friendId);

    try {
    
      await Promise.all([
        axios.post(`${BACKEND_URL}/api/friend/userId`, {
          loginUserId: currentUserId,
          username,
          sentFriendId: friendId,
          sentFriendUsername: friendUsername,
        }),
        axios.post(`${BACKEND_URL}/api/userId`, {
          loginUserId: currentUserId,
          username,
          sentFriendId: friendId,
          sentFriendUsername: friendUsername,
        })
      ]);

    
      setExistingRequests(prev => [...prev, {
        loginUserId: currentUserId,
        sentFriendId: friendId,
        username,
        sentFriendUsername: friendUsername
      }]);

      Alert.alert("Success", "Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      Alert.alert("Error", "Failed to send friend request. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const getButtonText = (userId: string) => {
    if (loadingId === userId) return "Sending...";
    
    const status = checkFriendshipStatus(userId);
    switch (status) {
      case 'accepted': return "Friends";
      case 'pending': return "Pending";
      default: return "Add Friend";
    }
  };

  const getButtonStyle = (status: 'none' | 'pending' | 'accepted') => {
    switch (status) {
      case 'accepted': return [styles.friendButton, styles.acceptedButton];
      case 'pending': return [styles.friendButton, styles.pendingButton];
      default: return styles.friendButton;
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Messages</Text>
        {userData?.allUser
          .filter(user => user._id !== currentUserId)
          .map(user => {
            const status = checkFriendshipStatus(user._id);
            
            return (
              <View key={user._id} style={styles.userCard}>
                <View style={styles.avatar}>
                  <Image
                    style={styles.image}
                    source={{ uri: user.profileImage }}
                  />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.lastMessage}>
                    {status === 'accepted' ? 'Friends' : 'New friend request sent'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={getButtonStyle(status)}
                  onPress={() => sendFriendRequest(user._id, user.username)}
                  disabled={status !== 'none' || loadingId === user._id}
                >
                  <Text style={styles.buttonText}>
                    {getButtonText(user._id)}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
    </ScrollView>
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
  friendButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  pendingButton: {
    backgroundColor: "#FFA500",
  },
  acceptedButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default UserPage;