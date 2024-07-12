import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileEditScreen = () => {
  const [userData, setUserData] = useState({
    NOM: '',
    PRENOM: '',
    EMAIL: '',
    DEPARTEMENT: '',
    ADDRESS: '',
    DATE: new Date(),
    UUID: '',
    PASSWORD: '',
    PASSWORD2: ''
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        const data = JSON.parse(storedUserData);
        const id = data.userData.UUID;

        if (data && id) {
          // Fetch detailed user data from the backend
          console.log(id);
          const response = await axios.get(`${process.env.BACKEND_URL}/settings/expo/${id}`);

          if (response.data.success) {
            const userDetails = response.data.data;
            userDetails.DATE = userDetails.DATE ? new Date(userDetails.DATE) : new Date();
            setUserData({ ...userDetails, PASSWORD: '', PASSWORD2: '' });
          } else {
            console.error('Failed to load user details:', response.data.message);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    // Check for empty required fields
    const requiredFields = ['NOM', 'PRENOM', 'DEPARTEMENT', 'ADDRESS', 'DATE'];
    requiredFields.forEach(field => {
      if (!userData[field]) {
        errors[field] = `${field} is required`;
        valid = false;
      }
    });

    // Check password validation
    if (userData.PASSWORD && userData.PASSWORD2) {
      if (userData.PASSWORD !== userData.PASSWORD2) {
        errors.PASSWORD2 = 'Passwords do not match';
        valid = false;
      }
      if (userData.PASSWORD.length < 8 || userData.PASSWORD2.length < 8) {
        errors.PASSWORD = 'Password must be at least 8 characters';
        valid = false;
      }
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/settings/updateUserData2`, userData);

      if (response.data.success) {
        // Handle success (e.g., show a success message, navigate to another screen)
        console.log('Profile updated successfully');
      } else {
        // Handle error
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || userData.DATE;
    setShowDatePicker(Platform.OS === 'ios');
    setUserData({ ...userData, DATE: currentDate });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formRow}>
        <Text style={styles.label}>ID:</Text>
        <TextInput
          style={styles.input}
          value={userData.UUID}
          editable={false}
        />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={userData.EMAIL}
          editable={false}
        />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={userData.NOM}
          onChangeText={(value) => handleInputChange('NOM', value)}
        />
        {errors.NOM && <Text style={styles.error}>{errors.NOM}</Text>}
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={userData.PRENOM}
          onChangeText={(value) => handleInputChange('PRENOM', value)}
        />
        {errors.PRENOM && <Text style={styles.error}>{errors.PRENOM}</Text>}
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Department:</Text>
        <Picker
          selectedValue={userData.DEPARTEMENT}
          style={styles.input}
          onValueChange={(value) => handleInputChange('DEPARTEMENT', value)}
        >
          <Picker.Item label="---Select Department---" value="" />
          <Picker.Item label="Department 1" value="department1" />
          <Picker.Item label="Department 2" value="department2" />
          {/* Add more options as needed */}
        </Picker>
        {errors.DEPARTEMENT && <Text style={styles.error}>{errors.DEPARTEMENT}</Text>}
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Address:</Text>
        <Picker
          selectedValue={userData.ADDRESS}
          style={styles.input}
          onValueChange={(value) => handleInputChange('ADDRESS', value)}
        >
          <Picker.Item label="Select a town" value="" />
          <Picker.Item label="Ariana, Tunisie" value="Ariana, Tunisie" />
          <Picker.Item label="Béja, Tunisie" value="Béja, Tunisie" />
          <Picker.Item label="Ben Arous, Tunisie" value="Ben Arous, Tunisie" />
          {/* Add more options as needed */}
        </Picker>
        {errors.ADDRESS && <Text style={styles.error}>{errors.ADDRESS}</Text>}
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Date of Birth:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View style={styles.datePickerButton}>
            <Text>{userData.DATE ? userData.DATE.toLocaleDateString() : 'Select Date'}</Text>
            <Icon name="calendar" size={20} />
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={userData.DATE || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {errors.DATE && <Text style={styles.error}>{errors.DATE}</Text>}
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>New Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showPassword}
            value={userData.PASSWORD}
            onChangeText={(value) => handleInputChange('PASSWORD', value)}
            placeholder="Password"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
          >
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} />
          </TouchableOpacity>
        </View>
        {errors.PASSWORD && <Text style={styles.error}>{errors.PASSWORD}</Text>}
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Repeat New Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showPassword2}
            value={userData.PASSWORD2}
            onChangeText={(value) => handleInputChange('PASSWORD2', value)}
            placeholder="Repeat Password"
          />
          <TouchableOpacity
            onPress={() => setShowPassword2(!showPassword2)}
            style={styles.iconContainer}
          >
            <Icon name={showPassword2 ? 'eye' : 'eye-slash'} size={20} />
          </TouchableOpacity>
        </View>
        {errors.PASSWORD2 && <Text style={styles.error}>{errors.PASSWORD2}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Update Profile" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formRow: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 50,
    borderRadius: 5,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginLeft: 10,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default ProfileEditScreen;
