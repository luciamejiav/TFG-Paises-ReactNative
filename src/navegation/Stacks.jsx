import React from 'react';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import HomeDetails from '../screens/HomeDetails';
import SettingsScreen from '../screens/SettingsScreen';

//define un conjunto de pantallas apiladas para cada pestaña de la barra de pestañas

const HomeStackNavigator = createNativeStackNavigator();

export default function StackCharacter() {
    return(
        <HomeStackNavigator.Navigator>
          <HomeStackNavigator.Screen 
            name="Paises"  //titulo cabecera
            component={HomeScreen} //pintamos la homescreen
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              ),headerStyle: {
                height: 100, // Ajusta el tamaño de la barra de navegación
                backgroundColor: '#3498db', // Color de fondo de la barra de navegación
              },headerTitleStyle: {
                fontSize: 25, // Tamaño de la fuente del título
              },
              headerShown: true //para que aparezca el header con el nombre
            }}
          />
          <HomeStackNavigator.Screen
            name="HomeDetails"
            component={HomeDetails}  //para ir de una pantalla a otra
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              ),headerStyle: {
                height: 100, // Ajusta el tamaño de la barra de navegación
                backgroundColor: '#3498db', // Color de fondo de la barra de navegación
              },headerTitleStyle: {
                fontSize: 25, // Tamaño de la fuente del título
              },
              headerShown: true //para que aparezca el header con el nombre
            }}
          />
          <HomeStackNavigator.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              headerBackTitleVisible: false //quita el titulo que aparece al lado de la flecha de volver
            }}
          />
        </HomeStackNavigator.Navigator>
      )
}