import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated,Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoreDetails = ({ route }) => {
    const { stageId, etudiantEmail } = route.params;
    const [candidature, setCandidature] = useState(null);
    const [stageData, setStageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
  
    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepté':
                return styles.statusAccepted;
            case 'refusé':
                return styles.statusRejected;
            default:
                return styles.statusPending;
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
      
            const response = await axios.get(`${process.env.BACKEND_URL}/etudiant/candidatures2`, {
              params: {
                etudiantEmail, // Assuming etudiantEmail is defined or passed correctly
                stageId, // Assuming stageId is defined or passed correctly
              },
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            });
      
            const { candidature, stage } = response.data;
      
            setCandidature(candidature);
            setStageData(stage);
            setLoading(false); 
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();// Set loading to false once data is fetched
          } catch (error) {
            setError(error.message);
            setLoading(false); // Set loading to false on error
          }
        };
      
        fetchData();
      }, [etudiantEmail, stageId]);
      

    if (loading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    if (error) {
        return <View style={styles.container}><Text>Error: {error}</Text></View>;
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.cardContainer}>

     
                <Text style={styles.heading}> {stageData.entrepriseName} : {stageData.stageDomaine} - {stageData.stageSujet} </Text>
                
                <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={[styles.statusContainer, getStatusStyle(stageData.status)]}>
                <Text style={styles.statusText}>CANDIDATURE {stageData.status.toUpperCase()}</Text>
            </View>
            </Animated.View>


                {candidature &&
                    <View style={styles.card}>
                        <Text style={styles.title}>{candidature.nom} {candidature.prenom}</Text>
                        <View style={styles.separator} />
                        
                        {/* Using subtitle as legend */}
                        <Text style={styles.legend}>Informations personnelles</Text>
                        <Text><Text style={styles.bold}>Date de naissance:</Text> {candidature.date_naissance}</Text>
                        <Text><Text style={styles.bold}>Adresse:</Text> {candidature.adresse}</Text>
                        <Text><Text style={styles.bold}>Téléphone:</Text> {candidature.telephone}</Text>
                        <Text><Text style={styles.bold}>Email:</Text> {candidature.email}</Text>
                        <View style={styles.separator} />
                        
                        <Text style={styles.legend}>Formation</Text>
                        <Text><Text style={styles.bold}>Niveau d'études:</Text> {candidature.niveau_etudes}</Text>
                        <Text><Text style={styles.bold}>Institution:</Text> {candidature.institution}</Text>
                        <Text><Text style={styles.bold}>Domaine d'études:</Text> {candidature.domaine_etudes}</Text>
                        <Text><Text style={styles.bold}>Section:</Text> {candidature.section}</Text>
                        <Text><Text style={styles.bold}>Année d'obtention:</Text> {candidature.annee_obtention}</Text>
                        <View style={styles.separator} />
                        
                        <Text style={styles.legend}>Expérience pertinente</Text>
                        <Text><Text style={styles.bold}>Expérience:</Text> {candidature.experience ? 'Oui' : 'Non'}</Text>
                        {candidature.experience_description && <Text><Text style={styles.bold}>Description de l'expérience:</Text> {candidature.experience_description}</Text>}
                        <View style={styles.separator} />
                        
                        <Text style={styles.legend}>Motivation pour ce stage</Text>
                        <Text><Text style={styles.bold}>Motivation:</Text> {candidature.motivation}</Text>
                        <View style={styles.separator} />
                        
                        <Text style={styles.legend}>Compétences</Text>
                        <Text><Text style={styles.bold}>Langues:</Text> {candidature.langues}</Text>
                        <Text><Text style={styles.bold}>Logiciels:</Text> {candidature.logiciels}</Text>
                        <Text><Text style={styles.bold}>Autres compétences:</Text> {candidature.competences_autres}</Text>
                        <View style={styles.separator} />
                        
                        <Text style={styles.legend}>Disponibilités</Text>
                        <Text><Text style={styles.bold}>Date de début:</Text> {candidature.date_debut}</Text>
                        <Text><Text style={styles.bold}>Durée du stage:</Text> {candidature.duree_stage} mois</Text>
                        <View style={styles.separator} />
                        
                        <Text style={styles.legend}>Pièces justificatives</Text>
                        {/* Render CV link */}
                        <Text>
                            <Text style={styles.bold}>CV :</Text>
                            {candidature.cv ? (
                                <Text onPress={() => Linking.openURL(candidature.cv)} style={styles.link}>
                                    Ouvrir CV
                                </Text>
                            ) : (
                                <Text style={styles.redText}> document pas fournis</Text>
                            )}
                        </Text>
                        
                        {/* Render Lettre de Motivation link */}
                        {candidature.lettre_motivation && (
                            <Text>
                                <Text style={styles.bold}>Lettre de Motivation:</Text>
                                {candidature.lettre_motivation !== "document pas fournis" ? (
                                    <Text onPress={() => Linking.openURL(candidature.lettre_motivation)} style={styles.link}>
                                        Ouvrir Lettre de Motivation
                                    </Text>
                                ) : (
                                    <Text style={styles.redText}> document pas fournis</Text>
                                )}
                            </Text>
                        )}
                        
                        {/* Render Relevés de Notes link */}
                        {candidature.releves_notes && (
                            <Text>
                                <Text style={styles.bold}>Relevés de Notes :</Text>
                                {candidature.releves_notes !== "document pas fournis" ? (
                                    <Text onPress={() => Linking.openURL(candidature.releves_notes)} style={styles.link}>
                                        Ouvrir Relevés de Notes
                                    </Text>
                                ) : (
                                    <Text style={styles.redText}> document pas fournis</Text>
                                )}
                            </Text>
                        )}
                    </View>
                }
            </View>
          
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    cardContainer: {
        marginBottom: 20
    },
    card: {
        backgroundColor: '#f1f1f1',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3
    },
    heading: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#007bff',
        paddingTop: 10,
        fontSize: 18,
        marginBottom: 10
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginVertical: 20,
        fontSize: 24
    },
    legend: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: '#007bff' // Adjust color as needed
    },
    bold: {
        fontWeight: 'bold'
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 10
    },
    redText: {
        color: 'red'
    },  
    link: {
        color: 'blue',
        textDecorationLine: 'underline'
    },

    statusContainer: {
        alignSelf: 'center',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffc107', 
    }, 

    statusAccepted: {
        backgroundColor: '#28a745', // green
    },
    statusRejected: {
        backgroundColor: '#dc3545', // red
    },




    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MoreDetails;
