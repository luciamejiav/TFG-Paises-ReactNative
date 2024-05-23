import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';
import themeContext from "../theme/themeContext";

import { useNavigation } from "@react-navigation/native";
import { getPaisesAll } from '../services/PaisesAPI';


const FavoritoScreen = () => {

    // Inicializar la app de Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    //Tema
    const theme = useContext(themeContext);
    //Navegación
    const navigation = useNavigation();

    const [favoritos, setFavoritos] = useState([]);
    const [paises, setPaises] = useState([]);
    const [currentPais, setCurrentPais] = useState(1);
    const [totalPais, setTotalPais] = useState(0);

    const obtenerFavoritos = async () => {
        try {
            const favoritosSnapshot = await getDocs(
                query(
                    collection(db, 'favoritos'),
                    where("idUser", "==", auth.currentUser.uid)
                )
            );
            const favoritosData = favoritosSnapshot.docs.map(doc => doc.data());
            setFavoritos(favoritosData);
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
        }
    };
    //efecto para obtener la lista de los paises favoritos
    useEffect(() => {
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

    useEffect(() => {
        getPaises();
    }, [favoritos]);

    return (
        <FlatList
            data={favoritos}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('FavDetails', { item: item })}
                >
                    <View style={styles.row}>
                        <Image source={{ uri: item.datos.flags.png }} style={[styles.image, { backgroundColor: theme.backgroundColor }]} resizeMode="contain" />
                        <View style={styles.column}>
                            <Text style={[styles.text, { color: theme.color }]}>{item.datos.name.common}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
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
    text: {
        fontWeight: "bold",
        fontSize: 18,
        margin: 8
    }, image: {
        width: 80,
        height: 80,
        marginLeft: 10
    },
    row: {
        flex: 1,
        flexDirection: "row", padding: 5,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#c263f9',
        borderRadius: 10,

    },
    column: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    text: {
        fontWeight: "bold",
        fontSize: 18,
        marginVertical: 27,
        marginLeft: 20
    }
});

export default FavoritoScreen;