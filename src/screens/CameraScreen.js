import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [hasPhoto, setHasPhoto] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camera</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="flash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Preview Area */}
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' }}
          style={styles.previewImage}
        />
        
        {/* Time Overlay */}
        <View style={styles.timeOverlay}>
          <Text style={styles.timeText}>23:35 left</Text>
        </View>
      </View>

      {/* Control Bar */}
      <View style={styles.controlBar}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="flash" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.captureButton}
          onPress={() => setHasPhoto(!hasPhoto)}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="sync" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <View style={styles.timeIndicators}>
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxText}>1 min</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxText}>3 min</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxText}>10 min</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxText}>10 post</Text>
          </View>
        </View>

        <Text style={styles.uploadText}>
          No re-uploadable Post only what you're doing right now.
        </Text>
      </View>

      {/* Moments Label */}
      <View style={styles.momentsLabel}>
        <Text style={styles.momentsText}>Moments</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
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
    color: '#fff',
  },
  previewContainer: {
    flex: 1,
    margin: 15,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  timeOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(51, 51, 51, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E8E8E8',
    shadowColor: '#333333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  bottomInfo: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  timeIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10,
  },
  timeBox: {
    backgroundColor: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  timeBoxText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  momentsLabel: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: '#333333',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#333333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  momentsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
