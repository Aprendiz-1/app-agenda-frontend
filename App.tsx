import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ThemeProvider} from 'styled-components';
import themes from './src/themes';
import Home from './src/screens/Home';
import ListScreen from './src/screens/ListScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function App(): JSX.Element {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    async function loadStorage() {
      const themeSaved = await AsyncStorage.getItem('@theme');

      if (themeSaved) {
        setIsLight(JSON.parse(themeSaved));
      }

      return;
    }

    loadStorage();
  }, []);

  async function saveStorage(storageTheme: boolean) {
    await AsyncStorage.setItem('@theme', JSON.stringify(storageTheme));
  }

  async function changeTheme() {
    let newTheme = !isLight;

    setIsLight(newTheme);
    saveStorage(newTheme);
  }

  return (
    <ThemeProvider theme={isLight ? themes.light : themes.dark}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home">
            {props => (
              <Home {...props} change={changeTheme} themeSelected={isLight} />
            )}
          </Stack.Screen>

          <Stack.Screen name="ListScreen">
            {props => <ListScreen {...props} themeSelected={isLight} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
