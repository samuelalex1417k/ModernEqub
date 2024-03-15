import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const [languageSelected, setLanguageSelected] = useState(false);

  useEffect(() => {
    checkLanguageSelection();
  }, []);

  const checkLanguageSelection = async () => {
    // Check if language selection has already been made
    const language = await AsyncStorage.getItem('language');
    if (language) {
      navigation.navigate('Onboarding');
    } else {
      setLanguageSelected(true);
    }
  };

  const handleLanguageSelection = async (language) => {
    // Save selected language to AsyncStorage
    await AsyncStorage.setItem('language', language);
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      {languageSelected && (
        <View>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageSelection('amharic')}>
            <Text style={styles.languageText}>አማርኛ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageSelection('english')}>
            <Text style={styles.languageText}>English</Text>
          </TouchableOpacity>
        </View>
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
  languageButton: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
  languageText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LanguageSelectionScreen;
