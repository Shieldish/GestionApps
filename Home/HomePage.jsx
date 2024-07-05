import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Profiles from './HomeDrawers/Profiles';
import Settings from './HomeDrawers/Settings';
import About from './HomeDrawers/Abouts';
import Logout from './HomeDrawers/Deconnexion';
import Home from './HomeTabs/Home';
import Stages from './HomeTabs/Stages';
import StagesPostuler from './HomeTabs/StagesPostuler';
import Resultats from './HomeTabs/Resultats';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide the header for all tab screens
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Stages':
              iconName = 'briefcase';
              break;
            case 'StagesPostuler':
              iconName = 'clipboard';
              break;
            case 'Resultats':
              iconName = 'check';
              break;
            default:
              iconName = 'question';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
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
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Stages" component={Stages} options={{ tabBarLabel: 'Stages' }} />
      <Tab.Screen name="StagesPostuler" component={StagesPostuler} options={{ tabBarLabel: 'Candidatures' }} />
      <Tab.Screen name="Resultats" component={Resultats} options={{ tabBarLabel: 'Resultats' }} />
    </Tab.Navigator>
  );
};

const HomePage = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // Show the header for drawer screens
        drawerIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTabs':
              iconName = 'home';
              break;
            case 'Profiles':
              iconName = 'user';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
            case 'About':
              iconName = 'info-circle';
              break;
            case 'Logout':
              iconName = 'sign-out';
              break;
            default:
              iconName = 'question';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        drawerActiveTintColor: '#007bff',
        drawerInactiveTintColor: 'gray',
      })}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ 
          drawerLabel: 'Home',
          headerTitle: 'Home' // Set the header title for the HomeTabs screen
        }}
      />
      <Drawer.Screen
        name="Profiles"
        component={Profiles}
        options={{ drawerLabel: 'My Profiles' }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{ drawerLabel: 'Settings' }}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{ drawerLabel: 'About' }}
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{ drawerLabel: 'Logout' }}
      />
    </Drawer.Navigator>
  );
};

export default HomePage;
