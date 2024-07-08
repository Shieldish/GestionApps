// authService.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
};