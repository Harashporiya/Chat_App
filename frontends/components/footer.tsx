import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RouterType } from "./Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FooterPage = () => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState<number | null>(null);
  const navigation = useNavigation<NavigationProp<RouterType>>();

  
  useEffect(() => {
    const fetchNotificationCount = async () => {
      const count = await AsyncStorage.getItem("FriendsCount");
     
      setNotificationCount(count ? parseInt(count) : 0);
      // console.log("Notification Count:", count);
    };

    fetchNotificationCount();
  }, []); 

  const handleShow = (iconName: string) => {
    setSelectedIcon(prevIcon => (prevIcon === iconName ? null : iconName));
  };

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
          {notificationCount !== null && notificationCount > 0 && (
            <View style={styles.notificationCount}>
              <Text style={styles.countText}>{notificationCount}</Text>
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
