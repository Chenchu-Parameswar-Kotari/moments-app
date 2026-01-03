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

const stories = [
  { name: 'Emily', uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80' },
  { name: 'Luke', uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80' },
  { name: 'Emma', uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80' },
  { name: 'Justin', uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&q=80' },
  { name: 'Isabel', uri: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80' },
];

const post = {
  user: 'Sarah Pearson',
  time: '2m',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
  caption: 'Saturday sunset ☀️',
  comments: [
    { user: 'Justin', text: 'Omg the beach looks amazing!' },
  ],
};

export default function MainFeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="camera-outline" size={24} color="#1f1f1f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>moments</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="paper-plane-outline" size={22} color="#1f1f1f" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.newMomentRow}>
          <TouchableOpacity style={styles.newMomentButton}>
            <Ionicons name="add" size={18} color="#1f1f1f" style={styles.newMomentIcon} />
            <Text style={styles.newMomentText}>New moment</Text>
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#9a9a9a" />
        </View>

        <View style={styles.storiesRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stories.map((story, index) => (
              <View key={story.name + index} style={styles.storyItem}>
                <View style={styles.storyAvatarWrap}>
                  <Image source={{ uri: story.uri }} style={styles.storyAvatar} />
                  <View style={styles.storyLiveBadge} />
                </View>
                <Text style={styles.storyName}>{story.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.postUser}>
              <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
              <View>
                <Text style={styles.postUserName}>{post.user}</Text>
                <Text style={styles.postMeta}>{post.time}</Text>
              </View>
            </View>
            <Ionicons name="ellipsis-horizontal" size={18} color="#8a8a8a" />
          </View>

          <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />

          <View style={styles.actionsRow}>
            <View style={styles.leftActions}>
              <Ionicons name="heart-outline" size={22} color="#1f1f1f" style={styles.iconSpacer} />
              <Ionicons name="chatbubble-outline" size={22} color="#1f1f1f" style={styles.iconSpacer} />
              <Ionicons name="paper-plane-outline" size={22} color="#1f1f1f" />
            </View>
            <Ionicons name="bookmark-outline" size={22} color="#1f1f1f" />
          </View>

          <Text style={styles.likes}>124 likes</Text>
          <Text style={styles.caption}><Text style={styles.bold}>{post.user}</Text> {post.caption}</Text>
          {post.comments.map((comment, idx) => (
            <Text key={idx} style={styles.comment}><Text style={styles.bold}>{comment.user}</Text> {comment.text}</Text>
          ))}

          <View style={styles.replyRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#a0a0a0" />
            <Text style={styles.replyPlaceholder}>Reply...</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f1f1f',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  newMomentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  newMomentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },
  newMomentIcon: {
    marginRight: 8,
  },
  newMomentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  storiesRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 68,
  },
  storyAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#f4d6a1',
    padding: 3,
    position: 'relative',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
  },
  storyLiveBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffb347',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  storyName: {
    marginTop: 6,
    fontSize: 12,
    color: '#4a4a4a',
    fontWeight: '500',
  },
  postCard: {
    paddingVertical: 14,
    marginBottom: 24,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
    gap: 10,
  },
  postAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f0f0f0',
  },
  postUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f1f1f',
  },
  postMeta: {
    fontSize: 12,
    color: '#9a9a9a',
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacer: {
    marginRight: 14,
  },
  likes: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f1f1f',
    paddingHorizontal: 14,
  },
  caption: {
    paddingHorizontal: 14,
    paddingTop: 4,
    fontSize: 13,
    color: '#1f1f1f',
  },
  bold: {
    fontWeight: '700',
  },
  comment: {
    paddingHorizontal: 14,
    paddingTop: 4,
    fontSize: 13,
    color: '#2f2f2f',
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  replyPlaceholder: {
    fontSize: 13,
    color: '#9a9a9a',
  },
});
