import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { getPaisesAll } from '../services/PaisesAPI';
import Card from '../components/Card';
import { useNavigation } from "@react-navigation/native";
import themeContext from "../theme/themeContext";

const HomeScreen = () => {
  //estados para gestionar lo necesario
  const [paises, setPaises] = useState([]);
  const [currentPais, setCurrentPais] = useState(1);
  const [totalPais, setTotalPais] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useContext(themeContext); //tema para cambiar de claro a oscuro y viceversa
  const navigation = useNavigation(); //navegación

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

  //manejador de cambios en la búsqueda
  const handleSearchTermChange = (text) => {
    setSearchTerm(text);
  };

  //efecto para obtener la lista de paises
  useEffect(() => {
    getPaises();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.searchContainer}> 
        <Image  //hacemos un contenedor para hacer la búsqueda, dentro colocamos la lupa para que se identifique mejor
          source={require('../img/lupa.png')}
          style={styles.searchIcon}
        />
        <TextInput //y hacemos una caja de búsqueda para los paises
          style={styles.searchInput}
          placeholder="Buscar por nombre de país"
          value={searchTerm}
          onChangeText={handleSearchTermChange}
        />
      </View>
     
      <FlatList //con la flatlist hacemos una lista con todos los países y dibujamos en ella los card
        style={styles.list}
        data={paises.filter((pais) =>
          pais.name.common.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        renderItem={({ item }) => (
          <TouchableOpacity //cuando pulsemos se hará un poco opaco
            onPress={() => navigation.navigate('HomeDetails', { item: item })} //si pulsamos en cualquier país iremos a la segunda pantalla en la que aparecen los datos de dicho país
          >
            <Card key={item.id} item={item} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    width: "100%",
    padding: 10,
    marginTop: 10
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor:"white",
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80
  },
  row: {
    flex: 1,
    flexDirection: "row",
    margin: 10
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  text: {
    fontSize: 18
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 5,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#b2e2f2',
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 10, 
    marginLeft: 10,
  }
});

export default HomeScreen;