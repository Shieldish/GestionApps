import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './HomeScreen';
import Stages from './HomeTabs/Stages';
import StagesPostuler from './HomeTabs/Candidatures';
import Resultats from './HomeTabs/Resultats';
import Favorites from './HomeTabs/Favorites';
import TabBarIcon from './TabBarIcon';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => (
          <TabBarIcon route={route} color={color} size={size} />
        ),
   /*      tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'grey', */
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'silver',
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          borderTopColor: '#ccc',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home', headerTitle: 'Home' }} />
      <Tab.Screen name="Stages" component={Stages} options={{ tabBarLabel: 'Stages', headerTitle: 'Stages' }} />
      <Tab.Screen name="Favorites" component={Favorites} options={{ tabBarLabel: 'Favoris', headerTitle: 'Favorites' }} />
      <Tab.Screen name="StagesPostuler" component={StagesPostuler} options={{ tabBarLabel: 'Candidatures', headerTitle: 'Stages Postuler' }} />
      <Tab.Screen name="Resultats" component={Resultats} options={{ tabBarLabel: 'Resultats', headerTitle: 'Resultats' }} />
    </Tab.Navigator>
  );
};

export default HomeTabs;