import React, {useContext} from 'react'
import { StyleSheet, View, Image, Text } from 'react-native'
import themeContext from '../theme/themeContext';

export default function Card({ item }) {
  const theme = useContext(themeContext)
  //hacemos un card con lo que aparecerá en cada una, en nuestro caso la bandera y el nombre común de cada país
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.flags.png }} style={[styles.image, {backgroundColor: theme.backgroundColor}]} resizeMode="contain" />
      <View style={styles.column}>
        <Text style={[styles.text, {color: theme.color}]}>{item.name.common}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    marginLeft:10
  },
  row: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
    borderRadius: 10,
    borderColor: '#c263f9',
    borderWidth: 3,
    padding: 5,

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