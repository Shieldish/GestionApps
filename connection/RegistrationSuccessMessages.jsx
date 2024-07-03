import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BACKEND_URL } from '@env';

const RegistrationSuccessMessages = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { nom, email } = route.params;

  const [flashMessage, setFlashMessage] = useState('');
  const [flashMessageType, setFlashMessageType] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setFlashMessage(''); // Clear previous flash messages

    try {
      const response = await fetch(`${BACKEND_URL}/connection/resendmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ NOM: nom, EMAIL: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setFlashMessage(data.message);
        setFlashMessageType('success');
      } else {
        setFlashMessage(data.message);
        setFlashMessageType('error');
      }
    } catch (error) {
      console.error('Failed to resend email:', error);
      setFlashMessage('An error occurred while resending the email. Please try again later.');
      setFlashMessageType('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Email Validation</Text>
        <Text style={styles.paragraph}>Thank you <Text style={styles.strong}>{nom}</Text> for signing up.</Text>
        <Text style={styles.paragraph}>
          An email with a validation link was sent to your email <Text style={styles.email}>{email}</Text>.
          Please open your email inbox and click on the validation link to proceed with signing up.
        </Text>
        <Text style={styles.paragraph}>
          If you have not received an email, please check your spam folder, or click the "Resend Validation Link Email" button below to have it sent again.
        </Text>

        {flashMessage ? (
          <View style={[styles.flashMessage, flashMessageType === 'success' ? styles.success : styles.error]}>
            <Text>{flashMessage}</Text>
          </View>
        ) : null}

        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resendButton, isResending ? styles.buttonDisabled : null]}
            onPress={handleResend}
            disabled={isResending}
          >
            <Text style={styles.buttonText}>{isResending ? 'Resending...' : 'Resend Validation Link Email'}</Text>
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
    backgroundColor: '#f2f2f2',
  },
  contentWrapper: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 20,
    elevation: 5,
    maxWidth: 500,
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  strong: {
    fontWeight: 'bold',
    color: 'black',
  },
  email: {
    fontWeight: 'bold',
    color: 'black',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f2f2f2',
    color: '#333',
  },
  resendButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  flashMessage: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
});

export default RegistrationSuccessMessages;
