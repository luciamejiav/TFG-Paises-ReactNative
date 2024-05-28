import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView, ActivityIndicator } from 'react-native';
import Toast from 'react-native-easy-toast';
import FontAwesome from "react-native-vector-icons/FontAwesome"; //icono favoritos
import themeContext from "../theme/themeContext";
import { firebaseConfig } from '../config/firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getFirestore, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//para mostrar los detalles de cada país
export default function HomeDetails({ route }) {
  const theme = useContext(themeContext);
  const { item } = route.params; //parámetros de la ruta
  const [isFavourite, setIsFavourite] = useState(false); //lo iniciamos como no favorito
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const toastRef = useRef();

  const favouriteRef = collection(db, 'favoritos'); // Referencia a la colección 'favoritos'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserLogged(true);
      } else {
        setUserLogged(false);
        setIsFavourite(false); // Reset favorite state if user logs out
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkFavouriteStatus = async () => {
      if (userLogged && item.cca3) {
        const response = await getIsFavourite(item.cca3);
        if (response.statusResponse) {
          setIsFavourite(response.isFavourite);
        }
        setLoading(false); // Set loading to false after checking favorite status
      } else {
        setLoading(false); // Set loading to false if not logged in
      }
    };

    checkFavouriteStatus();
  }, [userLogged, item.cca3]);

  //añadir a favoritos
  const addFavourite = async () => {
    if (!userLogged) {
      toastRef.current.show("Para añadir a favoritos debe estar Logueado", 3000);
      return;
    }

    try {
      console.log("añadiendo a favoritos");
      await addDoc(favouriteRef, {
        idUser: auth.currentUser.uid,
        idPais: item.cca3,
        datos: item
      });
      setIsFavourite(true);
      toastRef.current.show("Añadido a favoritos", 3000);
    } catch (error) {
      console.error("Error al añadir a favoritos:", error);
      toastRef.current.show("No se ha podido añadir a favoritos, intentalo más tarde", 3000);
    }
  };

  //eliminar de favoritos
  const removeFavourite = async () => {
    if (!userLogged) {
      toastRef.current.show("Para eliminar de favoritos debe estar Logueado", 3000);
      return;
    }

    try {
      console.log("eliminando de favoritos");
      const response = await eliminarFavorito(item.cca3);
      if (response.statusResponse) {
        setIsFavourite(false);
        toastRef.current.show("Eliminado de favoritos", 3000);
      } else {
        toastRef.current.show("No se ha podido eliminar de favoritos, intentalo más tarde", 3000);
      }
    } catch (error) {
      console.error("Error al eliminar favoritos:", error);
    }
  };

  //Accion eliminar 
  const eliminarFavorito = async (idPais) => {
    const resultado = { statusResponse: true, error: null };
    try {
      const querySnapshot = await getDocs(query(
        favouriteRef,
        where("idPais", "==", idPais),
        where("idUser", "==", auth.currentUser.uid)
      ));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      resultado.statusResponse = false;
      resultado.error = error;
      console.log("Error al eliminar favoritos: " + error);
    }
    return resultado;
  };

  const getIsFavourite = async (idPais) => {
    const resultado = { statusResponse: true, error: null, isFavourite: false };
    try {
      const querySnapshot = await getDocs(query(
        favouriteRef,
        where("idPais", "==", idPais),
        where("idUser", "==", auth.currentUser.uid)
      ));
      resultado.isFavourite = !querySnapshot.empty;
    } catch (error) {
      resultado.statusResponse = false;
      resultado.error = error;
      console.log("Error al obtener favoritos: " + error);
    }
    return resultado;
  };

  //si no hay datos muestra un mensaje de cargando 
  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // bucles para que salga todo lo que tienen dentro currencies y languages
  const currenciesName = [];
  for (const currency in item.currencies) {
    currenciesName.push(`${item.currencies[currency].name} ${item.currencies[currency].symbol}`);
  }

  const languagesName = [];
  for (const language in item.languages) {
    languagesName.push(`${item.languages[language]}`);
  }

  // Mostrar los datos
  return (
    <ScrollView>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.flags.png }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.fav}>
        <FontAwesome
          type="material-community"
          name={isFavourite ? "heart" : "heart-o"}
          onPress={isFavourite ? removeFavourite : addFavourite}
          size={34}
          color="#000000"
          underlayColor="transparent"
        />
      </View>
      <Text style={[styles.textCommon, { color: theme.color }]}>{item.name.common}</Text>
      <View style={styles.column}>
        <Text style={[styles.textOfficial, { color: theme.color }]}>{item.name.official}</Text>
        <Text style={[styles.text, { color: theme.color }]}>
          <Text style={styles.boldText}>• Capital: </Text>
          {item.capital}
        </Text>
        <Text style={[styles.text, { color: theme.color }]}>
          <Text style={styles.boldText}>• Continente: </Text>
          {item.continents ? item.continents.join(', ') : ''}
        </Text>
        <Text style={[styles.text, { color: theme.color }]}>
          <Text style={styles.boldText}>• Población: </Text>
          {item.population} habitantes
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
          {item.area} km cuadrados
        </Text>
        <Text style={[styles.text, { color: theme.color }]}>
          <Text style={styles.boldText}>• GoogleMaps: </Text>
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(`${item.maps.googleMaps}`)}>
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
  },
  fav: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: "#FAF2FC",
    borderBottomLeftRadius: 20,
    padding: 5,
    paddingLeft: 15
  }
});
