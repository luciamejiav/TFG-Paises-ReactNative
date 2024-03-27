import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SettingsScreen from '../screens/SettingsScreen';
import Stacks from './Stacks'

//establece la estructura general de la aplicación con una barra de pestañas en la parte inferior

const Tab = createBottomTabNavigator();
//menú de navegación abajo
export default function Navigation() {
      
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3498db',//con esto ponemos el icono de abajo que hayamos clicado en azul e iniciamos siempre la app en home
          
        }}
      >
        <Tab.Screen
          name="home"
          component={Stacks} //en stack tenemos la home, la homedetails y los settings
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
            headerShown: false //para que no aparezca el header con el nombre
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} /> //cog es el iconos de settings
            ),headerStyle: {
              height: 80, // Ajusta el tamaño de la barra de navegación
              backgroundColor: '#3498db', // Color de fondo de la barra de navegación
            },headerTitleStyle: {
              fontSize: 25, // Tamaño de la fuente del título
            },
            headerShown: true //para que aparezca el header con el nombre
          }} />
      </Tab.Navigator>
  );
}