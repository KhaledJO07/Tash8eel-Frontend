import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { API_BASE_URL_JO } from '../config';

export default function ChatBotScreen() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const userMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL_JO}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setMessages(prev => [
          ...prev,
          { role: 'bot', content: 'Server error or invalid response.' },
        ]);
        setLoading(false);
        return;
      }

      // Handle Hugging Face response format
      let botReply = '';
      if (Array.isArray(data.reply)) {
        botReply = data.reply[0]?.generated_text || 'No response.';
      } else if (typeof data.reply === 'string') {
        botReply = data.reply;
      } else {
        botReply = 'Unexpected response format.';
      }

      setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
    } catch (err) {
      console.log('Error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Error talking to bot.' },
      ]);
    }
    setLoading(false);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatBox}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <Text
            key={index}
            style={msg.role === 'user' ? styles.userMsg : styles.botMsg}
          >
            {msg.content}
          </Text>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#888" />
            <Text style={styles.loadingText}>Bot is typing...</Text>
          </View>
        )}
      </ScrollView>

      <TextInput
        style={styles.input}
        value={userInput}
        onChangeText={setUserInput}
        placeholder="Ask the AI..."
        editable={!loading}
      />
      <Button title="Send" onPress={sendMessage} disabled={!userInput.trim() || loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  chatBox: { flex: 1, marginBottom: 10 },
  userMsg: { textAlign: 'right', color: 'blue', marginBottom: 4 },
  botMsg: { textAlign: 'left', color: 'green', marginBottom: 4 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  loadingText: { marginLeft: 8, color: '#888' },
});