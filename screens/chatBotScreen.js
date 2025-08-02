import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const BACKEND_URL = 'http://192.168.1.10:3000/chat'; // Update with your IP or deployed URL

const ChatBotScreen = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

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
      console.error('Chat error:', error);
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

  // Scroll to bottom when a new message is added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatBox}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {conversation.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  msg.sender === 'You' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={styles.sender}>{msg.sender}:</Text>
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
            {loading && (
              <View style={styles.botBubble}>
                <Text style={styles.sender}>FitnessBot:</Text>
                <ActivityIndicator
                  size="small"
                  color="#333"
                  style={{ marginTop: 5 }}
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask about workouts, diet, or supplements..."
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatBotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  chatBox: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContainer: {
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#e2e3e5',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
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