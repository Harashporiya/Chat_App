import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import axios from "axios";
import { BACKEND_URL } from "../../API_BACKENDS/Backend_API";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  profileImage: string;
  username: string;
  email: string;
  createdAt: string;
}

const SettingPage = () => {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const dataFetchUserById = async () => {
      const id = await AsyncStorage.getItem("UserId");
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/${id}`);
        setProfile(res.data.UserIdBy);
      } catch (error) {
        console.log("ERROR", error);
      }
    };

    dataFetchUserById();
  }, []);

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <ImageBackground
            source={{ uri: profile.profileImage }}
            style={styles.backgroundImage}
          />
          <Image
            source={{ uri: profile.profileImage }}
            style={styles.image}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.username}>Username: {profile.username}</Text>
            <Text style={styles.email}>Email: {profile.email}</Text>
            <Text style={styles.create}>
              Created At: {new Date(profile.createdAt).toDateString()}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading profile...</Text>
      )}
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Change Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.logoutBtn]}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#f8f8f8",
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    marginBottom: 70,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    position: "absolute",
    top: 130,
    zIndex: 1,
    borderWidth: 4,
    borderColor: "#fff",
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  create: {
    fontSize: 14,
    color: "#777",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
    marginTop: 20,
  },
  btn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutBtn: {
    backgroundColor: "#FF3B30",
    marginTop: 15,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SettingPage;