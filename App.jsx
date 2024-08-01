// App.jsx
import 'react-native-gesture-handler';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './connection/Login';
import RegistrationScreen from './connection/Registration';
import ForgetPasswordScreen from './connection/ForgetPassword';
import RegistrationSuccessMessages from './connection/RegistrationSuccessMessages';
import HomePage from './Home/HomeDrawers';
import Postulation from './Home/HomeTabs/StagesTabs/Postulation';
import ApplicationForm from './Home/HomeTabs/StagesTabs/ApplicationForm';
import StagesPostuler from './Home/HomeTabs/Candidatures';
import MoreDetails from './Home/HomeTabs/StagesTabs/MoreDetails';
import Favorites from './Home/HomeTabs/Favorites';
import { FavoritesProvider } from './Partials/FavoritesContext';
import OnboardingScreens from './Partials/OnboardingScreens';

const Stack = createStackNavigator();

// Create a Context for authentication
const AuthContext = createContext();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const checkTokenAndOnboarding = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const onboardingSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (token) {
        setIsLoggedIn(true);
      }
      if (onboardingSeen) {
        setHasSeenOnboarding(true);
      }
      setIsLoading(false);
    };

    checkTokenAndOnboarding();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FavoritesProvider>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, hasSeenOnboarding, setHasSeenOnboarding }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isLoggedIn ? (hasSeenOnboarding ? "HomePage" : "Onboarding") : "Login"}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrationSuccessMessages" component={RegistrationSuccessMessages} options={{ headerShown: false }} />
            <Stack.Screen name="Onboarding" component={OnboardingScreens} options={{ headerShown: false }} />
            <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Postulation" component={Postulation} options={{ headerShown: true, title: 'Postulation' }} />
            <Stack.Screen name="ApplicationForm" component={ApplicationForm} options={{ title: 'Formulaire de Candidature' }} />
            <Stack.Screen name="StagesPostuler" component={StagesPostuler} options={{ title: 'Stages Postuler' }} />
            <Stack.Screen name="MoreDetails" component={MoreDetails} options={{ title: 'Candidature' }} />
            <Stack.Screen name="Favorites" component={Favorites} options={{ title: 'Favoris' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </FavoritesProvider>
  );
};

export default App;

// Export AuthContext for use in other components
export const useAuth = () => useContext(AuthContext);

