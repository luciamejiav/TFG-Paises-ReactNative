# Paises

## Descripcion
Este proyecto ha sido realizado para el proyecto final del Grado Superior en Desarrollo de Aplicaciones Multiplataforma.

La finalidad de este proyecto realizado con React Native es poder descubrir paises, datos relacionados con ellos e incluso su ubicación en GoogleMaps. Además de poder personalizar la aplicación con el modo claro u oscuro.
## Estructura

El proyecto se estructura en las diferentes pantallas que aparecen al iniciar la aplicación. 

La primera pantalla es el `Login/Registro`. Debemos pasar por ella si queremos acceder a la aplicación. Esto hace que, al meter nuestros datos, cada persona tenga su propio espacio para guardar sus paises favoritos. Para almacenar los datos de todos los usuarios usamos Firebase.

La segunda pantalla es la `pantalla principal`. En ella aparece una lista de paises con una barra de búsqueda al principio para que sea mucho más fácil encontrar un pais en concreto.

Al pulsar uno de los card de la segunda pantalla accedemos a la tercera, `pantalla de información`. Aquí vemos todos los detalles del pais como el idioma, la moneda, ..., incluso un enlace que nos lleva a la ubicación del pais en GoogleMaps.

Con el menú inferior podemos acceder al `Chat`. Este sirve para que todos los usuarios se puedan comunicar y ayudar en todo lo posible. En esta pantalla también hay un botón para cerrar sesión en la esquina superior derecha. Para guardar los favoritos de cada persona usamos Firebase.

Si seguimos con el menú la siguiente pantalla es la `pantalla de favoritos`, en la que se van guardando los que marcamos en la segunda pantalla. Solo aparecen los nuestros, para ello iniciamos sesión. Para guardar los favoritos de cada persona usamos Firebase.

Por último, está la `pantalla de ajustes`. En ella encontramos un switch que activa o desactiva el modo oscuro.


## Inicio de la aplicación

Para poder usar la aplicación lo primero es instalar npm.

```bash
  npm install
```

También hay que instalar expo.

```bash
  npm install expo
```

Una vez que hemos instalado todo toca iniciarlo.

```bash
  npm start
```

Cuando lo hayamos iniciado aparecerá un código QR para poder iniciarlo con el móvil. Esto se ejecutará solo si tenemos la aplicación de Expo, en Android escaneamos el código desde la aplicación y en IOS se escanea desde la cámara del móvil que te deriva a la aplicación.

En el caso que queramos iniciarlo mediante un emulador deberemos tenerlo previamente instalado.
