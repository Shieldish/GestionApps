import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from '@env';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!name || !username || !email || !password || !repeatPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== repeatPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if(password.length<8 || repeatPassword.length<8)
      {
        setErrorMessage('Passwords must be at least 8 characters.');
        return;
      }

    setLoading(true); // Show loading spinner

    try {
      const response = await fetch(`${BACKEND_URL}/connection/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         nom:name,
         prenom :username,
         email: email,
         password: password,
         repeatPassword:repeatPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage(''); // Clear any previous error message
        // Optionally, handle success or navigate to another screen
        navigation.navigate('RegistrationSuccessMessages', { nom : name, email : email }); // Navigate to login screen
      } else {
        setErrorMessage(data.message); // Set error message from API response
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Register</Text>

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.passwordToggleIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Repeat Password"
            secureTextEntry={!showRepeatPassword}
            value={repeatPassword}
            onChangeText={setRepeatPassword}
          />
          <TouchableOpacity
            style={styles.passwordToggleIcon}
            onPress={() => setShowRepeatPassword(!showRepeatPassword)}
          >
            <Icon name={showRepeatPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.switchText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  contentWrapper: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 40, // Add padding to prevent text overlap with the icon
  },
  passwordToggleIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    color: '#007bff',
    marginLeft: 5,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Register;
