import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

const FooterPage = () => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleShow = (iconName: string) => {
    setSelectedIcon((prevsIcon)=>(
      prevsIcon === iconName ? null : iconName
    ));
  };
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Ionicons name="chatbox-sharp" size={26} color={selectedIcon === "chat"? "#2c9cdb":"gray"} onPress={() => handleShow("chat")} />
        {selectedIcon === "chat" && <Text style={{color:"#2c9cdb"}}>Chat</Text>}
      </View>
      <View style={styles.item}>
        <Ionicons name="notifications" size={26} color={selectedIcon === "notifications"? "#2c9cdb":"gray"} onPress={() => handleShow("notifications")} />
        {selectedIcon === "notifications" && <Text  style={{color:"#2c9cdb"}}>Notification</Text>}
      </View>
      <View style={styles.item}>
        <AntDesign name="addusergroup" size={26} color={selectedIcon === "users"? "#2c9cdb":"gray"} onPress={() => handleShow("users")} />
        {selectedIcon === "users" && <Text  style={{color:"#2c9cdb"}}>Users</Text>}
      </View>
      <View style={styles.item}>
        <AntDesign name="setting" size={26} color={selectedIcon === "setting"? "#2c9cdb":"gray"} onPress={() => handleShow("setting")} />
        {selectedIcon === "setting" && <Text  style={{color:"#2c9cdb"}}>Setting</Text>}
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
});

export default FooterPage;
