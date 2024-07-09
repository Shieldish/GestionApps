
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, RefreshControl, ScrollView, View, Text } from 'react-native';
import JobListings from './JobListings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader, { Rect } from 'react-content-loader/native';
import axios from 'axios';

const Loader = () => (
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
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${process.env.BACKEND_URL}/etudiant/All`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      setJobData(response.data.stages);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please check your network connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          Array(5).fill().map((_, index) => <Loader key={index} />)
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : jobData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No job listings available.</Text>
          </View>
        ) : (
          <JobListings data={jobData} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default App;
