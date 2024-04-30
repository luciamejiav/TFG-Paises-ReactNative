import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Stacks from './Stacks'
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from "../screens/LoginScreen";
import ChatScreen from "../screens/ChatScreen";
import FavoritosScreen from "../screens/FavoritoScreen";

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
        name="Chat" //nombre que aparece debajo de la casita
        component={ChatScreen} //en stack tenemos la home, la homedetails y los settings
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wechat" size={size} color={color} />
          ), headerStyle: {
            height: 100, // Ajusta el tamaño de la barra de navegación
            backgroundColor: '#c263f9', // Color de fondo de la barra de navegación
          }, headerTitleStyle: {
            fontSize: 25, // Tamaño de la fuente del título
          },
          headerShown: true //para que no aparezca el header con el nombre
        }}
      />

      <Tab.Screen
        name="Favoritos" //nombre que aparece debajo de la casita
        component={FavoritosScreen} //en stack tenemos la home, la homedetails y los settings
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" size={size} color={color} />
            
          ), headerStyle: {
            height: 100, // Ajusta el tamaño de la barra de navegación
            backgroundColor: '#c263f9', // Color de fondo de la barra de navegación
          }, headerTitleStyle: {
            fontSize: 25, // Tamaño de la fuente del título
          },
          headerShown: true //para que no aparezca el header con el nombre
        }}
      />

      <Tab.Screen
        name="Ajustes"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ), 
          headerStyle: {
            height: 100, // Ajusta el tamaño de la barra de navegación
            backgroundColor: '#c263f9', // Color de fondo de la barra de navegación
          }, headerTitleStyle: {
            fontSize: 25, // Tamaño de la fuente del título
          },
          headerShown: true //para que no aparezca el header con el nombre
        }}
      />
    </Tab.Navigator>


  );
  /*
    COMO PONEMOS INICIO DE SESION AL ABRIR LA APP NO LO PONEMOS EN LA BARRA DE NAVEGACION    
    
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
   */
}