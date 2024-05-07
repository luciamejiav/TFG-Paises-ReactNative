import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';
import themeContext from "../theme/themeContext";

import { useNavigation } from "@react-navigation/native";
import Card from '../components/Card';
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
        //SI PONGO CARD DA ERROR PNG Y TODO LO RELACIONADO CON LOS DATOS DE LA API 
        //<Card key={item.id} item={item} /> o <Text style={[styles.text, { color: theme.color }]}>{item.idPais}</Text>
        <FlatList
            data={favoritos}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.cards}
                    onPress={() => navigation.navigate('FavDetails', { item: item })}
                >
                    <Text style={[styles.text, { color: theme.color }]}>{item.idPais}</Text>
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
    cards: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#c263f9',
        borderRadius: 10,
    },
    text: {
        fontWeight: "bold",
        fontSize: 18,
        margin: 8
    },
});

export default FavoritoScreen;