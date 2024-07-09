// Favorites.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobCard from './Partials/JobListings'; // Make sure to import the JobCard component

const Favorites = () => {
  const [favoriteJobs, setFavoriteJobs] = useState([]);

  useEffect(() => {
    loadFavoriteJobs();
  }, []);

  const loadFavoriteJobs = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favoriteJobs');
      console.log('savedFavorites ',savedFavorites)
      if (savedFavorites !== null) {
        const favoriteIds = JSON.parse(savedFavorites);
        // Here, you should fetch the full job data for these IDs
        // For now, we'll assume you have a function to do this
        const favorites = await fetchJobsByIds(favoriteIds);
        setFavoriteJobs(favorites);
      }
    } catch (error) {
      console.error('Error loading favorite jobs:', error);
    }
  };

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

  return (
    <View style={styles.container}>
      {favoriteJobs.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorite jobs yet</Text>
      ) : (
        <FlatList
          data={favoriteJobs}
          renderItem={({ item }) => (
            <JobCard job={item} onToggleFavorite={handleToggleFavorite} />
          )}
          keyExtractor={(item) => item.id}
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
});

export default Favorites;