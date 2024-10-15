import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { io, Socket } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../../API_BACKENDS/Backend_API';

type ChatPageUserRouteParams = {
  ChatUser: {
    username: string;
    profileImage: string;
    sentIdUser: string;
  };
};

type Message = {
  senderId: string;
  message: string;
};

const ChatPageUser: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute<RouteProp<ChatPageUserRouteParams, 'ChatUser'>>();
  const { username, profileImage, sentIdUser } = route.params;
  const [loginUserId, setLoginUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  // console.log("RoomId: hi",sentIdUser)
  const socket: Socket = useMemo(() => io(BACKEND_URL), []);

  const getLoginUserId = useCallback(async () => {
    const storedLoginUserId = await AsyncStorage.getItem('UserId');
    setLoginUserId(storedLoginUserId);
    if (sentIdUser) {
      socket.emit("join_room", { sentIdUser});
    }
  }, [sentIdUser, socket]);

  useEffect(() => {
    getLoginUserId();

    socket.on("connect", () => {
      console.log("User connected with id:", socket.id);
    });

    socket.on("receive_message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [socket, getLoginUserId]);

  const handleSubmit = useCallback(() => {
    if (message.trim() && loginUserId) {
      const newMessage = { senderId: loginUserId, message: message.trim() };
      socket.emit("send_message", { sentIdUser, ...newMessage });
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  }, [message, loginUserId, sentIdUser, socket]);

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
    <View >
      {/* style={item.senderId === loginUserId ? styles.sentMessage : styles.receivedMessage} */}
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
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
  // sentMessage: {
  //   alignSelf: 'flex-end',
  //   backgroundColor: '#DCF8C6',
  //   padding: 10,
  //   margin: 5,
  //   borderRadius: 10,
  //   maxWidth: '70%',
  // },
  // receivedMessage: {
  //   alignSelf: 'flex-start',
  //   backgroundColor: '#FFFFFF',
  //   padding: 10,
  //   margin: 5,
  //   borderRadius: 10,
  //   maxWidth: '70%',
  // },
});

export default ChatPageUser;