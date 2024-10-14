import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { io } from "socket.io-client";
import { BACKEND_URL } from '../../API_BACKENDS/Backend_API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type ChatPageUserRouteParams = {
  ChatUser: {
    username: string;
    profileImage: string;
    sentUserId: string;
  };
};

const ChatPageUser = ({ navigation }: { navigation: any }) => {
  const route = useRoute<RouteProp<ChatPageUserRouteParams, 'ChatUser'>>();
  const { username, profileImage } = route.params;
  const [loginUserId, setLoginUserId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Array<{ senderId: string; message: string }>>([]);
  const [message, setMessage] = useState('');
  const [sentUserId, setSentUserid] = useState<string | null>(null)

  // useEffect(()=>{
  //  const dataFetch=async()=>{
  //   try {
  //     const res = await axios.get(`${BACKEND_URL}/api/message`);
  //     console.log(res.data);
  //   } catch (error) {
  //     console.log("ERROR", error);
  //   }
  //  }
  //  dataFetch()
  // },[]);

  const socket = useMemo(() => io(`${BACKEND_URL}`), []);

  useEffect(() => {

    const getLoginUserId = async () => {
      const storedLoginUserId = await AsyncStorage.getItem('UserId');
      const sentId = await AsyncStorage.getItem("sentId");
      setSentUserid(sentId)
      setLoginUserId(storedLoginUserId);
      if (storedLoginUserId && sentUserId) {
        socket.emit("join_room", { loginUserId: storedLoginUserId, sentUserId });
      }
    };
    getLoginUserId();

    socket.on("connect", () => {
      console.log("User connected with id: ", socket.id);
    });

    socket.on("receive_message", (data: { senderId: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [socket, sentUserId]);

  const handleSubmit = () => {
    if (message.trim() && loginUserId) {
      // console.log(sentUserId);
      console.log(sentUserId);
      socket.emit("send_message", { loginUserId, sentUserId, message });
      setMessages((prevMessages) => [...prevMessages, { senderId: loginUserId, message }]);
      setMessage('');
    } else {
      console.log("Conditions not met");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: profileImage }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
            {username}
          </Text>
        </View>
      ),
    });
  }, [navigation, username, profileImage]);

  return (
    <>
      <ScrollView>
        {messages.map((msg, index) => (
          <View key={index} >
            {/* style={msg.senderId === loginUserId ? styles.sentMessage : styles.receivedMessage} */}
            <Text>{msg.message}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity onPress={() => {
          handleSubmit();
        }}>
          <MaterialCommunityIcons name="send" size={28} color="dodgerblue" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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