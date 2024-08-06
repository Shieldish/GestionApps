import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFavorites } from '../../Partials/FavoritesContext';

const TabBarIcon = ({ route, color, size }) => {
  const { favoritesCount } = useFavorites();

  let iconName;
  switch (route.name) {
    case 'Home':
      iconName = 'home';
      break;
    case 'Stages':
      iconName = 'briefcase';
      break;
    case 'Favorites':
      iconName = 'heart';
      break;
    case 'StagesPostuler':
      iconName = 'clipboard';
      break;
    case 'Resultats':
      iconName = 'list-alt';
      break;
    default:
      iconName = 'question';
  }

  return (
    <View>
      <Icon name={iconName} size={size} color={color} />
      {route.name === 'Favorites' && favoritesCount > 0 && (
        <View style={{
          position: 'absolute',
          right: -6,
          top: -3,
          backgroundColor: 'red',
          borderRadius: 7,
          width: 14,
          height: 14,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {favoritesCount}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TabBarIcon;