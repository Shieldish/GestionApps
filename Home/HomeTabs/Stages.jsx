import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
  const [searchError, setSearchError] = useState(false);
  const navigation = useNavigation();
  const isFetching = useRef(false);

  useEffect(() => {
    fetchStages();
  }, [pagination.currentPage, search, filters]);

  const fetchStages = async () => {
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
        params: {
          search: search.trim(),
          page: pagination.currentPage.toString(),
          limit: '10',
          ...filters,
        }
      });
           console.log(response.data.stages)   

      setStages(response.data.stages);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalItems: response.data.pagination.totalItems,
      });
  
      setSearchError(response.data.stages.length === 0);
  
    } catch (error) {
      console.error('Error fetching stages:', error);
      let errorMessage = 'An error occurred while fetching the stages.';
  
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else {
          errorMessage = `HTTP error! status: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No response from the server. Please check your internet connection.';
      }
  
      Alert.alert(
        'Error Fetching Data',
        errorMessage,
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'Retry', onPress: fetchStages },
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!isFetching.current) {
      setRefreshing(true);
      fetchStages();
    }
  };

  const handlePrevPage = () => {
    if (!loading && pagination.currentPage > 1) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (!loading && pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const renderStageItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.jobCompany}>{item.Nom} - {item.Domaine}</Text>

        <View style={styles.hrLine} />

        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="building" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Société/Entreprise:</Text> {item.Nom} : {item.Address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="android" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Stage ID:</Text> {item.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="briefcase" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Domaine :</Text> {item.Domaine}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="pencil" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Sujets:</Text> {item.Libelle} : {item.Titre}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="book" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Description:</Text> {item.Description}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="university" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Niveau :</Text> {item.Niveau}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="bars" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Experience :</Text> {item.Experience}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="language" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Langue:</Text> {item.Langue}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="map-marker" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Address :</Text> {item.Address}, {item.Rue}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="phone" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Contact :</Text> {item.Telephone} / {item.Fax}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="envelope" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Mail :</Text> {item.Email} / {item.Email2}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon  color="blue" name="calendar" size={16} />
            <Text style={styles.detailText}><Text style={styles.boldText}>Début :</Text> {new Date(item.DateDebut).toLocaleDateString()} - <Text style={styles.boldText}>Fin :</Text> {new Date(item.DateFin).toLocaleDateString()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.postulateButton}
          onPress={() => navigation.navigate('Postulation', { stage: item })}
        >
          <Text style={styles.postulateButtonText}>Postuler</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        placeholder="Rechercher..."
        value={search}
        onChangeText={setSearch}
      />

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        stages.length === 0 ? (
          searchError ? renderEmptySearch() : null
        ) : (
          <FlatList
            data={stages}
            renderItem={renderStageItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false} // Add this line
          />
        )
      )}

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, { opacity: pagination.currentPage === 1 ? 0.5 : 1 }]}
          onPress={handlePrevPage}
          disabled={pagination.currentPage === 1 || loading}
        >
          <Text style={styles.paginationButtonText}>{'<<'}</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>{pagination.currentPage} / {pagination.totalPages}</Text>
        <TouchableOpacity
          style={[styles.paginationButton, { opacity: pagination.currentPage === pagination.totalPages ? 0.5 : 1 }]}
          onPress={handleNextPage}
          disabled={pagination.currentPage === pagination.totalPages || loading}
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
    paddingHorizontal: 16,
    paddingTop: 20,
   
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    elevation: 3,
    
  },
  cardBody: {
    flex: 1,
  },
  jobCompany: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 30,
    textAlign:"center",
    textTransform:"uppercase",
    color:"#007bff",
    fontStyle:"bold"
  },
  hrLine: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  detailContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  boldText: {
    fontWeight: 'bold',
  },
  postulateButton: {
    backgroundColor: '#192f6a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  postulateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 12,
    alignItems:"center"
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  emptySearchContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptySearchText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  paginationButtonText: {
    fontSize: 18,
    color: '#007bff',
  },
  paginationText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
});

export default Stages;
