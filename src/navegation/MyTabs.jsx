import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SettingsScreen from '../screens/SettingsScreen';
import Stacks from './Stacks'
import LoginScreen from "../screens/LoginScreen";

//establece la estructura general de la aplicación con una barra de pestañas en la parte inferior
const Tab = createBottomTabNavigator();

//menú de navegación abajo
export default function Navigation() {
      
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#c263f9',//con esto ponemos el icono de abajo que hayamos clicado en azul e iniciamos siempre la app en home
          
        }}
      >
        <Tab.Screen
          name="Pais" //nombre que aparece debajo de la casita
          component={Stacks} //en stack tenemos la home, la homedetails y los settings
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="airplane" size={size} color={color} />
            ),
            headerShown: false //para que no aparezca el header con el nombre
          }}
        />

        <Tab.Screen
          name="Usuario" //nombre que aparece debajo de la casita
          component={LoginScreen} //en stack tenemos la home, la homedetails y los settings
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle" size={size} color={color} />
            ),
            headerShown: false //para que no aparezca el header con el nombre
          }}
        />

        <Tab.Screen
          name="Ajustes"
          component={SettingsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            ),
            headerShown: false //para que no aparezca el header con el nombre
          }} 
        />
      </Tab.Navigator>

      
  );
  /*
  
        <Tab.Screen
          name="Usuario" //nombre que aparece debajo de la casita
          component={Stacks} //en stack tenemos la home, la homedetails y los settings
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle" size={size} color={color} />
            ),
            headerShown: false //para que no aparezca el header con el nombre
          }}
        />
  */
}