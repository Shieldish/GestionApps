import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Postulation = ({ route }) => {
  const { stage } = route.params;
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(width);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePostuler = () => {
    navigation.navigate('ApplicationForm', { stage: stage.id });
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.header}
        >
          <Text style={styles.title}>Stage Details</Text>
        </LinearGradient>
        <View style={styles.detailsContainer}>
          <DetailItem icon="briefcase" label="StageID" value={stage.id} />
          <DetailItem icon="building" label="Sociéte/Entreprise" value={stage.Nom} />
          <DetailItem icon="tags" label="Domaine" value={stage.Domaine} />
          <DetailItem icon="file-text" label="Sujets" value={`${stage.Libelle} : ${stage.Titre}`} />
          <DetailItem icon="info-circle" label="Description" value={stage.Description} />
          <DetailItem icon="graduation-cap" label="Niveau" value={stage.Niveau} />
          <DetailItem icon="star" label="Experience" value={stage.Experience} />
          <DetailItem icon="language" label="Langue" value={stage.Langue} />
          <DetailItem icon="map-marker" label="Address" value={`${stage.Address}, ${stage.Rue}`} />
          <DetailItem icon="phone" label="Contact" value={`${stage.Telephone} / ${stage.Fax}`} />
          <DetailItem icon="envelope" label="Mail" value={`${stage.Email} / ${stage.Email2}`} />
          <DetailItem 
            icon="calendar" 
            label="Période" 
            value={`${new Date(stage.DateDebut).toLocaleDateString()} - ${new Date(stage.DateFin).toLocaleDateString()}`} 
          />
        </View>
        <TouchableOpacity style={styles.postulerButton} onPress={handlePostuler}>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradient}
          >
            <Text style={styles.postulerButtonText}>Postuler maintenant</Text>
            <Icon name="arrow-right" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const DetailItem = ({ icon, label, value }) => {
  const [expanded, setExpanded] = useState(false);
  const isLongText = value.length > 100;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.detailItem}>
      <Icon name={icon} size={20} color="#3b5998" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {isLongText && !expanded ? (
          <TouchableOpacity onPress={toggleExpand}>
            <Text style={styles.value} numberOfLines={3} ellipsizeMode="tail">
              {value}
            </Text>
            <Text style={styles.expandButton}>See more</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleExpand}>
            <Text style={styles.value}>{value}</Text>
            {isLongText && <Text style={styles.expandButton}>See less</Text>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  icon: {
    marginRight: 15,
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  expandButton: {
    color: '#3b5998',
    marginTop: 5,
    fontWeight: 'bold',
  },
  postulerButton: {
    margin: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#192f6a',
   
  },
  gradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  postulerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default Postulation;