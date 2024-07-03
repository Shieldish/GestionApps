// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './connection/Login';
import RegistrationScreen from './connection/Registration';
import ForgetPasswordScreen from './connection/ForgetPassword';
import RegistrationSuccessMessages from './connection/RegistrationSuccessMessages';
import HomePage from './Home/HomePage';
import Postulation from './Home/HomeTabs/StagesTabs/Postulation'; // Correct import for Postulation
import ApplicationForm  from './Home/HomeTabs/StagesTabs/ApplicationForm';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegistrationSuccessMessages" component={RegistrationSuccessMessages} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Postulation" component={Postulation} options={{ headerShown: true, title: 'Postulation' }} />
      <Stack.Screen name="ApplicationForm" component={ApplicationForm} options={{ title: 'Formulaire de Candidature' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
