// Onboarding.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({ navigation }) => {
  const completeOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Replace with your actual onboarding UI */}
      <Text>Welcome to the App! Onboarding Screens</Text>
      <Button title="Get Started" onPress={completeOnboarding} />
    </View>
  );
};

export default Onboarding;
