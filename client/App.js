// App.js

// Import the polyfill at the beginning of the file
import 'intl-pluralrules'; // Add this line

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n'; // Import the i18n instance
import MainNavigator from './navigation/mainNavigation';

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <MainNavigator />
    </I18nextProvider>
  );
};

export default App;
