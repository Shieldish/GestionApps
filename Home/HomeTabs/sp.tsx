import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from 'react-native';
import axios from 'axios';

const PostulantList = () => {
  const [postulants, setPostulants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPostulants = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND_URL}/etudiant/stage_postuler`); // Replace with your backend URL
      setPostulants(response.data.postulant);
    } catch (error) {
      console.error('Error fetching postulants:', error);
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
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Listes des stages Postulés</Text>
      {postulants.map((postulant) => (
        <View key={postulant.ID} style={styles.card}>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}> {postulant.stageDomaine} : {postulant.entrepriseName} </Text>
            <Text><Text style={styles.bold}>Nom et Prenom:</Text> {postulant.etudiantName}</Text>
            <Text><Text style={styles.bold}>Email:</Text> {postulant.etudiantEmail}</Text>
            <Text><Text style={styles.bold}>Institue:</Text> {postulant.etudiantInstitue}</Text>
            <Text><Text style={styles.bold}>Domaine:</Text> {postulant.stageDomaine}</Text>
            <Text><Text style={styles.bold}>Section:</Text> {postulant.etudiantSection}</Text>
            <Text><Text style={styles.bold}>Sujet:</Text> {postulant.stageSujet}</Text>
            <Text><Text style={styles.bold}>Entreprise:</Text> {postulant.entrepriseName}</Text>
            <Text style={{ color: getStatusColor(postulant.status), fontWeight: 'bold' }}>
              <Text style={styles.bold}>Status:</Text> {postulant.status}
            </Text>
            <Text><Text style={styles.bold}>Date de postulation:</Text> {postulant.postulatedAt}</Text>
          {/*   <Text><Text style={styles.bold}>CV:</Text> <Text style={styles.link} onPress={() => Linking.openURL(postulant.CVPath)}>Ouvrir CV</Text></Text> */}
            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`/etudiant/candidatures?etudiantEmail=${postulant.etudiantEmail}&stageId=${postulant.stageId}`)}>
              <Text>View more Details</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  container: {
    padding: 16,
    backgroundColor: 'beige',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginVertical: 10,
    padding: 16,
    transition: 'all 0.3s ease',
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
  },
  button: {
    marginTop: 10,
    alignSelf: 'flex-end',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  }
});

export default PostulantList;
