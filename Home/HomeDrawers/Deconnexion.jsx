import React, { useState } from 'react';
import { Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true); // Show loading state

    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData'); // If you're storing user data

      // Show success alert before navigation
      Alert.alert('Logout Successful', 'You have been logged out successfully.', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to Login screen after logout
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]);

    } catch (error) {
      console.error('Error during logout:', error);
      // Show the error message as a plain string
      Alert.alert('Logout Error', 'An error occurred during logout. Please try again.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <>
      <Button title="Logout" onPress={handleLogout} />
    </>
  );
};

export default Logout;
