import { DefaultTheme, NavigationContainer, DarkTheme } from '@react-navigation/native';
import MyTabs from './src/navegation/MyTabs';
import AuthStack from './src/navegation/AuthStack';
import firebase from 'firebase/app'; // Importa Firebase
import 'firebase/auth';
import { firebaseConfig } from './src/config/firebase-config'; // Importa la configuración de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import React, { useState, useEffect } from "react";
import { EventRegister } from 'react-native-event-listeners';
import theme from './src/theme/theme';
import themeContext from './src/theme/themeContext';


export default function App() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [darkMode, setDarkMode] = useState(false) //para controlar el modo oscuro
  const [isLoggedIn, setIsLoggedIn] = useState(false); // para controlar si el usuario está autenticado

  // Efecto para escuchar el cambio de tema y actualizar el estado
  useEffect(() => { 
    // el listener escucha para cambiar el tema
    const listener = EventRegister.addEventListener('ChangeTheme', (data) =>{
      setDarkMode(data)
      console.log(data) // para ver si es true o false, true modo oscuro activo, false desactivado
    })

    // limpia el listener
    return () => {
      EventRegister.removeAllListeners(listener)
    }
  }, [darkMode])

  // Efecto para verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    // Listener para cambios en el usuario autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // Si hay un usuario autenticado, establece isLoggedIn en true
      } else {
        setIsLoggedIn(false); // Si no hay un usuario autenticado, establece isLoggedIn en false
      }
    });

    // Limpia el listener
    return () => unsubscribe();
  }, []);

  return (
    // proporciona el tema actual al resto
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <NavigationContainer 
        theme={darkMode === true ? DarkTheme : DefaultTheme}>
        {isLoggedIn ? <MyTabs /> : <AuthStack />}
      </NavigationContainer>
    </themeContext.Provider>
  );
}
