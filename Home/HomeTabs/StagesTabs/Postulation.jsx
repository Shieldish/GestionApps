import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const Postulation = ({ route }) => {
  const { stage } = route.params;
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePostuler = () => {
    navigation.navigate('ApplicationForm', { stage: stage.id });
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.header}
        >
          <Text style={styles.title}>Stages Details</Text>
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
  content: {
    padding: 20,
  },
  header: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
    width: 30,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight:'bold',
    color: '#333',
  },
  expandButton: {
    color: '#3b5998',
    marginTop: 5,
    fontWeight: 'bold',
  },
  postulerButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  gradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  postulerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default Postulation;