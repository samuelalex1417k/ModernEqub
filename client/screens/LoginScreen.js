import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import PhoneNumberInput from 'react-native-phone-number-input';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePhoneNumber = (text) => {
    const trimmedText = text.trim();
    setPhoneNumber(trimmedText);
    setIsPhoneNumberValid(trimmedText.length > 0);
  };

  const validatePassword = (text) => {
    const trimmedText = text.trim();
    setPassword(trimmedText);
    setIsPasswordValid(trimmedText.length >= 8);
  };

  // Check if both inputs are valid to enable the login button
  const isLoginEnabled = isPhoneNumberValid && isPasswordValid;

  const handleLogin = () => {
    navigation.navigate('HomePage');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('OTP');
  };

  const handleBackButton = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    // Register the back button handler when the login page is focused
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Equb</Text>

      <PhoneNumberInput
        defaultValue=""
        defaultCode="ET"
        onChangeText={validatePhoneNumber}
        value={phoneNumber}
        keyboardType="numeric"
        maxLength={9}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordinput}
          placeholder="Password"
          onChangeText={validatePassword}
          value={password}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, !isLoginEnabled && styles.disabledButton]}
        onPress={handleLogin}
        disabled={!isLoginEnabled}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.linkText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.linkText}>Forgot Password?</Text>
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
  },
  logo: {
    color: '#186A65',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: -80,
  },
  phoneInput: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  passwordinput: {
    flex: 1,
  },
  button: {
    backgroundColor: '#186A65',
    width: '40%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
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
});

export default LoginScreen;
