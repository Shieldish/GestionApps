import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform, TextInput,Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';

const Divider = () => <View style={styles.divider} />;

const JobCard = React.memo(({ job }) => {

    
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
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
      <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate('Postulation', { stage: job })}
      >
        <Text style={styles.buttonText}>View More Details</Text>
      </TouchableOpacity>
    </View>
  );
});



const JobListings = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'


  useEffect(() => {
    const filtered = data.filter(job => 
      job.Titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Domaine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Niveau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.State.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Experience.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  
    // Sort the filtered data
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
  
    setFilteredData(sorted);
  }, [searchTerm, data, sortOrder]);


  const FilterTab = ({ sortOrder, onSortChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));
  
    const toggleAccordion = () => {
      const toValue = expanded ? 0 : 1;
      Animated.timing(animation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setExpanded(!expanded);
    };
  
    const bodyHeight = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100], // Adjust this value based on your content
    });
  
    return (
      <View style={styles.accordion}>
        <TouchableOpacity style={styles.header} onPress={toggleAccordion}>
          <Text style={styles.headerText}>Sort by</Text>
          <Ionicons 
            name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} 
            size={24} 
            color="#192f6a" 
          />
        </TouchableOpacity>
        <Animated.View style={[styles.body, { height: bodyHeight }]}>
          <TouchableOpacity
            style={[styles.filterButton, sortOrder === 'newest' && styles.activeFilter]}
            onPress={() => {
              onSortChange('newest');
              toggleAccordion();
            }}
          >
            <Ionicons name="time-outline" size={24} color={sortOrder === 'newest' ? '#192f6a' : '#7f8c8d'} />
            <Text style={[styles.filterText, sortOrder === 'newest' && styles.activeFilterText]}>Most Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, sortOrder === 'oldest' && styles.activeFilter]}
            onPress={() => {
              onSortChange('oldest');
              toggleAccordion();
            }}
          >
            <Ionicons name="calendar-outline" size={24} color={sortOrder === 'oldest' ? '#192f6a' : '#7f8c8d'} />
            <Text style={[styles.filterText, sortOrder === 'oldest' && styles.activeFilterText]}>Oldest</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };
  


  const groupedData = useMemo(() => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) return [];
    
    return Object.entries(filteredData.reduce((acc, item) => {
      if (!acc[item.Domaine]) {
        acc[item.Domaine] = [];
      }
      acc[item.Domaine].push(item);
      return acc;
    }, {}));
  }, [filteredData]);

  if (filteredData.length === 0) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <View style={styles.noDataContainer}>
          <Text style={styles.notFoundText}>"{searchTerm}" not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search jobs..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FilterTab sortOrder={sortOrder} onSortChange={setSortOrder} />
      {filteredData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.notFoundText}>"{searchTerm}" not found</Text>
        </View>
      ) : (
        <FlatList
          data={searchTerm ? filteredData : groupedData}
          renderItem={searchTerm ? 
            ({ item }) => <JobCard job={item} /> :
            ({ item: [domain, jobs] }) => (
              <View style={styles.domaineContainer}>
                <Text style={styles.domaineTitle}>{domain}</Text>
                <FlatList
                  data={jobs}
                  renderItem={({ item }) => <JobCard job={item} />}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                <Divider />
              </View>
            )
          }
          keyExtractor={searchTerm ? (item) => item.id : ([domain]) => domain}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  domaineContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  domaineTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#cccaaa',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderColor: 'white',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign:'center',
    textTransform:'uppercase',
  },
  cardSubtitle: {
    fontSize: 18,
    color:'#666',
    marginBottom: 12,
    textAlign:'center',
    textTransform:'uppercase',
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
    textTransform:'uppercase',
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
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#192f6a',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    marginVertical: 10,
    paddingTop:10,
    borderBottomColor: '#ccc',
    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
  },
  filterTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#e6f0ff',
  },
  filterText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#7f8c8d',
  },
  activeFilterText: {
    color: '#192f6a',
    fontWeight: 'bold',
  },
  accordion: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#192f6a',
  },
  body: {
    overflow: 'hidden',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  activeFilter: {
    backgroundColor: '#e6f0ff',
  },
 
});

export default JobListings;