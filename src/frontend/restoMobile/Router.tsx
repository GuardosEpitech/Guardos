import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddPage from "./src/pages/AddPage/AddPage";
import QRCodeEngin from "./src/pages/QRCodeEngin/QRCodeEngin";


const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

export default MyStack;
