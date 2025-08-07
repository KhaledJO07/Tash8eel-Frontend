import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// --- theme/colors.js ---
// This file defines the color palette based on your reference image.
// You can use this object throughout your app for consistent styling.
const colors = {
  background: '#1a1a2e',
  card: '#2b2b48',
  text: '#ffffff',
  textSecondary: '#a5a5c2',
  highlight: '#5d5fef',
  accent: '#ff8a5d',
};

// NOTE: You will need to create a `config.js` file with this constant.
// For example:
// export const API_BASE_URL_JO = 'http://127.0.0.1:5000';
// import { API_BASE_URL_JO } from '../config';

function ChatBotScreen() {
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
      // NOTE: This assumes you have a config.js with API_BASE_URL_JO
      // const res = await fetch(`${API_BASE_URL_JO}/api/chatbot/chat`, {
      const res = await fetch(`http://127.0.0.1:5000/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setMessages(prev => [
          ...prev,
          { role: 'bot', content: 'Server error or invalid response.' },
        ]);
        setLoading(false);
        return;
      }

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI assistant</Text>
      </View>
      <ScrollView
        style={styles.chatBox}
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContentContainer}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userMsgBubble : styles.botMsgBubble,
            ]}
          >
            <Text
              style={msg.role === 'user' ? styles.userMsgText : styles.botMsgText}
            >
              {msg.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.textSecondary} />
            <Text style={styles.loadingText}>Bot is typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Ask the AI..."
          placeholderTextColor={colors.textSecondary}
          editable={!loading}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!userInput.trim() || loading) && styles.disabledButton]}
          onPress={sendMessage}
          disabled={!userInput.trim() || loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingTop: 50, // This is for iPhone notch spacing
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatBox: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContentContainer: {
    paddingVertical: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%',
    marginBottom: 10,
  },
  userMsgBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.highlight,
  },
  botMsgBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
  },
  userMsgText: {
    color: colors.text,
  },
  botMsgText: {
    color: colors.text,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 8,
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.card,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    color: colors.text,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.highlight,
    borderRadius: 24,
    width: 60,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  sendButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ChatBotScreen />
    </View>
  );
}
