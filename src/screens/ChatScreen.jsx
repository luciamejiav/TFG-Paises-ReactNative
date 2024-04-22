import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const database = getDatabase();

  useEffect(() => {
    const chatRef = ref(database, 'chat');
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const chatRef = ref(database, 'chat');
      push(chatRef, {
        text: newMessage,
        timestamp: new Date().getTime(),
      });
      setNewMessage('');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text>{`${new Date(item.timestamp).toLocaleString()}: ${item.text}`}</Text>
        )}
        keyExtractor={(item) => item.timestamp.toString()}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10 }}
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}
