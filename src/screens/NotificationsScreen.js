import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationsScreen({ navigation }) {
    const [settings, setSettings] = useState({
        pauseAll: false,
        posts: true,
        stories: true,
        comments: true,
        following: true,
        marketing: false,
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem('notificationSettings');
            if (saved) {
                setSettings({ ...settings, ...JSON.parse(saved) });
            }
        } catch (error) {
            console.log('Error loading settings', error);
        }
    };

    const toggleSwitch = async (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        try {
            await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
        } catch (error) {
            console.log('Error saving settings', error);
        }
    };

    const RenderItem = ({ label, settingKey }) => (
        <View style={styles.item}>
            <Text style={styles.itemLabel}>{label}</Text>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={settings[settingKey] ? '#0095f6' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(settingKey)}
                value={settings[settingKey]}
                disabled={settings.pauseAll && settingKey !== 'pauseAll'}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Push Notifications</Text>
                    <RenderItem label="Pause All" settingKey="pauseAll" />
                </View>

                {!settings.pauseAll && (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Interactions</Text>
                            <RenderItem label="Posts, Stories, and Comments" settingKey="posts" />
                            <RenderItem label="Following and Followers" settingKey="following" />
                        </View>

                        <View style={styles.divider} />
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Other</Text>
                            <RenderItem label="Email and SMS Marketing" settingKey="marketing" />
                        </View>
                    </>
                )}
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
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
    },
});
