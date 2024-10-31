import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback, useRef } from 'react';
import { View, Text, Image, FlatList, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { io, Socket } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../../API_BACKENDS/Backend_API';
import axios from 'axios';

type ChatPageUserRouteParams = {
  ChatUser: {
    username: string;
    profileImage: string;
    sentIdUser: string;
    joinRoomId: string;
  };
};

type Message = {
  _id: string;
  senderId: string;
  message: string;
  roomId: string;
  createdAt: string;
};

const ChatPageUser: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute<RouteProp<ChatPageUserRouteParams, 'ChatUser'>>();
  const { username, profileImage, joinRoomId, sentIdUser } = route.params;
  const [loginUserId, setLoginUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const fetchingRef = useRef(false);

  const socket: Socket = useMemo(() => io(BACKEND_URL), []);

  const getLoginUserId = useCallback(async () => {
    const storedLoginUserId = await AsyncStorage.getItem('UserId');
    if (isMounted.current) {
      setLoginUserId(storedLoginUserId);
      if (joinRoomId) {
        socket.emit("join_room", { joinRoomId });
      }
    }
  }, [joinRoomId, socket]);

  const fetchMessages = useCallback(async () => {
    
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    try {
      const response = await axios.get(`${BACKEND_URL}/api/messages`);
      const filterJoinRoomId = response.data.filter((joinId: any) => joinId.roomId === joinRoomId);
      
      if (isMounted.current) {
        setMessages(filterJoinRoomId.reverse());
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (isMounted.current) {
        Alert.alert("Error", "Failed to load messages. Please try again.");
        setIsLoading(false);
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [joinRoomId]);

  useEffect(() => {
    getLoginUserId();

    socket.on("connect", () => {
      console.log("User connected with id:", socket.id);
    });

    socket.on("receive_message", (data: Message) => {
      console.log("Received message:", data);
      if (isMounted.current) {
        setMessages((prevMessages) => [data, ...prevMessages]);
      }
    });

    
    fetchMessages();

    
    const intervalId = setInterval(() => {
      if (isMounted.current && !fetchingRef.current) {
        fetchMessages();
      }
    }, 1000); 

    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
      socket.off("connect");
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [socket, getLoginUserId, fetchMessages]);

  const handleSubmit = useCallback(async () => {
    if (message.trim() && loginUserId) {
      const newMessage = { senderId: loginUserId,receiverId:sentIdUser, message: message.trim(), roomId: joinRoomId };
      try {
        const response = await axios.post(`${BACKEND_URL}/api/messages`, newMessage);
        socket.emit("send_message", response.data);
        
        if (isMounted.current) {
          setMessages((prevMessages) => [response.data, ...prevMessages]);
          setMessage('');
        }
      } catch (error) {
        if (isMounted.current) {
          Alert.alert("Error", "Failed to send message. Please try again.");
        }
      }
    }
  }, [message, loginUserId, joinRoomId, socket]);

  
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <Text style={styles.username}>{username}</Text>
        </View>
      ),
    });
  }, [navigation, username, profileImage]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={item.senderId === loginUserId ? styles.sentMessage : styles.receivedMessage}>
      <Text key={item._id} style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <MaterialCommunityIcons name="send" size={28} color="dodgerblue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 20,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: '70%',
    fontSize:20
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: '70%',
    fontSize:20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   messageTime: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
   messageText: {
    fontSize: 16,
  },
});

export default ChatPageUser;