import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Clear error message whenever email or password changes
    setErrorMessage('');
  }, [email, password]);

  useEffect(() => {
    // Run animations when the component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true); // Start loading indicator

    try {
      const response = await fetch(`${BACKEND_URL}/connection/loging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json(); // Parse response JSON
      console.log(data)

      if (response.ok) {
        // Handle successful login
        console.log('Login successful:', data);
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.userData));

        // Navigate to next screen or handle success
     

      /*   navigation.replace('HomePage'); */

      // Check if the user has seen the onboarding screens
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

      if (hasSeenOnboarding) {
        // If the user has seen onboarding, navigate to the home page
        navigation.replace('HomePage');
      } else {
        // If the user hasn't seen onboarding, navigate to the onboarding screens
        navigation.replace('Onboarding');
      }

      } else {
        // Handle login failure
        setErrorMessage(data.message || 'Login failed');
      }

    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Login error:', error);
      setErrorMessage('An error occurred while logging in.');
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
        <Image
          source={require('../assets/favicon.png')} // Change this to the path of your image
          style={styles.headerImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>LOGIN</Text>
        
        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        ) : null}
        
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="gray" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="gray" style={styles.inputIcon} />
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
        
        <View style={styles.checkboxContainer}>
          <TouchableOpacity>
            <Icon name="check-square" size={20} color="gray" />
            <Text style={styles.checkboxText}> Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.registerContainer}>
          <Text>Not a member? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentWrapper: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
/*     borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    borderWidth:1,
    borderColor: 'grey',
    elevation: 5, */
  },
  headerImage: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
    textAlign: 'center',
   
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingRight: 40, // Add padding to prevent text overlap with the icon
  },
  passwordToggleIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    fontSize: 16,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#007bff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#007bff',
    marginLeft: 5,
  },
  errorCard: {
    padding: 15,
    backgroundColor: '#ffcccc',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
    borderColor: '#ff6666',
    borderWidth: 1,
    shadowColor: '#ff0000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  errorMessage: {
    color: '#b30000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Login;
