import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';
import themeContext from "../theme/themeContext";

import { useNavigation } from "@react-navigation/native";


// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



export default function FavoritosScreen() {
    const theme = useContext(themeContext);
    const [favoritos, setFavoritos] = useState([]);
    const navigation = useNavigation();

    const [paises, setPaises] = useState([]);
    const [currentPais, setCurrentPais] = useState(1);
    const [totalPais, setTotalPais] = useState(0);

    useEffect(() => {
        const obtenerFavoritos = async () => {
            try {
                const favoritosSnapshot = await getDocs(
                    query(
                        collection(db, 'favoritos'),
                        where("idUser", "==", auth.currentUser.uid) // Suponiendo que tengas una variable auth que almacena el usuario actual
                    )
                );
                const favoritosData = favoritosSnapshot.docs.map(doc => doc.data());
                setFavoritos(favoritosData);
            } catch (error) {
                console.error("Error al obtener favoritos:", error);
            }
        };

        obtenerFavoritos();
    }, []);

    //función para obtener la lista de paises
    const getPaises = () => {
        getPaisesAll()
            .then(json => {
                // Filtrar los nuevos países para asegurarse de que no haya duplicados
                const nuevosPaises = json.filter(newPais => !paises.some(pais => pais.id === newPais.id));

                setPaises(prevPaises => [...prevPaises, ...nuevosPaises]);
                setTotalPais(json.info.count);
            })
            .catch(err => console.log("error", err));
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('HomeDetails', { item: item })}>
            <Text style={[styles.text, { color: theme.color }]}>{item.idPais}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.color }]}>Esta es tu página de favoritos</Text>
            <FlatList
                data={favoritos}
                renderItem={renderItem}
                keyExtractor={(item) => item.idPais}
                onEndReachedThreshold={0}
                onEndReached={() => {
                    //comprueba si hay más paises para cargar   
                    if (currentPais < totalPais) {
                        // Llama a la función getPaises para cargar más países
                        getPaises(currentPais + 1);
                        // Actualiza el estado de currentPais para reflejar el cambio en la página actual
                        setCurrentPais(currentPais + 1);
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#f9c2ff',
        borderRadius: 10,
    },
    text: {
        fontWeight: "bold",
        fontSize: 18,
        margin: 8
    },
});
