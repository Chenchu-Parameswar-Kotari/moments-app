import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    ScrollView,
    Switch,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { resetPassword } from '../services/authService';

export default function PrivacyScreen({ navigation }) {
    const { user } = useAuth();
    const [privateAccount, setPrivateAccount] = useState(false);

    const handleResetPassword = async () => {
        if (user?.email) {
            Alert.alert(
                'Change Password',
                `Send a password reset email to ${user.email}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Send Email',
                        onPress: async () => {
                            const result = await resetPassword(user.email);
                            if (result.success) {
                                Alert.alert('Success', 'Reset email sent.');
                            } else {
                                Alert.alert('Error', result.error);
                            }
                        }
                    }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Security</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Privacy</Text>
                    <View style={styles.item}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.itemLabel}>Private Account</Text>
                            <Text style={styles.itemSublabel}>When your account is private, only people you approve can see your photos and videos.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={privateAccount ? '#0095f6' : '#f4f3f4'}
                            onValueChange={setPrivateAccount}
                            value={privateAccount}
                        />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    <TouchableOpacity style={styles.actionItem} onPress={handleResetPassword}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="key-outline" size={22} color="#000" />
                        </View>
                        <Text style={styles.actionText}>Change Password</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="cloud-download-outline" size={22} color="#000" />
                        </View>
                        <Text style={styles.actionText}>Download Data</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemLabel: {
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    itemSublabel: {
        fontSize: 13,
        color: '#999',
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconContainer: {
        width: 32,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
});
