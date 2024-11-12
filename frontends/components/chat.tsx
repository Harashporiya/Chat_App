import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { BACKEND_URL } from "../API_BACKENDS/Backend_API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RouterType } from "./Navigation";

interface User {
  loginUsername: string;
  acceptUserId: string;
  loginUserId: string;
  _id: string;
  username: string;
  profileImage: string;
}

interface UserData {
  message: string;
  allAcceptsUser: User[];
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  roomId: string;
  createdAt: string;
}

interface ConversationStatus {
  lastMessage: Message;
  hasUnrepliedMessages: boolean;
  unreadCount: number;
}

interface UserID {
  _id: string;
  username: string;
  profileImage: string;
  is_online: number;
}

interface UserData1 {
  message: string;
  allUser: UserID[];
}

const ChatApp = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [idUserlogin, setUserIdLogin] = useState<string | null>(null);
  const [conversationStatuses, setConversationStatuses] = useState<{ [key: string]: ConversationStatus }>({});
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: boolean }>({});
  
  const navigation = useNavigation<NavigationProp<RouterType>>();

  const [statusCheck, setStatusCheck] = useState<UserData1 | null>(null);

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/all/users`);
        setStatusCheck(res.data);
        
      
        const onlineStatusMap: { [key: string]: boolean } = {};
        res.data.allUser.forEach((user: UserID) => {
          onlineStatusMap[user._id] = user.is_online === 1;
        });
        setOnlineUsers(onlineStatusMap);
      } catch (error) {
        console.log("ERROR", error);
      }
    };
    fetchDataUser();
    
 
    const interval = setInterval(fetchDataUser, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const userIdLogin = await AsyncStorage.getItem("UserId");
      setUserIdLogin(userIdLogin);

      try {
       
        const usersRes = await axios.get(`${BACKEND_URL}/api/all/accepts`);
        setUserData(usersRes.data);
        // console.log(usersRes.data)

        
        const messagesRes = await axios.get(`${BACKEND_URL}/api/messages`);
        const messages: Message[] = messagesRes.data;

        
        const statusMap: { [key: string]: ConversationStatus } = {};
        
        messages.forEach((message: Message) => {
          if (message.senderId === userIdLogin || message.receiverId === userIdLogin) {
            const otherUserId = message.senderId === userIdLogin ? message.receiverId : message.senderId;
            
            if (!statusMap[otherUserId] || 
                new Date(message.createdAt) > new Date(statusMap[otherUserId].lastMessage.createdAt)) {
              
              
              const conversationMessages = messages.filter(msg => 
                (msg.senderId === userIdLogin && msg.receiverId === otherUserId) ||
                (msg.receiverId === userIdLogin && msg.senderId === otherUserId)
              ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

             
              const hasUnrepliedMessages = message.receiverId === userIdLogin && 
                !conversationMessages.some(msg => 
                  msg.senderId === userIdLogin && 
                  new Date(msg.createdAt) > new Date(message.createdAt)
                );

                const unreadCount = conversationMessages.filter(msg => 
                msg.receiverId === userIdLogin &&
                !conversationMessages.some(reply => 
                  reply.senderId === userIdLogin && 
                  new Date(reply.createdAt) > new Date(msg.createdAt)
                )
              ).length;

              statusMap[otherUserId] = {
                lastMessage: message,
                hasUnrepliedMessages,
                unreadCount
              };
            }
          }
        });

        setConversationStatuses(statusMap);
      } catch (error) {
        console.log("Error fetching data: harash", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const showDataByUser = async(user: User) => {
    const sentUserId = user.loginUserId === idUserlogin ? user.acceptUserId : user.loginUserId;
    const loginUserId = await AsyncStorage.getItem("UserId");
   
    try {
      const res = await axios.post(`${BACKEND_URL}/api/joinroom`, {
        loginUserId,
        sentUserId,
      });
      
      const roomId = res.data.room._id;
      navigation.navigate("ChatUser", { 
        id: user._id,
        username: user.loginUserId === idUserlogin ? user.username : user.loginUsername,
        profileImage: user.profileImage,
        sentIdUser: sentUserId,
        joinRoomId: roomId,
      });
    } catch (error) {
      console.log("Error joining room:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getLastMessageText = (otherUserId: string) => {
    const status = conversationStatuses[otherUserId];
    if (!status) return "No messages yet";
    return status.lastMessage.message;
  };

  const getLastMessageTime = (otherUserId: string) => {
    const status = conversationStatuses[otherUserId];
    if (!status) return "";
    return formatTime(status.lastMessage.createdAt);
  };

  return (
    <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      {userData?.allAcceptsUser
        .filter(user => (
          (user.loginUserId === idUserlogin && user.acceptUserId !== idUserlogin) ||
          (user.acceptUserId === idUserlogin && user.loginUserId !== idUserlogin)
        ))
        .map(user => {
          const otherUserId = user.loginUserId === idUserlogin ? user.acceptUserId : user.loginUserId;
          const status = conversationStatuses[otherUserId];
          const isOnline = onlineUsers[otherUserId];
          
          return (
            <TouchableOpacity 
              key={user._id} 
              onPress={() => showDataByUser(user)}
            >
              <View style={styles.userCard}>
                <View style={styles.avatar}>
                  <Image 
                    style={styles.image}
                    source={{ uri: user.profileImage }}
                  />
                  <View style={[
                    styles.onlineIndicator,
                    { backgroundColor: isOnline ? '#4CAF50' : '#FF3B30' }
                  ]} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.username}>
                    {user.loginUserId === idUserlogin ? user.username : user.loginUsername}
                  </Text>
                  <Text 
                    style={[
                      styles.lastMessage,
                      status?.hasUnrepliedMessages && styles.boldMessage
                    ]}
                  >
                    {getLastMessageText(otherUserId)}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {getLastMessageTime(otherUserId)}
                  </Text>
                  {status?.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{status.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  </ScrollView>
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
  boldMessage: {
    fontWeight: 'bold',
    color: '#000',
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
  }
});

export default ChatApp;