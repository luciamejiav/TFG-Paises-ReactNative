import React, {useState, useEffect, useLayoutEffect, useCallback, useContext} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {collection, addDoc, orderBy, query, onSnapshot, getFirestore} from 'firebase/firestore';

import { firebaseConfig } from '../config/firebase-config';
import { getAuth, signOut} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

import themeContext from "../theme/themeContext";


export default function Chat() {

  const [messages, setMessages] = useState([]); //almacenar mensajes
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getFirestore(app);

const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  //aunque hagamos logout el chat se guarda
  useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{
              marginRight: 10,
              backgroundColor: theme.backgroundColor
            }}
            onPress={onSignOut}
          >
            <AntDesign name="logout" size={24} style={{marginRight: 10}}/> 
          </TouchableOpacity>
        )
      });
    }, [navigation]);

  useLayoutEffect(() => {

      const collectionRef = collection(database, 'chats');
      const q = query(collectionRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, querySnapshot => {
      console.log('querySnapshot unsusbscribe');
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user
          }))
        );
      });
  return unsubscribe;
    }, []);

  const onSend = useCallback((messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages)
      );
      const { _id, createdAt, text, user } = messages[0];    
      addDoc(collection(database, 'chats'), {
        _id,
        createdAt,
        text,
        user
      });
    }, []);

    return (
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff',
          backgroundColor: theme.backgroundColor
        }}
        textInputStyle={{
          backgroundColor: '#fff',
          borderRadius: 20
        }}
        user={{
          _id: auth?.currentUser?.email,
          avatar: 'https://i.pravatar.cc/300' //generamos la foto de los avatares de forma aleatoria
        }}
      />
    );
}