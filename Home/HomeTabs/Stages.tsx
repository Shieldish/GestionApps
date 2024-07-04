import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert,Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Stages = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [scaleAnim] = useState(new Animated.Value(0));
  const [searchError, setSearchError] = useState(false);

  const navigation = useNavigation(); // Hook to get navigation

  useEffect(() => {
    fetchStages();
  }, [pagination.currentPage, search, filters]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [stages]);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.BACKEND_URL}/etudiant/All?${new URLSearchParams({
        search: search.trim(),
        page: pagination.currentPage.toString(),
        limit: '10',
        ...filters,
      })}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setStages(data.stages);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems,
      });
  
      setSearchError(data.stages.length === 0);
    } catch (error) {
      console.error('Error fetching stages:', error);
  
      // Customize alert message with the error details
      Alert.alert(
        'Error Fetching Data',
        `There was an issue fetching the stages: ${error.message}`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Retry', onPress: () => fetchStages() },  // Retry action to call fetchStages again
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchStages();
  };

  const renderStageItem = ({ item, index }) => (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.cardBody}>
        <Text style={styles.jobCompany}>{item.Nom} - {item.Domaine}</Text>

        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginBottom: 20,
          }}
        />

        <Text style={styles.jobDetails}><Icon name="building" size={16} /> <Text style={styles.boldText}>Sociéte/Entreprise:</Text> {item.Nom} : {item.Address} </Text>

        <Text style={styles.jobDetails}><Icon name="android" size={16} /> <Text style={styles.boldText}>StageID:</Text> {item.id}</Text>

        <Text style={styles.jobDetails}><Icon name="briefcase" size={16} /> <Text style={styles.boldText}>Domaine :</Text> {item.Domaine}</Text>
        <Text style={styles.jobDetails}><Icon name="pencil" size={16} /> <Text style={styles.boldText}>Sujets:</Text> {item.Libelle} : {item.Titre} </Text>
        <Text style={styles.jobDetails}><Icon name="book" size={16} /> <Text style={styles.boldText}>Description:</Text> {item.Description}</Text>
        <Text style={styles.jobDetails}><Icon name="university" size={16} /> <Text style={styles.boldText}>Niveau :</Text> {item.Niveau}</Text>
        <Text style={styles.jobDetails}><Icon name="bars" size={16} /> <Text style={styles.boldText}>Experience :</Text> {item.Experience}</Text>
        <Text style={styles.jobDetails}><Icon name="language" size={16} /> <Text style={styles.boldText}>Langue:</Text> {item.Langue}</Text>
        <Text style={styles.jobDetails}><Icon name="map-marker" size={16} /> <Text style={styles.boldText}>Address :</Text> {item.Address}, {item.Rue}</Text>
        <Text style={styles.jobDetails}><Icon name="phone" size={16} /> <Text style={styles.boldText}>Contact :</Text> {item.Telephone} / {item.Fax}</Text>
        <Text style={styles.jobDetails}><Icon name="envelope" size={16} /> <Text style={styles.boldText}>Mail :</Text> {item.Email} / {item.Email2}</Text>
        <Text style={styles.jobDetails}><Icon name="calendar" size={16} /> <Text style={styles.boldText}>Debut :</Text> {new Date(item.DateDebut).toLocaleDateString()} - <Text style={styles.boldText}>Fin :</Text> {new Date(item.DateFin).toLocaleDateString()}</Text>
        
        <TouchableOpacity 
          style={styles.postulateButton}
          onPress={() => navigation.navigate('Postulation', { stage: item })} // Navigate to Postulation screen with item data
        >
          <Text style={styles.postulateButtonText}>Postuler</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Liste des Stages</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2024 Stages App</Text>
    </View>
  );

  const renderEmptySearch = () => (
    <View style={styles.emptySearchContainer}>
      <Text style={styles.emptySearchText}>{`"${search}" not found`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        stages.length === 0 ? (
          searchError ? renderEmptySearch() : null
        ) : (
          <FlatList
            data={stages}
            renderItem={renderStageItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )
      )}

      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={styles.paginationButton} 
          onPress={() => setPagination(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
          disabled={pagination.currentPage === 1}
        >
          <Text style={styles.paginationButtonText}>{'<<'}</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>{pagination.currentPage} / {pagination.totalPages}</Text>
        <TouchableOpacity 
          style={styles.paginationButton} 
          onPress={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, prev.totalPages) }))}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          <Text style={styles.paginationButtonText}>{'>>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
  },
  cardBody: {
    flex: 1,
  },
  jobCompany: {
    fontSize: 24,
    color: '#666',
    marginBottom: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    padding: 30,
  },
  jobDetails: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  postulateButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  postulateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#aaa',
    borderRadius: 5,
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    margin: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  headerText: {
    color: '#26119e',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  footerText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default Stages;
