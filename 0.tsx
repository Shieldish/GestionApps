// OnboardingScreens.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const OnboardingScreens = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const screens = [
    {
      id: 1,
      title: 'Welcome',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: require('./assets/11.jpeg'),
    /*   gif: require('./assets/celebration.gif'), */
    },
    {
      id: 2,
      title: 'Features',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: require('./assets/icon.png'),
      gif: '<iframe src="https://giphy.com/embed/TPJnC36kY11vc05p7V" width="480" height="480" style="border:0;" allowFullScreen></iframe>',
    },
    {
      id: 3,
      title: 'Get Started',
      content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      image: require('./assets/out-0.png'),
      gif: '<iframe src="https://giphy.com/embed/TPJnC36kY11vc05p7V" width="480" height="480" style="border:0;" allowFullScreen></iframe>',
    },
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
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {screens.map((screen) => (
          <View key={screen.id} style={styles.slide}>
            <Image source={screen.image} style={styles.image} />
            <Text style={styles.title}>{screen.title}</Text>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.content}>{screen.content}</Text>
            </ScrollView>
            <Image source={screen.gif} style={styles.gif} />
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: width,
    height: height * 0.3,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  scrollView: {
    maxHeight: height * 0.2,
    width: width * 0.9,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  gif: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  pagination: {
    bottom: 70,
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});

export default OnboardingScreens;