// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './connection/Login';
import RegistrationScreen from './connection/Registration';
import ForgetPasswordScreen from './connection/ForgetPassword';
import RegistrationSuccessMessages from './connection/RegistrationSuccessMessages';
import HomePage from './Home/HomePage';
import Postulation from './Home/HomeTabs/StagesTabs/Postulation';
import ApplicationForm from './Home/HomeTabs/StagesTabs/ApplicationForm';
import StagesPostuler from './Home/HomeTabs/StagesPostuler';
import MoreDetails from './Home/HomeTabs/StagesTabs/MoreDetails';

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
        console.error('Failed to get token', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    // You might want to render a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userToken ? "HomePage" : "Login"}>
        {userToken == null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrationSuccessMessages" component={RegistrationSuccessMessages} options={{ headerShown: false }} />
          </>
        ) : (
          // User is signed in
          <>
            <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Postulation" component={Postulation} options={{ headerShown: true, title: 'Postulation' }} />
            <Stack.Screen name="ApplicationForm" component={ApplicationForm} options={{ title: 'Formulaire de Candidature' }} />
            <Stack.Screen name="StagesPostuler" component={StagesPostuler} options={{}} />
            <Stack.Screen name="MoreDetails" component={MoreDetails} options={{ title: 'Candidature' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;