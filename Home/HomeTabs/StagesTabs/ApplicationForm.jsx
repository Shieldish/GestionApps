import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton, Checkbox } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

const ApplicationForm = ({ route, navigation }) => {
  const { stage } = route.params;

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    adresse: '',
    telephone: '',
    email: '',
    niveau_etudes: '',
    institution: '',
    domaine_etudes: '',
    section: '',
    annee_obtention: '',
    experience: '',
    experience_description: '',
    motivation: '',
    langues: '',
    logiciels: '',
    competences_autres: '',
    date_debut: '',
    duree_stage: '',
    cv: null,
    lettre_motivation: null,
    releves_notes: null,
    termsAccepted: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const handleDateInputChange = (field, value) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    if (datePattern.test(value)) {
      setErrors({ ...errors, [field]: null });
      setFormData({ ...formData, [field]: value });
    } else {
      setErrors({ ...errors, [field]: 'Date must be in dd/mm/yyyy format' });
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || new Date();
      setShowDatePicker(false);

      const formattedDate = currentDate.toLocaleDateString('fr-FR');
      setFormData({ ...formData, date_naissance: formattedDate });
      setErrors({ ...errors, date_naissance: null });
    } else {
      setShowDatePicker(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFilePicker = async (fileType) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: false,
        allowMultiSelection: true,
      });
      const files = res.assets[0];

      if (files) {
        setFormData({ ...formData, [fileType]: { name: files.name, uri: files.uri } });
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.nom) {
      newErrors.nom = 'Le nom est requis';
      isValid = false;
    }
    if (!formData.prenom) {
      newErrors.prenom = 'Le prénom est requis';
      isValid = false;
    }
    if (!formData.date_naissance) {
      newErrors.date_naissance = 'La date de naissance est requise';
      isValid = false;
    }
    if (!formData.adresse) {
      newErrors.adresse = "L'adresse est requise";
      isValid = false;
    }
    if (!formData.telephone) {
      newErrors.telephone = 'Le numéro de téléphone est requis';
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    }
    if (!formData.niveau_etudes) {
      newErrors.niveau_etudes = "Le niveau d'études est requis";
      isValid = false;
    }
    if (!formData.institution) {
      newErrors.institution = "L'institution est requise";
      isValid = false;
    }
    if (!formData.domaine_etudes) {
      newErrors.domaine_etudes = "Le domaine d'études est requis";
      isValid = false;
    }
    if (!formData.section) {
      newErrors.section = 'La section est requise';
      isValid = false;
    }
    if (!formData.annee_obtention) {
      newErrors.annee_obtention = "L'année d'obtention est requise";
      isValid = false;
    }
    if (!formData.experience) {
      newErrors.experience = 'Veuillez indiquer si vous avez de l\'expérience';
      isValid = false;
    }
    if (!formData.motivation) {
      newErrors.motivation = 'La motivation est requise';
      isValid = false;
    }
    if (!formData.langues) {
      newErrors.langues = 'Les langues sont requises';
      isValid = false;
    }
    if (!formData.cv) {
      newErrors.cv = 'Le CV est requis';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!formData.termsAccepted) {
      Alert.alert('Erreur', 'Vous devez accepter les termes avant de soumettre.');
      return;
    }

    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    console.log(formData);
    Alert.alert('Formulaire soumis', 'Votre candidature a été soumise avec succès.');
  };

  return (
    <SafeAreaView style={{ flex: 1 , paddingBottom:30 }}>
      <ScrollView style={styles.container}>
        {/* Your form sections and inputs */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={formData.nom}
            onChangeText={(value) => handleInputChange('nom', value)}
          />
          {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={formData.prenom}
            onChangeText={(value) => handleInputChange('prenom', value)}
          />
          {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
          
          <View style={styles.inputContainer}>
            <MaterialIcons name="date-range" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Date de naissance (dd/mm/yyyy)"
              value={formData.date_naissance}
              onFocus={() => setShowDatePicker(true)}
              onChangeText={(value) => handleDateInputChange('date_naissance', value)}
              keyboardType="numeric"
            />
          </View>
          {errors.date_naissance && <Text style={styles.errorText}>{errors.date_naissance}</Text>}
          {showDatePicker && (
            <DateTimePicker
              value={formData.date_naissance ? new Date(formData.date_naissance.split('/').reverse().join('-')) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={formData.adresse}
            onChangeText={(value) => handleInputChange('adresse', value)}
          />
          {errors.adresse && <Text style={styles.errorText}>{errors.adresse}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            value={formData.telephone}
            onChangeText={(value) => handleInputChange('telephone', value)}
            keyboardType="phone-pad"
          />
          {errors.telephone && <Text style={styles.errorText}>{errors.telephone}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Adresse email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

    
        <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Formation</Text>
        <Picker
          selectedValue={formData.niveau_etudes}
          onValueChange={(value) => handleInputChange('niveau_etudes', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner un niveau" value="" />
          <Picker.Item label="Baccalauréat" value="Baccalauréat" />
          <Picker.Item label="Licence" value="Licence" />
          <Picker.Item label="Master" value="Master" />
          <Picker.Item label="Ingénieur" value="Ingénieur" />
          <Picker.Item label="Doctorat" value="Doctorat" />
        </Picker>
        {errors.niveau_etudes && <Text style={styles.errorText}>{errors.niveau_etudes}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Institution/Université"
          value={formData.institution}
          onChangeText={(value) => handleInputChange('institution', value)}
        />
        {errors.institution && <Text style={styles.errorText}>{errors.institution}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Domaine d'études"
          value={formData.domaine_etudes}
          onChangeText={(value) => handleInputChange('domaine_etudes', value)}
        />
        {errors.domaine_etudes && <Text style={styles.errorText}>{errors.domaine_etudes}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Section"
          value={formData.section}
          onChangeText={(value) => handleInputChange('section', value)}
        />
        {errors.section && <Text style={styles.errorText}>{errors.section}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Année d'obtention du diplôme (prévue)"
          value={formData.annee_obtention}
          onChangeText={(value) => handleInputChange('annee_obtention', value)}
        />
        {errors.annee_obtention && <Text style={styles.errorText}>{errors.annee_obtention}</Text>}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Expérience pertinente</Text>
        <RadioButton.Group
          onValueChange={(value) => handleInputChange('experience', value)}
          value={formData.experience}
        >
          <View style={styles.radioGroup}>
            <RadioButton value="oui" />
            <Text>Oui</Text>
            <RadioButton value="non" />
            <Text>Non</Text>
          </View>
        </RadioButton.Group>
        {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
        {formData.experience === 'oui' && (
          <TextInput
            style={styles.textArea}
            placeholder="Décrivez brièvement votre expérience"
            value={formData.experience_description}
            onChangeText={(value) => handleInputChange('experience_description', value)}
            multiline
          />
        )}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Motivation pour ce stage</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Quelles sont vos motivations pour postuler à ce stage ?"
          value={formData.motivation}
          onChangeText={(value) => handleInputChange('motivation', value)}
          multiline
        />
        {errors.motivation && <Text style={styles.errorText}>{errors.motivation}</Text>}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Compétences</Text>
        <TextInput
          style={styles.input}
          placeholder="Langues parlées/écrites"
          value={formData.langues}
          onChangeText={(value) => handleInputChange('langues', value)}
        />
        {errors.langues && <Text style={styles.errorText}>{errors.langues}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Logiciels/Outils maîtrisés"
          value={formData.logiciels}
          onChangeText={(value) => handleInputChange('logiciels', value)}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Autres compétences pertinentes"
          value={formData.competences_autres}
          onChangeText={(value) => handleInputChange('competences_autres', value)}
          multiline
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Disponibilité</Text>
        <TextInput
          style={styles.input}
          placeholder="Date de début souhaitée"
          value={formData.date_debut}
          onChangeText={(value) => handleInputChange('date_debut', value)}
        />
        <Picker
          selectedValue={formData.duree_stage}
          onValueChange={(value) => handleInputChange('duree_stage', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner la durée" value="" />
          <Picker.Item label="1 mois" value="1 mois" />
          <Picker.Item label="2 mois" value="2 mois" />
          <Picker.Item label="3 mois" value="3 mois" />
          <Picker.Item label="Plus de 3 mois" value="Plus de 3 mois" />
        </Picker>
      </View>


        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <TouchableOpacity style={styles.filePickerButton} onPress={() => handleFilePicker('cv')}>
            <Text style={styles.filePickerButtonText}>
              {formData.cv ? formData.cv.name : 'Ajouter votre CV'}
            </Text>
          </TouchableOpacity>
          {errors.cv && <Text style={styles.errorText}>{errors.cv}</Text>}

          <TouchableOpacity style={styles.filePickerButton} onPress={() => handleFilePicker('lettre_motivation')}>
            <Text style={styles.filePickerButtonText}>
              {formData.lettre_motivation ? formData.lettre_motivation.name : 'Ajouter une lettre de motivation'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filePickerButton} onPress={() => handleFilePicker('releves_notes')}>
            <Text style={styles.filePickerButtonText}>
              {formData.releves_notes ? formData.releves_notes.name : 'Ajouter vos relevés de notes'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Conditions générales</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={formData.termsAccepted ? 'checked' : 'unchecked'}
              onPress={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
            />
            <Text style={styles.checkboxLabel}>
              J'accepte les termes et conditions,
              En soumettant ce formulaire, j'atteste que les informations fournies sont exactes et complètes
              NB : Après soumission il n'est plus possible de modifier !
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Soumettre</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
   
    backgroundColor: '#fff',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign:'center'
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  filePickerButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  filePickerButtonText: {
    color: '#007bff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#192f6a',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplicationForm;
