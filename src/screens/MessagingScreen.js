import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MessagingScreen() {
  const [message, setMessage] = useState('');

  const messages = [
    {
      sender: 'Emily Parker',
      time: '3m ago',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      verified: true,
      timestamp: '23:35 left',
    },
    {
      sender: 'Emily Parker',
      text: 'That sunset is amazing! 😊',
      time: '3m ago',
      isOwn: false,
    },
    {
      sender: 'Emily Parker',
      text: 'Tired sky is on fire 🔥',
      time: '3m ago',
      isOwn: false,
    },
  ];

  const emojis = ['👍', '😍', '😊', '😂', '☠️'];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reply Privately</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <View key={index} style={styles.messageWrapper}>
              {msg.image ? (
                <View style={styles.imageMessageContainer}>
                  <View style={styles.messageSender}>
                    <View style={styles.senderAvatar}>
                      <Text style={styles.senderEmoji}>👤</Text>
                    </View>
                    <View>
                      <Text style={styles.senderName}>
                        {msg.sender} {msg.verified && '👍'}
                      </Text>
                      <Text style={styles.messageTime}>{msg.time}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: msg.image }}
                      style={styles.messageImage}
                    />
                    <View style={styles.imageTimestamp}>
                      <Text style={styles.timestampText}>{msg.timestamp}</Text>
                    </View>
                  </View>

                  {/* Emoji Reactions */}
                  <View style={styles.emojiReactions}>
                    {emojis.map((emoji, idx) => (
                      <TouchableOpacity key={idx} style={styles.emojiButton}>
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.emojiButton}>
                      <Ionicons name="checkmark" size={18} color="#999" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={[
                  styles.textMessageContainer,
                  msg.isOwn && styles.ownMessage
                ]}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="play" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="close-circle" size={24} color="#999" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Reply..."
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendEmoji}>💡</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#333333',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerRight: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  messageWrapper: {
    marginBottom: 20,
  },
  imageMessageContainer: {
    width: '100%',
  },
  messageSender: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  senderEmoji: {
    fontSize: 20,
  },
  senderName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  messageImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imageTimestamp: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timestampText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  emojiReactions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  emojiButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  textMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    maxWidth: '75%',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F8F8F8',
    borderColor: '#F0F0F0',
  },
  messageText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  playButton: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  iconButton: {
    padding: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sendEmoji: {
    fontSize: 20,
  },
});
