import React from 'react';
import 'intl-pluralrules'; 
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AppNavigator />
    </I18nextProvider>
  );
};

export default App;
