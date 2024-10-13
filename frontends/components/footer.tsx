import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RouterType } from "./Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BACKEND_URL } from "../API_BACKENDS/Backend_API";


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
}

const FooterPage = () => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState<number | null>(null);
  const navigation = useNavigation<NavigationProp<RouterType>>();


  // useEffect(() => {
  //   const fetchNotificationCount = async () => {
  //     const count = await AsyncStorage.getItem("FriendsCount");
  //     const userId = await AsyncStorage.getItem("UserId")

  // setNotificationCount(count ? parseInt(count) : 0);
  //     // console.log("Notification Count:", count);
  //   };

  //   fetchNotificationCount();
  // }, []); 

  const handleShow = (iconName: string) => {
    setSelectedIcon(prevIcon => (prevIcon === iconName ? null : iconName));
  };

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      const loggedInUserId = await AsyncStorage.getItem("UserId");
      setUserId(loggedInUserId);

      try {
        const res = await axios.get(`${BACKEND_URL}/api/friend/sent`);
        const filteredRequests = res.data.userdata.filter((request: User) => request.sentFriendId === loggedInUserId);
        setUserData({ ...res.data, userdata: filteredRequests });
        // setNotificationCount((filteredRequests).file(user=>))
        const filteredRequestsCount = res.data.userdata.filter((request: User) => request.sentFriendId === loggedInUserId)
        const count = filteredRequestsCount.length
        setNotificationCount(count ? parseInt(count) : 0);
        // console.log(res.data)

        //  const count = filteredRequests.length;
        //  await AsyncStorage.setItem("FriendsCount",count.toString())
        //  console.log(count)
      } catch (error) {
        console.log("Failed to fetch users data: ", error);
      }
    };

    fetchUsersData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Ionicons
          name="chatbox-sharp"
          size={26}
          color={selectedIcon === "chat" ? "#2c9cdb" : "gray"}
          onPress={() => {
            handleShow("chat");
            navigation.navigate("Chats");
          }}
        />
        {selectedIcon === "chat" && <Text style={{ color: "#2c9cdb" }}>Chat</Text>}
      </View>
      <View style={styles.item}>
        <View style={styles.notificationContainer}>
          {notificationCount !== null && notificationCount > 0 ? (
            <View style={styles.notificationCount}>
              <Text style={styles.countText}>{notificationCount}</Text>
            </View>
          ) : (
            <View style={styles.notificationCount}>
              <Text style={styles.countText}>0</Text>
            </View>
          )}
          <Ionicons
            name="notifications"
            size={26}
            color={selectedIcon === "notifications" ? "#2c9cdb" : "gray"}
            onPress={() => {
              handleShow("notifications");
              navigation.navigate('Notifications');
            }}
          />
        </View>
        {selectedIcon === "notifications" && (
          <Text style={{ color: "#2c9cdb" }}>Notification</Text>
        )}
      </View>
      <View style={styles.item}>
        <AntDesign
          name="addusergroup"
          size={26}
          color={selectedIcon === "users" ? "#2c9cdb" : "gray"}
          onPress={() => {
            handleShow("users");
            navigation.navigate("Users");
          }}
        />
        {selectedIcon === "users" && <Text style={{ color: "#2c9cdb" }}>Users</Text>}
      </View>
      <View style={styles.item}>
        <AntDesign
          name="setting"
          size={26}
          color={selectedIcon === "setting" ? "#2c9cdb" : "gray"}
          onPress={() => {
            handleShow("setting");
            navigation.navigate("Settings");
          }}
        />
        {selectedIcon === "setting" && <Text style={{ color: "#2c9cdb" }}>Setting</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderTopColor: "gray",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  item: {
    alignItems: "center",
  },
  notificationContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  notificationCount: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 9,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FooterPage;
