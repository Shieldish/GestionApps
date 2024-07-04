import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Animated,
} from 'react-native';
import axios from 'axios';
import ContentLoader, { Rect } from 'react-content-loader/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PostulantList = () => {
  const [postulants, setPostulants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation(); // Hook to get navigation

  const fetchPostulants = async () => {
    try {
      setError(null);
      const response = await axios.get(`${process.env.BACKEND_URL}/etudiant/stage_postuler`);
      setPostulants(response.data.postulant);
    } catch (error) {
      console.error('Error fetching postulants:', error);
      setError('Failed to load postulants. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPostulants();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPostulants();
  };

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.loaderContainer}>
        <ContentLoader 
          speed={1}
          width={400}
          height={150}
          viewBox="0 0 400 150"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <Rect x="0" y="10" rx="5" ry="5" width="360" height="10" />
          <Rect x="0" y="30" rx="5" ry="5" width="320" height="10" />
          <Rect x="0" y="50" rx="5" ry="5" width="280" height="10" />
          <Rect x="0" y="80" rx="10" ry="10" width="400" height="60" />
        </ContentLoader>
        {/* Repeat as necessary */}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Listes des stages Postulés</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {postulants.map((postulant) => (
        <Animated.View key={`${postulant.ID}-${postulant.etudiantEmail}`} style={styles.card}>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>
              <Icon name="work" size={18} color="blue" /> {postulant.stageDomaine} : {postulant.entrepriseName}
            </Text>
            <Text>
              <Text style={styles.bold}><Icon name="person" size={16} /> Nom et Prenom:</Text> {postulant.etudiantName}
            </Text>
            <Text>
              <Text style={styles.bold}><Icon name="email" size={16} /> Email:</Text> {postulant.etudiantEmail}
            </Text>
            <Text>
              <Text style={styles.bold}><Icon name="school" size={16} /> Institue:</Text> {postulant.etudiantInstitue}
            </Text>
            <Text>
              <Text style={styles.bold}><Icon name="business-center" size={16} /> Domaine:</Text> {postulant.stageDomaine}
            </Text>
            <Text>
              <Text style={styles.bold}><Icon name="category" size={16} /> Section:</Text> {postulant.etudiantSection}
            </Text>
            <Text>
              <Text style={styles.bold}><Icon name="description" size={16} /> Sujet:</Text> {postulant.stageSujet}
            </Text>
            <Text style={{ color: getStatusColor(postulant.status), fontWeight: 'bold' }}>
              <Text style={styles.bold}><Icon name="check-circle" size={16} /> Status:</Text> {postulant.status}
            </Text>
            <Text>
              <Text style={styles.bold}><Icon name="calendar-today" size={16} /> Date de postulation:</Text> {postulant.postulatedAt}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('MoreDetails', {
                stageId: postulant.stageId,
                etudiantEmail: postulant.etudiantEmail
              })}
            >
              <Text><Icon name="info" size={16} /> View more Details</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'a attente':
      return 'rgb(200, 130, 30)';
    case 'accepté':
      return 'green';
    default:
      return 'red';
  }
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    padding: 16,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'pink',
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 10,
    padding: 16,
    elevation: 3,
    transform: [{ translateY: new Animated.Value(0) }],
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
    color: 'navy',
  },
  button: {
    marginTop: 10,
    alignSelf: 'flex-end',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default PostulantList;
