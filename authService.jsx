// authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData'); // If you're storing user data
    // Navigate to Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
};