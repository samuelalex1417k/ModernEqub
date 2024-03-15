import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from expo vector icons

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (text) => {
    const trimmedText = text.trim();
    setPassword(trimmedText);
    setIsPasswordValid(trimmedText.length >= 8);
  };

  const validateConfirmPassword = (text) => {
    const trimmedText = text.trim();
    setConfirmPassword(trimmedText);
    setIsConfirmPasswordValid(trimmedText.length >= 8);
  };

  const handleResetPassword = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      console.log('Resetting password...');
      navigation.navigate('Login');
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate('Login');
  };

  // Check if both inputs are valid to enable the reset password button
  const isResetPasswordEnabled = isPasswordValid && isConfirmPasswordValid;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        onChangeText={validatePassword}
        value={password}
        secureTextEntry={!showPassword}
        
      />
      <TouchableOpacity
        style={styles.eyeIcon}
        onPress={() => setShowPassword(!showPassword)}>
        <Ionicons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={validateConfirmPassword}
        value={confirmPassword}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity
        style={styles.eyeIcon}
        onPress={() => setShowPassword(!showPassword)}>
        <Ionicons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, !isResetPasswordEnabled && styles.disabledButton]}
        onPress={handleResetPassword}
        disabled={!isResetPasswordEnabled}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLoginRedirect}>
        <Text style={styles.linkText}>Remember password? Login Here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: -100,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#186A65',
    width: '40%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#19524E',
    fontSize: 14,
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 30,
  },
});

export default ResetPasswordScreen;
