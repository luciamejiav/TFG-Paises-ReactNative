import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Toast from 'react-native-easy-toast';

import themeContext from "../theme/themeContext";
import firebase from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

//para mostrar los detalles de cada país
export default function FavDetails({ route }) {

    const theme = useContext(themeContext);

    const { item } = route.params; //parámetros de la ruta
    const [paises, setPaises] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false); //lo iniciamos como no favorito
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const favouriteRef = collection(db, 'favoritos'); // Referencia a la colección 'favourites'

    auth.onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)//comprobar si el usuario esta logueado
    })

    //si no hay datos muestra un mensaje de cargando 
    if (!item) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    // bucles para que salga todo lo que tienen dentro currencies y languages
    //push agrega elementos al final del array (en este caso de currenciesName o languagesName)
    const currenciesName = []
    for (const currency in item.datos.currencies) {
        currenciesName.push(`${item.datos.currencies[currency].name} ${item.datos.currencies[currency].symbol}`); //sacamos el nombre de la moneda que se usa en ese país junto al símbolo
    }

    const languagesName = Array.isArray(item.datos.languages) ? item.datos.languages : Object.values(item.datos.languages);

    for (const language in item.datos.languages) {
        languagesName.push(`${item.datos.languages[language]}`); //sacamos todos los idiomas que se hablan en un país
    }

    //con esto mostramos los datos que queremos de la api en la pantalla de details
    //usamos .join('\n') para concatenar con un salto de linea y .join(', ') para separar por coma y espacio
    //además añadimos un link para ir a google maps a ver la ubicación del país
    return (
        <ScrollView>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.datos.flags.png }} style={styles.image} resizeMode="contain" />

            </View>

            <Text style={[styles.textCommon, { color: theme.color }]}>{item.datos.name.common}</Text>

            <View style={styles.column}>
                <Text style={[styles.textOfficial, { color: theme.color }]}>{item.datos.name.official}</Text>

                <Text style={[styles.text, { color: theme.color }]}>
                    <Text style={styles.boldText}>• Capital: </Text>
                    {item.datos.capital}
                </Text>

                <Text style={[styles.text, { color: theme.color }]}>
                    <Text style={styles.boldText}>• Continente: </Text>
                    {item.datos.continents ? item.datos.continents.join(', ') : ''}
                </Text>

                <Text style={[styles.text, { color: theme.color }]}>
                    <Text style={styles.boldText}>• Población: </Text>
                    {item.datos.population} habitantes
                </Text>

                <Text style={[styles.text, { color: theme.color }]}>
                    <Text style={styles.boldText}>• Moneda usada: </Text>
                    {currenciesName.join('\n')}
                </Text>

                <Text style={[styles.text, { color: theme.color }]}>
                    <Text style={styles.boldText}>• Idiomas: </Text>
                    {languagesName.join(', ')}
                </Text>

                <Text style={[styles.text, { color: theme.color }]}>
                    <Text style={styles.boldText}>• Área: </Text>
                    {item.datos.area} km cuadrados
                </Text>

                <Text style={[styles.text, { color: theme.color }]}>
                    <Text style={styles.boldText}>• GoogleMaps: </Text>

                </Text>

                <TouchableOpacity onPress={() => Linking.openURL(`${item.datos.maps.googleMaps}`)}>
                    <Text style={[styles.text, styles.boldText, styles.ml, { color: '#3498db' }]}>Ir a la dirección en google maps</Text>
                </TouchableOpacity>

            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 360,
        height: 250
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
    column: {
        flex: 1,
        flexDirection: "column",
        marginLeft: 20
    },
    text: {
        fontSize: 19,
        marginBottom: 8,
    },
    textCommon: {
        fontWeight: "bold",
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 15
    },
    textOfficial: {
        fontWeight: "bold",
        fontSize: 22,
        marginBottom: 10
    },
    boldText: {
        fontWeight: "bold",
    },
    ml: {
        marginLeft: 14
    }
});