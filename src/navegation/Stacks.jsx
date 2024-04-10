import React, {useContext} from 'react';

import HomeScreen from '../screens/HomeScreen';
import HomeDetails from '../screens/HomeDetails';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import themeContext from "../theme/themeContext";

import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


//define un conjunto de pantallas apiladas para cada pestaña de la barra de pestañas
const HomeStackNavigator = createNativeStackNavigator();

export default function Stacks() {
  const theme = useContext(themeContext);  
  const navigation = useNavigation(); //navegación de la flecha

    return(
        <HomeStackNavigator.Navigator >
          <HomeStackNavigator.Screen 
            name="Paises"  //titulo cabecera
            component={HomeScreen} //pintamos la homescreen
            options={{
              headerStyle: {
                height: 100, // Ajusta el tamaño de la barra de navegación
                backgroundColor: '#c263f9', // Color de fondo de la barra de navegación
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
              headerTitle: () => false,
              headerStyle: {
                height: 100, // Ajusta el tamaño de la barra de navegación
                backgroundColor: '#c263f9', // Color de fondo de la barra de navegación
              },headerTitleStyle: {
                fontSize: 25, // Tamaño de la fuente del título
              },
              headerBackTitleVisible: false, // Quita el título que aparece al lado de la flecha de volver
              headerShown: true, //para que aparezca el header con el nombre
              headerBackVisible: false, //eliminamos la flecha que viene por defecto para poder personalizar el color
              headerLeft: () => ( // para que la flecha cambie de color según el tema (oscuro/claro), hacemos lo siguiente
                <MaterialCommunityIcons 
                  name="arrow-left" 
                  size={24} 
                  color={theme.color} // Utiliza el color del tema para la flecha de retroceso
                  onPress={() => navigation.goBack(HomeScreen)} //al pulsar volvemos a la home
                  style={{ marginLeft: 10, marginRight: 66 }} 
                />
              ),
            }}
          />
          <HomeStackNavigator.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cog" size={size} color={color} /> //cog es el iconos de settings
              ),headerStyle: {
                height: 80, // Ajusta el tamaño de la barra de navegación
                backgroundColor: '#c263f9', // Color de fondo de la barra de navegación
              },headerTitleStyle: {
                fontSize: 25, // Tamaño de la fuente del título
              },
              headerShown: true //para que aparezca el header con el nombre
            }}
          />
          <HomeStackNavigator.Screen
            name="Login"
            component={LoginScreen}  //para ir de una pantalla a otra
          />
        </HomeStackNavigator.Navigator>
      )
}