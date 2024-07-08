
import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Import your components
import LogoutBottomSheet from './HomeDrawers/Deconnexion';
import Profiles from './HomeDrawers/Profiles';
import Settings from './HomeDrawers/Settings';
import About from './HomeDrawers/Abouts';
import Home from './HomeTabs/Home';
import Stages from './HomeTabs/Stages';
import StagesPostuler from './HomeTabs/StagesPostuler';
import Resultats from './HomeTabs/Resultats';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const { width } = Dimensions.get('window');

const HomeTabs = () => {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      {['Home', 'Stages', 'StagesPostuler', 'Resultats'].map((name, index) => (
        <Tab.Screen 
          key={name}
          name={name} 
          component={
            name === 'Home' ? Home :
            name === 'Stages' ? Stages :
            name === 'StagesPostuler' ? StagesPostuler : Resultats
          }
          options={{ tabBarLabel: name === 'StagesPostuler' ? 'Candidatures' : name }}
          listeners={{
            focus: () => {
              Animated.spring(tabOffsetValue, {
                toValue: index * (width / 4),
                useNativeDriver: true
              }).start();
            }
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const HomePage = () => {
  const logoutBottomSheetRef = useRef(null);

  const handleLogoutPress = useCallback(() => {
    if (logoutBottomSheetRef.current) {
      logoutBottomSheetRef.current.present();
    }
  }, []);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Drawer.Navigator
          screenOptions={({ route }) => ({
            headerShown: true,
            headerStyle: styles.drawerHeader,
            headerTitleStyle: styles.drawerHeaderTitle,
            drawerStyle: styles.drawer,
            drawerLabelStyle: styles.drawerLabel,
            drawerItemStyle: styles.drawerItem,
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
                  iconName = 'sign-out-alt';
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
              headerTitle: 'Home'
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
            component={View}
            options={{ 
              drawerLabel: 'Logout',
              drawerIcon: ({ color, size }) => (
                <Icon name="sign-out-alt" size={size} color={color} />
              ),
            }}
            listeners={{
              focus: handleLogoutPress,
            }}
          />
        </Drawer.Navigator>
        <LogoutBottomSheet ref={logoutBottomSheetRef} />
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 8,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
  },
  drawer: {
    backgroundColor: '#ffffff',
    width: 240,
  },
  drawerHeader: {
    backgroundColor: '#007bff',
  },
  drawerHeaderTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerLabel: {
    fontSize: 16,
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

export default HomePage;