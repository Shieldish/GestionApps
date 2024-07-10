// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, ActivityIndicator, Button } from 'react-native';
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
import Favorites from './Home/HomeTabs/Favorites'
import { FavoritesProvider } from './Home/HomeTabs/Partials/FavoritesContext';

const Stack = createStackNavigator();

// Create a Context for authentication
const AuthContext = createContext();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Optional: Validate the token with your backend
        // Assume token is valid for this example
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    checkToken();
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
     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? "HomePage" : "Login"}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RegistrationSuccessMessages" component={RegistrationSuccessMessages} options={{ headerShown: false }} />
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

// Example of adding a logout button in any screen
const ExampleComponentWithLogout = ({ navigation }) => {
  const { setIsLoggedIn } = useAuth();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
    navigation.navigate('Login');
  };

  return (
    <View>
      <Button title="Logout" onPress={handleLogout} />
      {/* Other component contents */}
    </View>
  );
};
