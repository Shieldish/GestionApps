import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Animated,
  FlatList,
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

  const navigation = useNavigation();

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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
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
    </View>
  );

  const renderItem = ({ item, index }) => {
    const translateY = new Animated.Value(50);

    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View 
        style={[
          styles.card,
          { 
            opacity: fadeAnim,
            transform: [{ translateY }]
          }
        ]}
      >
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>
            <Icon name="work" size={18} color="blue" /> {item.stageDomaine} : {item.entrepriseName}
          </Text>
          <Text>
            <Text style={styles.bold}><Icon name="person" size={16} /> Nom et Prenom:</Text> {item.etudiantName}
          </Text>
          <Text>
            <Text style={styles.bold}><Icon name="email" size={16} /> Email:</Text> {item.etudiantEmail}
          </Text>
          <Text>
            <Text style={styles.bold}><Icon name="school" size={16} /> Institue:</Text> {item.etudiantInstitue}
          </Text>
          <Text>
            <Text style={styles.bold}><Icon name="business-center" size={16} /> Domaine:</Text> {item.stageDomaine}
          </Text>
          <Text>
            <Text style={styles.bold}><Icon name="category" size={16} /> Section:</Text> {item.etudiantSection}
          </Text>
          <Text>
            <Text style={styles.bold}><Icon name="description" size={16} /> Sujet:</Text> {item.stageSujet}
          </Text>
          <Text style={{ color: getStatusColor(item.status), fontWeight: 'bold' }}>
            <Text style={styles.bold}><Icon name="check-circle" size={16} /> Status:</Text> {item.status}
          </Text>
          <Text>
            <Text style={styles.bold}><Icon name="calendar-today" size={16} /> Date de postulation:</Text> {item.postulatedAt}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MoreDetails', {
              stageId: item.stageId,
              etudiantEmail: item.etudiantEmail
            })}
          >
            <Text><Icon name="info" size={16} /> View more Details</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3, 4]} // Render 4 skeleton loaders
        renderItem={renderLoader}
        keyExtractor={(item, index) => `loader-${index}`}
        contentContainerStyle={styles.container}
      />
    );
  }

  return (
    <FlatList
      data={postulants}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.ID}-${item.etudiantEmail}`}
      contentContainerStyle={styles.container}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>Listes des stages Postulés</Text>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false} // Add this line
    />
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