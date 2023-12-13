import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyRestaurantsScreen from './src/pages/MyRestaurantsScreen/MyRestaurantsScreen';
import MyDishesScreen from './src/pages/MyDishesScreen/MyDishesScreen';
import MyProductsScreen from './src/pages/MyProductsScreen/MyProductsScreen';
import LoginScreen from './src/pages/ProfileScreen/Login';

import AddPage from './src/pages/AddPage/AddPage';
import QRCodeEngin from './src/pages/QRCodeEngin/QRCodeEngin';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyTabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'My Restaurants') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'My Dishes') {
              iconName = focused ? 'pizza' : 'pizza-outline';
            } else if (route.name === 'My Products') {
              iconName = focused ? 'basket' : 'basket-outline';
            } else if (route.name === 'Login') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Scanning') {
              iconName = focused ? 'scan' : 'scan-outline';
            }

            return <Ionicons name={iconName} size={size} color={focused ? '#6d071a' : color} />;
          },
          tabBarActiveTintColor: '#6d071a',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Scanning" component={MyStack} />
        <Tab.Screen name="My Restaurants" component={MyRestaurantsScreen} />
        <Tab.Screen name="My Dishes" component={MyDishesScreen} />
        <Tab.Screen name="My Products" component={MyProductsScreen} />
        <Tab.Screen name="Login" component={LoginScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddPage"
        component={AddPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QRCodeEngin"
        component={QRCodeEngin}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MyTabs;
