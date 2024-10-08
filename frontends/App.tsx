import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home';
import Signin from "./components/Signin"
import Signup from "./components/Signup"
import ChatApp from './components/chat';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={Home}
          options={{
            headerStyle: { backgroundColor: "deepskyblue" },
            headerTintColor: "white"
          }} />

        <Stack.Screen
          name='Signin'
          component={Signin}
          options={{
            headerStyle: { backgroundColor: "deepskyblue" },
            headerTintColor: "white"
          }} />

        <Stack.Screen
          name='Signup'
          component={Signup} options={{
            headerStyle: { backgroundColor: "deepskyblue" },
            headerTintColor: "white"
          }} />
          <Stack.Screen name='ChatApp' component={ChatApp}
          options={{
            headerStyle: { backgroundColor: "deepskyblue" },
            headerTintColor: "white"
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
