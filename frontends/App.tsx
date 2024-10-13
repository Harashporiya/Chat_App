import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home';
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import ChatApp from './components/chat';
import NotificationsPage from './components/Notifications/Notifications';
import UsersPage from './components/Users/Users';
import SettingPage from './components/Settings/SettingPage';
import ChatPageUser from './components/PageUserChat/Chat';
import FooterPage from './components/footer';

type RootStackParamList = {
  Home: undefined;
  Signin: undefined;
  Signup: undefined;
  Chats: undefined;
  Notifications: undefined;
  Users: undefined;
  Settings: undefined;
  ChatUser: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const routesWithoutFooter = ['Home', 'Signin', 'Signup'];

export default function App() {
  const [currentRoute, setCurrentRoute] = React.useState<string>('');

  const onStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRouteName = state.routes[state.index].name;
      setCurrentRoute(currentRouteName);
    }
  };
  
  
  const shouldShowFooter = !routesWithoutFooter.includes(currentRoute);

  return (
    <NavigationContainer onStateChange={onStateChange}>
      <SafeAreaView style={styles.container}>
        <View style={styles.navigatorContainer}>
          <Stack.Navigator>
            <Stack.Screen
              name='Home'
              component={Home}
              options={{
                headerStyle: { backgroundColor: "deepskyblue" },
                headerTintColor: "white"
              }}
            />
            <Stack.Screen
              name='Signin'
              component={Signin}
              options={{
                headerStyle: { backgroundColor: "deepskyblue" },
                headerTintColor: "white"
              }}
            />
            <Stack.Screen
              name='Signup'
              component={Signup}
              options={{
                headerStyle: { backgroundColor: "deepskyblue" },
                headerTintColor: "white"
              }}
            />
            <Stack.Screen
              name='Chats'
              component={ChatApp}
              options={{
                headerStyle: { backgroundColor: "deepskyblue" },
                headerTintColor: "white"
              }}
            />
            <Stack.Screen
              name='Notifications'
              component={NotificationsPage}
              options={{
                headerStyle: { backgroundColor: "deepskyblue" },
                headerTintColor: "white"
              }}
            />
            <Stack.Screen
              name='Users'
              component={UsersPage}
              options={{
                headerStyle: { backgroundColor: "deepskyblue" },
                headerTintColor: "white"
              }}
            />
            <Stack.Screen
              name='Settings'
              component={SettingPage}
              options={{
                headerStyle: { backgroundColor: "deepskyblue" },
                headerTintColor: "white"
              }}
            />
            <Stack.Screen
              name='ChatUser'
              component={ChatPageUser}
              options={{
                headerStyle: { backgroundColor: "deepskyblue" },
                headerTintColor: "white"
              }}
            />
          </Stack.Navigator>
        </View>
        {shouldShowFooter && <FooterPage />}
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  navigatorContainer: {
    flex: 1,
  },
});