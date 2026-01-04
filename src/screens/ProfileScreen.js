import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    Alert,
    SafeAreaView,
    Modal,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

export default function ProfileScreen() {
    const { user, userProfile, logout } = useAuth();

    const [settingsVisible, setSettingsVisible] = React.useState(false);

    // Animation values for modal
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(300)).current;

    const openSettings = () => {
        setSettingsVisible(true);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeSettings = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => setSettingsVisible(false));
    };

    const handleOptionPress = (option) => {
        closeSettings();
        setTimeout(() => {
            if (Platform.OS === 'web') {
                window.alert(`${option} functionality coming soon!`);
            } else {
                Alert.alert('Coming Soon', `${option} functionality will be implemented in the next update.`);
            }
        }, 300);
    };

    const handleLogoutPress = () => {
        closeSettings();
        // Small delay to allow modal to close smoothly
        setTimeout(() => {
            logout();
        }, 300);
    };

    const stats = [
        { label: 'Posts', value: '24' },
        { label: 'Followers', value: '1.2k' },
        { label: 'Following', value: '482' },
    ];

    const galleryImages = [
        'https://images.unsplash.com/photo-1517849845537-4d257902454a',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        'https://images.unsplash.com/photo-1504993642115-6344b51cbc4f',
        'https://images.unsplash.com/photo-1434394354979-a235cd36269d',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b',
        'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c',
        'https://images.unsplash.com/photo-1511895426328-dc8714191300',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Background */}
                <View style={styles.headerBackground}>
                    <LinearGradient
                        colors={['#ffffff', '#f8f8f8']}
                        style={StyleSheet.absoluteFill}
                    />
                </View>

                {/* Header Actions */}
                <View style={styles.header}>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={openSettings} style={styles.iconButton}>
                        <Ionicons name="settings-outline" size={24} color="#1f1f1f" />
                    </TouchableOpacity>
                </View>

                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={['#C13584', '#E1306C', '#FDA77F']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.avatarGradientBorder}
                        >
                            <View style={styles.avatarInner}>
                                {userProfile?.photoURL ? (
                                    <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} />
                                ) : (
                                    <Text style={styles.avatarText}>
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </Text>
                                )}
                            </View>
                        </LinearGradient>
                        <View style={styles.addStatusButton}>
                            <Ionicons name="add-circle" size={24} color="#0095f6" />
                        </View>
                    </View>

                    <Text style={styles.name}>
                        {userProfile?.displayName || user?.displayName || 'User'}
                    </Text>
                    <Text style={styles.bio}>
                        {userProfile?.bio || 'Capturing moments, one snapshot at a time 📸'}
                    </Text>

                    {/* Stats Row */}
                    <View style={styles.statsContainer}>
                        {stats.map((stat, index) => (
                            <View key={index} style={styles.statItem}>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.editProfileButton}
                            onPress={() => handleOptionPress('Edit Profile')}
                        >
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Share Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Gallery Grid */}
                <View style={styles.galleryGrid}>
                    {galleryImages.map((uri, index) => (
                        <TouchableOpacity key={index} style={styles.galleryItem}>
                            <Image source={{ uri: `${uri}?w=400` }} style={styles.galleryImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Settings Modal */}
            <Modal
                visible={settingsVisible}
                transparent={true}
                animationType="none"
                onRequestClose={closeSettings}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        onPress={closeSettings}
                        activeOpacity={1}
                    />
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                transform: [{ translateY: slideAnim }],
                                opacity: fadeAnim
                            }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <View style={styles.modalIndicator} />
                            <Text style={styles.modalTitle}>Settings</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleOptionPress('Edit Profile')}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="person-outline" size={22} color="#333" />
                            </View>
                            <Text style={styles.optionText}>Edit Profile</Text>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleOptionPress('Notifications')}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="notifications-outline" size={22} color="#333" />
                            </View>
                            <Text style={styles.optionText}>Notifications</Text>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleOptionPress('Privacy & Security')}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="shield-checkmark-outline" size={22} color="#333" />
                            </View>
                            <Text style={styles.optionText}>Privacy & Security</Text>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalOption, styles.logoutOption]}
                            onPress={handleLogoutPress}
                        >
                            <View style={[styles.optionIcon, styles.logoutIconBg]}>
                                <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                            </View>
                            <Text style={[styles.optionText, styles.logoutText]}>Sign Out</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: Platform.OS === 'android' ? 30 : 0,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f1f1f',
        letterSpacing: -0.5,
    },
    iconButton: {
        padding: 8,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatarContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    avatarGradientBorder: {
        padding: 3,
        borderRadius: 60,
    },
    avatarInner: {
        backgroundColor: '#fff',
        padding: 3,
        borderRadius: 57,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarText: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
        lineHeight: 100,
        fontSize: 40,
        fontWeight: '600',
        color: '#666',
        overflow: 'hidden',
    },
    addStatusButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1f1f1f',
        marginBottom: 6,
    },
    bio: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 24,
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        paddingVertical: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f1f1f',
    },
    statLabel: {
        fontSize: 13,
        color: '#8e8e8e',
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        width: '100%',
        marginBottom: 20,
    },
    editProfileButton: {
        flex: 1,
        backgroundColor: '#1f1f1f',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    editProfileText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#1f1f1f',
        fontWeight: '600',
        fontSize: 14,
    },
    galleryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    galleryItem: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        padding: 1,
    },
    galleryImage: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        marginTop: 8,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f8f8',
    },
    optionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    logoutOption: {
        borderBottomWidth: 0,
        marginTop: 10,
    },
    logoutIconBg: {
        backgroundColor: '#FFF0F0',
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: '600',
    },
});
