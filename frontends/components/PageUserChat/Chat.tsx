import { useRoute, RouteProp } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, TextInput, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type ChatPageUserRouteParams = {
  ChatUser: {
    username: string;
    profileImage: string;
  };
};

const ChatPageUser = ({ navigation }: { navigation: any }) => {
  const route = useRoute<RouteProp<ChatPageUserRouteParams, 'ChatUser'>>();
  const { username, profileImage } = route.params;

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
        <Text>Hello</Text>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Message" />
        <MaterialCommunityIcons name="send" size={28} color="dodgerblue" />
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
});

export default ChatPageUser;
