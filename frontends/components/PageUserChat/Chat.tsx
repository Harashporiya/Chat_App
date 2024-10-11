import { useRoute, RouteProp } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { View, Text,Image } from 'react-native';


type ChatPageUserRouteParams = {
  ChatUser: {
    username: string;
    profileImage:string
  };
};

const ChatPageUser = ({ navigation }: { navigation: any }) => {

  const route = useRoute<RouteProp<ChatPageUserRouteParams, 'ChatUser'>>();
  const { username,profileImage } = route.params; 

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
  }, [navigation, username,profileImage]);

  return (
    <View>
     <Text>Hello</Text>
    </View>
  );
};

export default ChatPageUser;
