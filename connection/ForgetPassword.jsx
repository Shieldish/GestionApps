import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from '@env';

const ForgotPasswordModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!visible) {
      // Reset form state when modal is closed
      setResetEmail('');
      setMessage('');
      setIsError(false);
    }
  }, [visible]);

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setMessage('Please enter your email address');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`${BACKEND_URL}/connection/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`${data.message} ${resetEmail}`);
        setIsError(false);
      } else {
        setMessage(data.error || 'An error occurred. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Forgot Password</Text>
          <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
  
          </TouchableOpacity>

          <View style={styles.modalBody}>
            <Text style={styles.label}>Please enter your email address to reset password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={resetEmail}
              onChangeText={(text) => {
                setResetEmail(text);
                setMessage('');
                setIsError(false);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {message ? (
              <Text style={[styles.message, isError ? styles.errorMessage : styles.successMessage]}>
                {message}
              </Text>
            ) : null}

            <View style={styles.buttonGroup}>
              <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
                style={[styles.button, styles.secondaryButton]}
                accessibilityLabel="Close modal"
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResetPassword}
                style={[styles.button, styles.primaryButton]}
                accessibilityLabel="Reset password"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Reset</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ... (keep the existing styles)
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBody: {
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  secondaryButton: {
    backgroundColor: '#ddd',
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  message: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
  },
  successMessage: {
    color: 'green',
  },
});

export default ForgotPasswordModal;