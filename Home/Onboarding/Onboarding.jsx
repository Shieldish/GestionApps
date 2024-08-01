// OnboardingScreens.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';

const OnboardingScreens = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const screens = [
    { id: 1, title: 'Welcome', content: 'This is the first onboarding screen' },
    { id: 2, title: 'Features', content: 'Discover our amazing features' },
    { id: 3, title: 'Service', content: 'App for manage Stage' },
    { id: 4, title: 'Get Started', content: 'You \'re all set! Let \'s begin' },
  ];

  const handleSkip = () => {
    navigation.navigate('HomePage');
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      swiper.scrollBy(-1);
    }
  };

  let swiper;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Swiper
        ref={(ref) => (swiper = ref)}
        loop={false}
        index={currentIndex}
        onIndexChanged={(index) => setCurrentIndex(index)}
        showsPagination={true}
      >
        {screens.map((screen) => (
          <View key={screen.id} style={styles.slide}>
            <Text style={styles.title}>{screen.title}</Text>
            <Text style={styles.content}>{screen.content}</Text>
          </View>
        ))}
      </Swiper>
      <View style={styles.buttonContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={handlePrevious} style={styles.button}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSkip} style={styles.button}>
          <Text style={styles.buttonText}>
            {currentIndex === screens.length - 1 ? 'Finish' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default OnboardingScreens;