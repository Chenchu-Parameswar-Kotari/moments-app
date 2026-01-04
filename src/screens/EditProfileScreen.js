import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function EditProfileScreen({ navigation }) {
    const { user, userProfile, refreshUserProfile } = useAuth();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.displayName || user?.displayName || '');
            setBio(userProfile.bio || '');
            setImage(userProfile.photoURL || user?.photoURL || null);
        } else if (user) {
            setName(user.displayName || '');
            setImage(user.photoURL || null);
        }
    }, [user, userProfile]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            let photoURL = image;
            const isNewImage = image !== userProfile?.photoURL;

            // Upload to Firebase Storage if it's a new image and local component
            if (isNewImage && image && !image.startsWith('http')) {
                try {
                    // Convert URI to Blob
                    const response = await fetch(image);
                    const blob = await response.blob();

                    // Create storage ref
                    const filename = `profile_images/${user.uid}_${Date.now()}`;
                    const storageRef = ref(storage, filename);

                    // Upload
                    // console.log('Uploading image...');
                    await uploadBytes(storageRef, blob);

                    // Get URL
                    photoURL = await getDownloadURL(storageRef);
                    // console.log('Image uploaded. URL:', photoURL);

                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    Alert.alert('Image Upload Failed', 'Could not upload your profile picture. Please try again.');
                    setLoading(false);
                    return; // Stop execution if upload fails
                }
            }

            const updateData = {
                displayName: name.trim(),
                bio: bio.trim(),
                ...(photoURL !== userProfile?.photoURL ? { photoURL } : {})
            };

            const result = await updateUserProfile(user.uid, updateData);

            if (result.success) {
                await refreshUserProfile();
                Alert.alert('Success', 'Profile updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'An unexpected error occurred: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveButton}>
                    {loading ? (
                        <ActivityIndicator color="#0095f6" />
                    ) : (
                        <Ionicons name="checkmark" size={28} color="#0095f6" />
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                source={image ? { uri: image } : require('../../assets/icon.png')}
                                style={styles.profileImage}
                            />
                            <View style={styles.editIconContainer}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickImage}>
                            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your Name"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Write a bio..."
                            multiline
                            numberOfLines={3}
                            maxLength={150}
                        />
                        <Text style={styles.charCount}>{bio.length}/150</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingTop: Platform.OS === 'android' ? 40 : 12,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    saveButton: {
        padding: 8,
    },
    content: {
        padding: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#0095f6',
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    changePhotoText: {
        color: '#0095f6',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#666',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 8,
        fontSize: 16,
        color: '#000',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        color: '#999',
        fontSize: 12,
        marginTop: 4,
    },
});
