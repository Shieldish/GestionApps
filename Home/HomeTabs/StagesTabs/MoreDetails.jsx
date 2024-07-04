import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import axios from 'axios';

const MoreDetails = ({ route }) => {
    const { stageId, etudiantEmail } = route.params;
    const [candidature, setCandidature] = useState(null);
    const [stageData, setStageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.BACKEND_URL}/etudiant/candidatures2`, {
                    params: {
                        etudiantEmail,
                        stageId
                    }
                });
                const { candidature, stage } = response.data;

                setCandidature(candidature);
                setStageData(stage);
                setLoading(false); // Set loading to false once data is fetched
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

            {stageData.status && (
                <View style={[styles.statusContainer,
                    stageData.status === 'accepté' ? styles.statusAccepted :
                    stageData.status === 'refusé' ? styles.statusRejected : null]}>
                    <Text style={styles.statusContainerContents}>{stageData.status}</Text>
                </View>
            )}
                <Text style={styles.heading}>Candidature : {stageData.stageDomaine} / {stageData.stageSujet} / {stageData.entrepriseName}</Text>
                
                {candidature &&
                    <View style={styles.card}>
                        <Text style={styles.title}>{candidature.nom} {candidature.prenom}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.subtitle}>Informations personnelles</Text>
                        <Text><Text style={styles.bold}>Date de naissance:</Text> {candidature.date_naissance}</Text>
                        <Text><Text style={styles.bold}>Adresse:</Text> {candidature.adresse}</Text>
                        <Text><Text style={styles.bold}>Téléphone:</Text> {candidature.telephone}</Text>
                        <Text><Text style={styles.bold}>Email:</Text> {candidature.email}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.subtitle}>Formation</Text>
                        <Text><Text style={styles.bold}>Niveau d'études:</Text> {candidature.niveau_etudes}</Text>
                        <Text><Text style={styles.bold}>Institution:</Text> {candidature.institution}</Text>
                        <Text><Text style={styles.bold}>Domaine d'études:</Text> {candidature.domaine_etudes}</Text>
                        <Text><Text style={styles.bold}>Section:</Text> {candidature.section}</Text>
                        <Text><Text style={styles.bold}>Année d'obtention:</Text> {candidature.annee_obtention}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.subtitle}>Expérience pertinente</Text>
                        <Text><Text style={styles.bold}>Expérience:</Text> {candidature.experience ? 'Oui' : 'Non'}</Text>
                        {candidature.experience_description && <Text><Text style={styles.bold}>Description de l'expérience:</Text> {candidature.experience_description}</Text>}
                        <View style={styles.separator} />
                        <Text style={styles.subtitle}>Motivation pour ce stage</Text>
                        <Text><Text style={styles.bold}>Motivation:</Text> {candidature.motivation}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.subtitle}>Compétences</Text>
                        <Text><Text style={styles.bold}>Langues:</Text> {candidature.langues}</Text>
                        <Text><Text style={styles.bold}>Logiciels:</Text> {candidature.logiciels}</Text>
                        <Text><Text style={styles.bold}>Autres compétences:</Text> {candidature.competences_autres}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.subtitle}>Disponibilités</Text>
                        <Text><Text style={styles.bold}>Date de début:</Text> {candidature.date_debut}</Text>
                        <Text><Text style={styles.bold}>Durée du stage:</Text> {candidature.duree_stage} mois</Text>
                        <View style={styles.separator} />
                        <Text style={styles.subtitle}>Pièces justificatives</Text>
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
        paddingTop: 20,
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
    subtitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5
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
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        // Default style for 'a attente'
        backgroundColor: '#ffc107', // yellow
    },
    statusContainerContents: {
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
    },
    statusAccepted: {
        backgroundColor: '#28a745', // green
    },
    statusRejected: {
        backgroundColor: '#dc3545', // red
    },

  
});

export default MoreDetails;
