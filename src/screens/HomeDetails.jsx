import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Toast from 'react-native-easy-toast';
//import { Icon } from 'react-native-elements';
import FontAwesome from "react-native-vector-icons/FontAwesome"; //icono favoritos


import themeContext from "../theme/themeContext";
import firebase from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

//para mostrar los detalles de cada país
export default function HomeDetails({ route }) {

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
  for (const currency in item.currencies) {
    currenciesName.push(`${item.currencies[currency].name} ${item.currencies[currency].symbol}`); //sacamos el nombre de la moneda que se usa en ese país junto al símbolo
  }

  const languagesName = []
  for (const language in item.languages) {
    languagesName.push(`${item.languages[language]}`); //sacamos todos los idiomas que se hablan en un país
  }

  //añadir a favoritos
  const addFavourite = async () => {
    if (!userLogged) {
      toastRef.current.show("Para añadir a favoritos debe estar Logueado", 3000)
      return
    }
    //const currentUser = auth.currentUser; // Obtener el usuario actualmente autenticado
    /*if (!currentUser) {
      toastRef.current.show("Usuario no autenticado", 3000);
      return;
    }*/

    console.log("añadiendo a favoritos");
    const response = await addDoc(favouriteRef, {
      idUser: auth.currentUser.uid,
      idPais: item.cca3
    })
    if (response.statusResponse) {
      setIsFavourite(true)
      toastRef.current.show("Añadido a favoritos", 3000)
    } else {
      toastRef.current.show("No se ha podido añadir a favoritos, intentalo más tarde", 3000)
    }

  }

  const getIsFavourite = async (idPais) => {
    const resultado = { statusResponse: true, error: null, isFavourite: false }
    try {
      /*const response = await db
        .collection("favoritos")
        .where("idPais", "==", idPais)
        .where("idUser", "==", auth.currentUser.uid)
        .get()
      resultado.isFavourite = response.docs.length > 0*/
      const querySnapshot = await getDocs(query
        (collection(db, 'favoritos'), 
          where("idPais", "==", idPais), 
          where("idUser", "==", 
          auth.currentUser.uid)));

    resultado.isFavourite = !querySnapshot.empty;
    } catch (error) {
      resultado.statusResponse = false
      resultado.error = error
      console.log("Error al obtener favoritos: " + error)
    }
    console.log("Resultado" + resultado)
    return resultado
  }

  useEffect(() => {
    (async () => {
      try {
        if (userLogged && item.cca3) {
          const response = await getIsFavourite(item.cca3)
          if (response.statusResponse) {
            response.statusResponse && setIsFavourite(response.isFavourite)
          }
        }
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      }
    })()
  }, [userLogged, item.cca3])

  const removeFavourite = () => {
    //eliminar de favoritos
    console.log("Eliminado de favoritos")
  }

  //con esto mostramos los datos que queremos de la api en la pantalla de details
  //usamos .join('\n') para concatenar con un salto de linea y .join(', ') para separar por coma y espacio
  //además añadimos un link para ir a google maps a ver la ubicación del país
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
          underlayColor="transparent" //color de atrás
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
          {item.continents.join(', ')}
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
          <Text style={styles.boldText}>• Idiomas: </Text>{languagesName.join(', ')}
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