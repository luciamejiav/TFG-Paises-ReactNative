import {React,  useState } from 'react';
import {Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import {BlurView} from 'expo-blur';

//import necesarios para firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../services/firebase-config';

//importamos lo necesario para la navegación
import {useNavigation} from '@react-navigation/native';
import { onChange } from 'deprecated-react-native-prop-types/DeprecatedTextInputPropTypes';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] =useState('');
  
    //para la navegacion
    const navigation=useNavigation();
  
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
  
    //crear cuenta
    const handleCreateAccount = () => {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => { 
        console.log("Cuenta creada");
        const user = userCredential.user;
        console.log(user)
        Alert.alert("Cuenta creada!")
      })
      .catch(error => {
        console.log(error);
        Alert.alert(error.message)//"Este correo ya está registrado o la contraseña es demasiado ."
      })
    }
  
    //login
    const handleSignIn = () => {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => { 
        console.log("Sign in!");
        const user = userCredential.user;
        console.log(user)
        Alert.alert(`Bienvenido ${email}!`)
      })
      .catch(error => {
        console.log(error);
        Alert.alert(error.message)//"El correo/contraseña son incorrectos o no está registrado."
      })
    }

    return(
      <View style={styles.container}>
        <Image source={require('../img/fondo.jpg')} style={[styles.image, StyleSheet.absoluteFill]} />
        <ScrollView  contentContainerStyle={{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }} >
          <BlurView  intensity={100}>
            <View style={styles.login}>
              <Image source={require('../img/user.png')} style={styles.user} />
              <View>
                <Text style={styles.texto}>Email: </Text>
                <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder='email' />
              </View>
              <View>
                <Text style={styles.texto}>Contraseña: </Text>
                <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder='Contraseña' secureTextEntry={true} />
              </View>
              <TouchableOpacity onPress={handleSignIn} style={[styles.button, backgroundColor='#86b7fe']}>
                <Text style={styles.boton}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
                <Text style={styles.boton}>Registrarse</Text>
              </TouchableOpacity>
  
            </View> 
          </BlurView>
        </ScrollView> 
          
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    login:{
        width:350,
        height:500,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius:10,
        padding:10,
        alignItems:'center'
    },
    user: {
        width: 100,
        height: 100,
        borderRadius: 50,
        //borderColor: '#fff',
        //borderWidth: 1,
        marginVertical: 30
    },
    texto: {
        fontSize: 17,
        fontWeight: '400',
        color: 'white'
    },
    input: {
        width: 250,
        height: 40,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius:10,
        padding:10,
        backgroundColor: '#ffffff90',
        marginBottom: 20
    }, 
    boton: {
        fontSize: 17,
        fontWeight: '400', 
        color: 'white'
    },
    button:{
        width:250,
        height:40,
        borderRadius: 10,
        backgroundColor: '#86b7fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
});

//export default LoginScreen;