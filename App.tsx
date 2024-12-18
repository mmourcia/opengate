/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { databaseService } from './src/services/database';
import { View, ActivityIndicator } from 'react-native';

function App(): React.JSX.Element {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initDb();
  }, []);

  const initDb = async () => {
    try {
      await databaseService.initDatabase();
      setIsDbReady(true);
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  };

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default App;
