import React, {useState, useContext} from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../theme/themeContext";


export default function SettingsScreen() {
    const theme = useContext(themeContext)
    const [darkMode, setDarkMode] = useState(false); //llamamos a la constante que iniciará siempre desactivada
  

    return(
        <View style={[styles.view, {backgroundColor: theme.backgroundColor}]}>
            <Text style={[styles.text, {color: theme.color}]}>Modo Oscuro</Text>
            <Switch //si está ON el modo oscuro se activa y si está OFF, como se iniciará siempre el modo oscuro está desactivado
                value={darkMode} 
                style={styles.swicth}
                onValueChange={(value) => { //cuando cambia el valor del switch
                    setDarkMode(value) //activamos o desactivamos el modo oscuro que hemos llamado anteriormente
                    EventRegister.emit('ChangeTheme', value) // Notificamos a otros componentes sobre el cambio de tema
                }} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        
    },
    text: {
        fontSize: 30,
    },
    swicth: {
        marginTop: 10,
        transform: [{scaleX: 1.5}, {scaleY: 1.5}] //ajustamos el tamaño deseado del switch en ambos ejes
    }
  });