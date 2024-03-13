import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(); // Use useTranslation hook to access translations
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  const handleDone = () => {
    AsyncStorage.setItem('alreadyLaunched', 'true');
    navigation.navigate('Login');
  };

  const handleSkip = () => {
    AsyncStorage.setItem('alreadyLaunched', 'true');
    navigation.navigate('Login');
  };

  if (isFirstLaunch === null) {
    return null; // Render nothing until the AsyncStorage check is completed
  }

  if (isFirstLaunch === false) {
    return null; // Render nothing if the app has already been launched
  }

  const NextButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={[styles.button ]} {...props}>
        <Text style={styles.buttonText}>{t('onboarding.next')}</Text>
      </TouchableOpacity>
    );
  };

  const SkipButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={[styles.button]} {...props}>
        <Text style={styles.buttonText}>{t('onboarding.skip')}</Text>
      </TouchableOpacity>
    );
  };

  const DoneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={[styles.button]} {...props}>
        <Text style={styles.buttonText}>{t('onboarding.done')}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleSkip}
        NextButtonComponent={NextButton}
        SkipButtonComponent={SkipButton}
        DoneButtonComponent={DoneButton}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <LottieView
                style={styles.lottie}
                source={require('../assets/animations/DE.json')}
                autoPlay
                loop
              />
            ),
            title: t('onboarding.page1.title1'),
            subtitle: t('onboarding.page1.subtitle1'),
            titleStyles: {color: '#186A65',fontWeight: 'bold'},
            subTitleStyles: {color: '#186A65',},
          },
          {
            backgroundColor: '#fff',
            image: (
              <LottieView
                style={styles.lottie}
                source={require('../assets/animations/JU.json')}
                autoPlay
                loop
              />
            ),
            title: t('onboarding.page2.title2'),
            subtitle: t('onboarding.page2.subtitle2'),
            titleStyles: {color: '#186A65',fontWeight: 'bold'},
            subTitleStyles: {color: '#186A65',},
          },
          {
            backgroundColor: '#fff',
            image: (
              <LottieView
                style={styles.lottie}
                source={require('../assets/animations/VC.json')}
                autoPlay
                loop
              />
            ),
            title: t('onboarding.page3.title3'),
            subtitle: t('onboarding.page3.subtitle3'),
            titleStyles: {color: '#186A65',fontWeight: 'bold'},
            subTitleStyles: {color: '#186A65',},
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  lottie: {
    width: 300,
    height: 400,
  },
  button: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    margin:5
  },
  buttonText: {
    color: '#186A65',
    fontSize: 16,
  },
});

export default OnboardingScreen;
