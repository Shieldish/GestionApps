import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeTabs from './HomeTabs';
import Profiles from './HomeDrawers/Profiles';
import Settings from './HomeDrawers/Settings';
import About from './HomeDrawers/Abouts'; // Ensure this is the correct import

const Drawer = createDrawerNavigator();

const getInitials = (name) => {
  const initials = name.split(' ').map(part => part[0]).join('');
  return initials.toUpperCase();
};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color;
    do {
      color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      // Ensure the color is not too light
    } while (parseInt(color.slice(1), 16) > 0xAAAAAA);
    return color;
  };

const CustomDrawerContent = (props) => {
  const [userData, setUserData] = useState({ NOM: '', PRENOM : '' ,EMAIL: '' }); // Default values
  const [profileColor, setProfileColor] = useState(getRandomColor());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserData(userData.userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={styles.userInfoSection}>
      <View style={[styles.profilePic, { backgroundColor: profileColor }]}>
          <Text style={styles.initials}>{getInitials(userData.NOM)}{getInitials(userData.PRENOM)}</Text>
        </View>
        <Text style={styles.userName}>{userData.NOM}</Text>
        <Text style={styles.userName}>{userData.PRENOM}</Text>
        <Text style={styles.userEmail}>{userData.EMAIL}</Text>
      </SafeAreaView>
      <DrawerItemList {...props} />
      <View style={styles.bottomDrawerSection}>
     {/*    <DrawerItem
          label="About"
          onPress={() => props.navigation.navigate('About')}
          icon={({ color, size }) => <Icon name="info-circle" color={color} size={size} />}
        /> */}
        <DrawerItem
          label="Déconnexion"
          onPress={props.handleLogoutPress}
          icon={({ color, size }) => <Icon name="sign-out" color={color} size={size} />}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = ({ handleLogoutPress }) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} handleLogoutPress={handleLogoutPress} />}
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        drawerLabelStyle: {
         
          color: '#333',
        },
        drawerIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTabs':
              iconName = 'home';
              break;
            case 'Profiles':
              iconName = 'address-book';
              break;
            case 'Settings':
              iconName = 'gears';
              break;
            case 'About':
              iconName = 'info-circle';
              break;  
            default:
              iconName = 'question';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        drawerActiveTintColor: 'black',
        drawerInactiveTintColor: 'grey',
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 290,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 3,
          elevation: 5,
        }
      })}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{
          drawerLabel: 'Accueille',
          headerTitle: 'Gestion de Stages',
        }}
      />
      <Drawer.Screen
        name="Profiles"
        component={Profiles}
        options={{ drawerLabel: 'Profiles', headerTitle: 'Profiles' }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{ drawerLabel: 'Paramètre', headerTitle: 'Settings' }}
      />
       <Drawer.Screen
        name="About"
        component={About}
        options={{ drawerLabel: 'A propos', headerTitle: 'About' }}
      /> 
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    padding: 20,
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  initials: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  bottomDrawerSection: {
    marginTop: 'auto',
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});

export default DrawerNavigator;
