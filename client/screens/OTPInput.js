import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const OTPInputPage = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(120); // Initial time in seconds
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);
  const [isResendPressed, setIsResendPressed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsContinueEnabled(otp.trim() !== '');
  }, [otp]);

  const handleContinue = () => {
    // Send OTP logic here
    navigation.navigate('ResetPassword');
  };

  const handleResendCode = () => {
    // Resend OTP logic here
    setResendTimer(120); // Reset timer
    setIsResendPressed(true);
  };

  const minutes = Math.floor(resendTimer / 60);
  const seconds = resendTimer % 60;
  const formattedTimer = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Enter the 6-Digit code we sent you (OTP)</Text>

      <TextInput
        style={styles.input}
        placeholder="OTP"
        onChangeText={setOtp}
        value={otp}
        keyboardType="numeric"
        maxLength={6}
      />
      <TouchableOpacity
        style={[styles.button, !isContinueEnabled && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!isContinueEnabled}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      {resendTimer !== 0 ? (
        <Text style={styles.resendTimer}>{`Resend code in ${formattedTimer}`}</Text>
      ) : (
        <TouchableOpacity
          style={styles.resendLink}
          onPress={handleResendCode}
          disabled={isResendPressed}>
          <Text style={styles.resendLinkText}>
            {isResendPressed ? "Didn't get code? Resend" : "Resend code"}
          </Text>
        </TouchableOpacity>
      )}
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 40,
    marginTop: -200,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
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
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resendTimer: {
    marginTop: 10,
    fontSize: 14,
  },
  resendLink: {
    marginTop: 10,
  },
  resendLinkText: {
    color: '#19524E',
    fontSize: 14,
  },
});

export default OTPInputPage;
