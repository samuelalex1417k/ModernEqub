import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAppOpenedBefore = async () => {
      try {
        // Check if the app has been opened before
        const value = await AsyncStorage.getItem('appOpenedBefore');
        if (value === 'true') {
          // If the app has been opened before, navigate directly to the Login screen
          navigation.navigate('Login');
        } else {
          // If the app is opened for the first time, navigate to the LanguageSelect screen after 3 seconds
          setTimeout(() => {
            navigation.navigate('LangugeSelect');
          }, 3000);
          // Set the flag indicating that the app has been opened before to true
          await AsyncStorage.setItem('appOpenedBefore', 'true');
        }
      } catch (error) {
        console.error('Error checking if the app has been opened before:', error);
      }
    };

    checkAppOpenedBefore();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/logo/logo-png.png')}
        style={styles.logo}
      />
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
    width: 130,
    height: 180,
    marginBottom: 10,
  },
});

export default SplashScreen;
