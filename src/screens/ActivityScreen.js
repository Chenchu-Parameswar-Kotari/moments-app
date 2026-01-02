import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityScreen() {
  const notifications = [
    {
      name: 'Sarah Pearson',
      message: null,
      time: '25 juist 1',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      emoji: '😊',
      type: 'post',
    },
    {
      name: 'Lustin',
      message: 'How nice it/feels',
      time: '2h ago',
      emoji: '🔥',
      type: 'comment',
    },
    {
      name: 'Omg the beach looks amazing!',
      message: 'Omg the beach looks amazing! 🌴',
      time: '2h ago',
      type: 'comment',
    },
    {
      name: 'Take me with you next time!',
      message: 'Take me with you next time! 🌴',
      time: '1h ago',
      type: 'comment',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Text style={styles.headerEmoji}>😊</Text>
          <Text style={styles.headerTitle}>moments</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {notifications.map((notification, index) => (
          <View key={index} style={styles.notificationItem}>
            <View style={styles.leftSection}>
              {notification.image ? (
                <Image
                  source={{ uri: notification.image }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>👤</Text>
                </View>
              )}
              
              <View style={styles.contentSection}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{notification.name}</Text>
                  {notification.time && (
                    <Text style={styles.time}>{notification.time}</Text>
                  )}
                </View>
                {notification.message && (
                  <Text style={styles.message}>{notification.message}</Text>
                )}
              </View>
            </View>

            {notification.type === 'post' && notification.image && (
              <View style={styles.postPreview}>
                <Image
                  source={{ uri: notification.image }}
                  style={styles.postImage}
                />
                <View style={styles.timeStamp}>
                  <Text style={styles.timeStampText}>23:35 left</Text>
                </View>
              </View>
            )}

            {notification.emoji && (
              <View style={styles.reactionBadge}>
                <Text style={styles.reactionEmoji}>{notification.emoji}</Text>
              </View>
            )}

            {notification.type === 'post' && (
              <View style={styles.reactions}>
                <TouchableOpacity style={styles.reactionButton}>
                  <Text style={styles.reactionIcon}>😊</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionButton}>
                  <Text style={styles.reactionIcon}>😂</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionButton}>
                  <Text style={styles.reactionIcon}>😮</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionButton}>
                  <Text style={styles.reactionIcon}>♥️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionButton}>
                  <Ionicons name="refresh" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Reply Input */}
      <View style={styles.replySection}>
        <TouchableOpacity>
          <Text style={styles.replyPlaceholder}>Reply...</Text>
        </TouchableOpacity>
        <View style={styles.replyActions}>
          <TouchableOpacity>
            <Ionicons name="image-outline" size={24} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 6,
  },
  sparkle: {
    fontSize: 14,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  leftSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 25,
  },
  contentSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  postPreview: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  timeStamp: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timeStampText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  reactionBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  reactionButton: {
    padding: 5,
  },
  reactionIcon: {
    fontSize: 24,
  },
  replySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  replyPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  replyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});
