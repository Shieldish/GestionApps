// AuthenticatedStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './Home/components/HomeDrawers';
import Postulation from './Partials/Postulation';
import ApplicationForm from './Partials/ApplicationForm';
import StagesPostuler from './Home/HomeTabs/Candidatures';
import Resultats from './Home/HomeTabs/Resultats';
import MoreDetails from './Partials/MoreDetails';
import Favorites from './Home/HomeTabs/Favorites';

const Stack = createStackNavigator();

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="Postulation" component={Postulation} options={{ headerShown: true, title: 'Postulation', headerTitleAlign: 'center' }} />
      <Stack.Screen name="ApplicationForm" component={ApplicationForm} options={{ title: 'Formulaire de Candidature', headerTitleAlign: 'center' }} />
      <Stack.Screen name="StagesPostuler" component={StagesPostuler} options={{ title: 'Stages Postuler' }} />
      <Stack.Screen name="MoreDetails" component={MoreDetails} options={{ headerShown: true, title: 'Candidature', headerTitleAlign: 'center' }} />
      <Stack.Screen name="Favorites" component={Favorites} options={{ title: 'Favoris' }} />
      <Stack.Screen name="Resultats" component={Resultats} options={{ title: 'Resultats' }} />
    </Stack.Navigator>
  );
};

export default AuthenticatedStack;