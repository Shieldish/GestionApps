import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Divider } from 'react-native-elements';

const Favorites = () => {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchJobsByIds = async (ids) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${process.env.BACKEND_URL}/etudiant/stages/byIds`,
        { ids },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs by IDs:', error);
      throw error;
    }
  };

  const loadFavoriteJobs = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favoriteJobs');
      if (savedFavorites !== null) {
        const favoriteIds = JSON.parse(savedFavorites);
        if (Array.isArray(favoriteIds) && favoriteIds.length > 0) {
          const favorites = await fetchJobsByIds(favoriteIds);
          setFavoriteJobs(Array.isArray(favorites) ? favorites : []);
        } else {
          setFavoriteJobs([]);
        }
      } else {
        setFavoriteJobs([]);
      }
    } catch (error) {
      console.error('Error loading favorite jobs:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoriteJobs();
    }, [])
  );

  const handleToggleFavorite = async (job, isFavorite) => {
    try {
      const updatedFavorites = isFavorite
        ? [...favoriteJobs, job]
        : favoriteJobs.filter(favJob => favJob.id !== job.id);
      setFavoriteJobs(updatedFavorites);
      const favoriteIds = updatedFavorites.map(job => job.id);
      await AsyncStorage.setItem('favoriteJobs', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error updating favorite jobs:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavoriteJobs();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading favorite jobs: {error.message}</Text>
      </View>
    );
  }

  const renderJob = ({ item: job }) => (
    <View style={styles.jobContainer}>
      <Text style={styles.cardTitle}>{job.Titre}</Text>
      <Text style={styles.cardSubtitle}>{job.Libelle}</Text>
      <Text style={styles.cardInfo2}>{job.Nom} - {job.Address}</Text>
      <Text style={styles.cardInfo}><Text style={styles.bold}>Experience:</Text> {job.Experience}</Text>
      <Text style={styles.cardInfo}><Text style={styles.bold}>Niveau:</Text> {job.Niveau}</Text>
      <Text style={styles.cardInfo}><Text style={styles.bold}>Postes Vacants:</Text> {job.PostesVacants}</Text>
      <Text style={styles.cardInfo}><Text style={styles.bold}>Date Debut:</Text> {new Date(job.DateDebut).toLocaleDateString()}</Text>
      <Text style={styles.cardInfo}><Text style={styles.bold}>Date Fin:</Text> {new Date(job.DateFin).toLocaleDateString()}</Text>
      <Text style={styles.cardInfo3}>Publié le : {new Date(job.createdAt).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
      <Divider />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Postulation', { stage: job })}>
        <Text style={styles.buttonText}>View More Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <Text style={styles.header}>Favorite Jobs</Text>
  );

  const renderFooter = () => (
    <Text style={styles.footer}>End of List</Text>
  );

  return (
    <View style={styles.container}>
      {favoriteJobs && Array.isArray(favoriteJobs) && favoriteJobs.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorite jobs yet</Text>
      ) : (
        <FlatList
          data={favoriteJobs}
          renderItem={renderJob}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  jobContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  cardInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#7f8c8d',
  },
  cardInfo2: {
    fontSize: 16,
    marginBottom: 8,
    color: '#007bff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardInfo3: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#192f6a',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
});

export default Favorites;
