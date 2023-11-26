import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Perform your login logic here
    setIsLoggedIn(true);
    // Navigate to the desired screen after login
    navigation.navigate('MyRestaurants');
  };

  const handleLogout = () => {
    // Perform your logout logic here
    setIsLoggedIn(false);
    // Navigate to the login screen after logout
    navigation.navigate('Login');
  };

  return (
    <View>
      {isLoggedIn ? (
        <View>
          <Text>User is logged in!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View>
          <Text>Login Screen</Text>
          <Button title="Login" onPress={handleLogin} />
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
