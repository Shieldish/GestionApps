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
      title: 'Bienvenue',
      content: `Bienvenue dans notre application de gestion de stages. Cette plateforme est conçue pour vous aider à organiser et suivre facilement vos stages, de l'inscription à l'évaluation finale. Grâce à notre application, vous pouvez :
      * Rechercher et postuler à des offres de stages.
      * Suivre l'état de vos candidatures en temps réel.
      * Communiquer avec les superviseurs et les entreprises.
      * Remplir et soumettre des rapports de stage.
      * Recevoir des évaluations et des feedbacks.
      
      Que vous soyez étudiant, stagiaire ou recruteur, notre application est là pour simplifier et améliorer votre expérience de gestion des stages. Profitez de toutes les fonctionnalités pour une gestion efficace et sans tracas de vos stages.`,
      image: require('./assets/11.jpeg'),
    },
    {
        id: 2,
        title: 'Fonctionnalités',
        content: 'Découvrez nos fonctionnalités exceptionnelles. Naviguez facilement dans l\'application grâce à une interface utilisateur intuitive et bénéficiez d\'outils puissants pour gérer vos stages de manière efficace. Que ce soit pour trouver des offres de stages, suivre vos candidatures, ou communiquer avec les recruteurs, notre application vous offre tout ce dont vous avez besoin.',
        image: require('./assets/out-1.png'),
      },
      
      {
        id: 3,
        title: 'Commencer',
        content: 'Commencez dès maintenant à utiliser notre application pour une gestion simplifiée de vos stages. Inscrivez-vous, créez votre profil, et explorez les nombreuses opportunités de stages disponibles. Notre plateforme vous accompagne pas à pas, de la recherche de stage à la validation de votre expérience professionnelle.',
        image: require('./assets/out-2.png'),
      }
      
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
    maxHeight: height * 0.4,
    width: width * 0.9,
  },
  content: {
    fontSize: 16,
    fontWeight:'semibold',
    textAlign: 'center',
    paddingHorizontal: 20,
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
    borderRadius: 50,
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