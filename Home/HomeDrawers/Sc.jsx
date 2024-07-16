import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

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


  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    let valid = true;
    let errors = {};

    // Check for empty required fields
    const requiredFields = ['NOM', 'PRENOM', 'DEPARTEMENT', 'ADDRESS', 'DATE','PASSWORD','PASSWORD2'];
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
    if (!validateForm() || !isCheckboxChecked) {
      if (!isCheckboxChecked) {
        setErrors(prevErrors => ({ ...prevErrors, checkbox: 'You must agree to the terms and conditions' }));
      }
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
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.gradientBackground}
    >
      <ScrollView style={styles.container}>
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Edit Profile</Text>

          {/* ID and Email (read-only) */}
          <View style={styles.formRow}>
            <Icon name="id-card" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={userData.UUID}
              editable={false}
              placeholder="ID"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.formRow}>
            <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={userData.EMAIL}
              editable={false}
              placeholder="Email"
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Name and Last Name */}
          <View style={styles.formRow}>
            <Icon name="user" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={userData.NOM}
              onChangeText={(value) => handleInputChange('NOM', value)}
              placeholder="Name"
              placeholderTextColor="#ccc"
            />
          </View>
          {errors.NOM && <Text style={styles.error}>{errors.NOM}</Text>}

          <View style={styles.formRow}>
            <Icon name="user" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={userData.PRENOM}
              onChangeText={(value) => handleInputChange('PRENOM', value)}
              placeholder="Last Name"
              placeholderTextColor="#ccc"
            />
          </View>
          {errors.PRENOM && <Text style={styles.error}>{errors.PRENOM}</Text>}

          {/* Department and Address */}
          <View style={styles.formRow}>
            <Icon name="building" size={20} color="#fff" style={styles.icon} />
            <Picker
              selectedValue={userData.DEPARTEMENT}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('DEPARTEMENT', value)}
            >
              <Picker.Item label="Select Department" value="" />
              <Picker.Item label="Department 1" value="department1" />
              <Picker.Item label="Department 2" value="department2" />
            </Picker>
          </View>
          {errors.DEPARTEMENT && <Text style={styles.error}>{errors.DEPARTEMENT}</Text>}

          <View style={styles.formRow}>
            <Icon name="map-marker" size={20} color="#fff" style={styles.icon} />
            <Picker
              selectedValue={userData.ADDRESS}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('ADDRESS', value)}
            >
              <Picker.Item label="Select a town" value="" />
              <Picker.Item label="Ariana, Tunisie" value="Ariana, Tunisie" />
              <Picker.Item label="Béja, Tunisie" value="Béja, Tunisie" />
              <Picker.Item label="Ben Arous, Tunisie" value="Ben Arous, Tunisie" />
            </Picker>
          </View>
          {errors.ADDRESS && <Text style={styles.error}>{errors.ADDRESS}</Text>}

          {/* Date of Birth */}
          <View style={styles.formRow}>
            <Icon name="calendar" size={20} color="#fff" style={styles.icon} />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.dateText}>
                {userData.DATE ? userData.DATE.toLocaleDateString() : 'Select Date of Birth'}
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={userData.DATE || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          {errors.DATE && <Text style={styles.error}>{errors.DATE}</Text>}

          {/* Password Fields */}
          <View style={styles.formRow}>
            <Icon name="lock" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              secureTextEntry={!showPassword}
              value={userData.PASSWORD}
              onChangeText={(value) => handleInputChange('PASSWORD', value)}
              placeholder="New Password"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {errors.PASSWORD && <Text style={styles.error}>{errors.PASSWORD}</Text>}

          <View style={styles.formRow}>
            <Icon name="lock" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              secureTextEntry={!showPassword2}
              value={userData.PASSWORD2}
              onChangeText={(value) => handleInputChange('PASSWORD2', value)}
              placeholder="Repeat New Password"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)} style={styles.eyeIcon}>
              <Icon name={showPassword2 ? 'eye' : 'eye-slash'} size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {errors.PASSWORD2 && <Text style={styles.error}>{errors.PASSWORD2}</Text>}

          {/* Terms and Conditions Checkbox */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              isChecked={isCheckboxChecked}
              onClick={() => setIsCheckboxChecked(!isCheckboxChecked)}
              checkBoxColor="#fff"
            />
            <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
          </View>
          {errors.checkbox && <Text style={styles.error}>{errors.checkbox}</Text>}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
  },
  picker: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    color: '#fff',
  },
  datePickerButton: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    color: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    color: '#fff',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#4ecdc4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileEditScreen;