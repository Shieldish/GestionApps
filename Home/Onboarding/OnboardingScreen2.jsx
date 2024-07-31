// OnboardingScreen1.js, OnboardingScreen2.js, OnboardingScreen3.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const OnboardingScreen1 = ({ navigation }) => (
  <View>
    <Text>Onboarding Screen 2</Text>
    <Button title="Next" onPress={() => navigation.navigate('Onboarding3')} />
  </View>
);

// Create similar components for OnboardingScreen2 and OnboardingScreen3