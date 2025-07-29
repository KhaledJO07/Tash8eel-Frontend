import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

const BACKEND_URL = 'http://192.168.1.14:5000/routes/chatBot'; // ← replace with your local or deployed backend

const ChatBotScreen = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: 'You', text: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(BACKEND_URL, { message });

      const botMessage = {
        sender: 'FitnessBot',
        text: response.data.reply || '⚠️ Sorry, something went wrong.',
      };

      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      setConversation(prev => [
        ...prev,
        {
          sender: 'FitnessBot',
          text: '❌ Could not connect to the fitness AI. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.chatBox}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {conversation.map((msg, index) => (
          <Text
            key={index}
            style={[
              styles.message,
              msg.sender === 'You' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.sender}>{msg.sender}:</Text> {msg.text}
          </Text>
        ))}
        {loading && (
          <Text style={styles.botMessage}>
            <Text style={styles.sender}>FitnessBot:</Text> Typing...
          </Text>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about workouts, diet, or supplements..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 50,
  },
  chatBox: {
    flex: 1,
    paddingHorizontal: 15,
  },
  message: {
    fontSize: 16,
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e2e3e5',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 8,
    borderRadius: 8,
  },
});
