import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BACKEND_URL } from "../../API_BACKENDS/Backend_API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RouterType } from "../Navigation";
import * as ImagePicker from 'expo-image-picker';

interface User {
  profileImage: string;
  backgroundImage: string;
  username: string;
  email: string;
  createdAt: string;
}

const SettingPage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RouterType>>();

  useEffect(() => {
    // checkPermissions();
    fetchUserProfile();
  }, []);

  // const checkPermissions = async () => {
  //   if (Platform.OS !== 'web') {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images!');
  //     }
  //   }
  // };

  const fetchUserProfile = async () => {
    const id = await AsyncStorage.getItem("UserId");
    try {
      const res = await axios.get(`${BACKEND_URL}/api/user/${id}`);
      console.log("Profile Data:", {
        profileImage: res.data.UserIdBy.profileImage,
        backgroundImage: res.data.UserIdBy.backgroundImage
      });
      setProfile(res.data.UserIdBy);
    } catch (error) {
      console.log("ERROR", error);
      Alert.alert("Error", "Failed to fetch profile");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickBackgroundImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        uploadBackgroundImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick background image");
    }
  };

  const uploadImage = async (uri: string) => {
    const id = await AsyncStorage.getItem("UserId");
    if (!id) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('profileImage', {
        uri,
        type: 'image/jpeg',
        name: 'profileImage.jpg',
      } as any);

      const response = await axios.put(
        `${BACKEND_URL}/api/update-profile-image/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.user) {
        setProfile(response.data.user);
        Alert.alert("Success", "Profile image updated successfully");
      }
    } catch (error) {
      console.log("Upload Error:", error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const uploadBackgroundImage = async (uri: string) => {
    const id = await AsyncStorage.getItem("UserId");
    if (!id) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('backgroundImage', {
        uri,
        type: 'image/jpeg',
        name: 'background-image.jpg',
      } as any);

      const response = await axios.put(
        `${BACKEND_URL}/api/update-background-image/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.user) {
        setProfile(response.data.user);
        Alert.alert("Success", "Background image updated successfully");
      }
    } catch (error) {
      console.log("Upload Error:", error);
      Alert.alert("Error", "Failed to upload background image");
    } finally {
      setLoading(false);
    }
  };

  const resetProfileImage = async () => {
    const id = await AsyncStorage.getItem("UserId");
    if (!id) return;

    setLoading(true);
    try {
      const response = await axios.put(`${BACKEND_URL}/api/reset-profile-image/${id}`);
      if (response.data.user) {
        setProfile(response.data.user);
        Alert.alert("Success", "Profile image reset to default");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reset profile image");
    } finally {
      setLoading(false);
    }
  };

  const tokenRemove = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("UserId");
      Alert.alert("Success", "Logout successful");
      navigation.navigate("Signin");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Profile Images",
      "Choose an option",
      [
        {
          text: "Change Profile Picture",
          onPress: pickImage
        },
        {
          text: "Change Background Image",
          onPress: pickBackgroundImage
        },
        {
          text: "Reset to Default",
          onPress: resetProfileImage
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <ImageBackground
            source={{ uri: profile.backgroundImage }}
            style={styles.backgroundImage}
            onError={(error) => console.log("Background Image Error:", error.nativeEvent)}
          >
            {loading && (
              <View>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </ImageBackground>
          <TouchableOpacity onPress={showImageOptions}>
            <Image
              source={{ uri: profile.profileImage }}
              style={styles.image}
              onError={(error) => console.log("Profile Image Error:", error.nativeEvent)}
            />
            {loading && (
              <View style={styles.profileLoadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.username}>Username: {profile.username}</Text>
            <Text style={styles.email}>Email: {profile.email}</Text>
            <Text style={styles.create}>
              Created At: {new Date(profile.createdAt).toDateString()}
            </Text>
          </View>
        </>
      ) : (<View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={showImageOptions}>
        <Text style={styles.btnText}>Change Images</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.logoutBtn]}
        onPress={tokenRemove}
      >
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
    resizeMode: 'cover',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    position: "absolute",
    top: -70,
    zIndex: 1,
    borderWidth: 4,
    borderColor: "#fff",
  },
  profileLoadingOverlay: {
    position: 'absolute',
    top: -70,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#333',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '80%',
    alignItems: 'center',
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