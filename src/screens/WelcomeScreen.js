import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signUp, signIn, resetPassword } from '../services/authService';
import { useAuth } from '../context/AuthContext';

// Helper for cross-platform alerts
const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function WelcomeScreen() {
  const [mode, setMode] = useState('welcome'); // 'welcome', 'signin', 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate password complexity
  const validatePassword = (pwd) => {
    if (pwd.length < 6) return 'Password must be at least 6 characters';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password must contain at least one symbol';
    return null;
  };

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSignUp = async () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(email.trim(), password, name.trim());

      if (result.success) {
        // Auth state will update automatically via AuthContext
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error) {
      setError(`An unexpected error occurred: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.success) {
      // Auth state will update automatically via AuthContext
    } else {
      setError(result.error || 'Failed to sign in');
    }
  };

  const handleResetPassword = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email to reset password');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);

    if (result.success) {
      showAlert('Success', 'Password reset email sent! Check your inbox.');
      setMode('signin');
    } else {
      setError(result.error || 'Failed to send reset email');
    }
  };

  const resetForm = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };


  if (mode === 'forgotPassword') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
          style={styles.gradient}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.content}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setMode('signin');
                    resetForm();
                  }}
                >
                  <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                  <View style={styles.formLogoMark}>
                    <Ionicons name="key-outline" size={36} color="#1f1f1f" />
                  </View>
                  <Text style={styles.title}>Recovery</Text>
                </View>

                <Text style={styles.formTitle}>Forgot Password?</Text>
                <Text style={styles.formDescription}>
                  Enter your email address to receive a password reset link
                </Text>

                <View style={styles.formContainer}>
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    editable={!loading}
                  />

                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.disabledButton]}
                    onPress={handleResetPassword}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    {loading ? (
                      <View style={styles.solidButton}>
                        <ActivityIndicator color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={styles.solidButton}>
                        <Text style={styles.primaryButtonText}>Send Reset Link</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (mode === 'signin') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
          style={styles.gradient}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.content}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setMode('welcome');
                    resetForm();
                  }}
                >
                  <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                  <View style={styles.formLogoMark}>
                    <Ionicons name="camera-outline" size={36} color="#1f1f1f" />
                  </View>
                  <Text style={styles.title}>moments</Text>
                </View>

                <Text style={styles.formTitle}>Sign In</Text>
                <Text style={styles.formDescription}>
                  Welcome back! Enter your email and password to sign in
                </Text>

                <View style={styles.formContainer}>
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    editable={!loading}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    editable={!loading}
                  />

                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.disabledButton]}
                    onPress={handleSignIn}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    {loading ? (
                      <View style={styles.solidButton}>
                        <ActivityIndicator color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={styles.solidButton}>
                        <Text style={styles.primaryButtonText}>Sign In</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setMode('forgotPassword');
                      resetForm();
                    }}
                    style={{ alignSelf: 'center', marginVertical: 15 }}
                  >
                    <Text style={{ color: '#5B9BD5', fontWeight: '600', fontSize: 14 }}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    setMode('signup');
                    resetForm();
                  }}>
                    <Text style={styles.switchText}>
                      Don't have an account? <Text style={styles.switchTextBold}>Sign Up</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (mode === 'signup') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            <View style={styles.content}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setMode('welcome');
                  resetForm();
                }}
              >
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>

              <View style={styles.logoContainer}>
                <View style={styles.formLogoMark}>
                  <Ionicons name="camera-outline" size={36} color="#1f1f1f" />
                </View>
                <Text style={styles.title}>moments</Text>
              </View>

              <Text style={styles.formTitle}>Sign Up</Text>
              <Text style={styles.formDescription}>
                Create an account to get started
              </Text>

              <View style={styles.formContainer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!loading}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!loading}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!loading}
                />

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabledButton]}
                  onPress={handleSignUp}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  {loading ? (
                    <View style={styles.solidButton}>
                      <ActivityIndicator color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={styles.solidButton}>
                      <Text style={styles.primaryButtonText}>Sign Up</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setMode('signin');
                    resetForm();
                  }}
                >
                  <Text style={styles.switchText}>
                    Already have an account? <Text style={styles.switchTextBold}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Skip button - removed for security */}

        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: Animated.add(slideAnim, floatAnim) },
                { scale: scaleAnim }
              ],
            }
          ]}
        >
          <View style={styles.logoMark}>
            <Ionicons name="camera-outline" size={48} color="#1f1f1f" />
          </View>

          <Text style={styles.brandName}>moments</Text>
          <Text style={styles.tagline}>Share life, as it happens.</Text>
        </Animated.View>

        {/* Buttons section */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setMode('signup')}
            activeOpacity={0.9}
          >
            <View style={styles.solidButton}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode('signin')}
            activeOpacity={0.9}
          >
            <Text style={styles.loginText}>Already a member? <Text style={styles.loginLink}>Login</Text></Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms</Text> &{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  skipContainer: {
    alignItems: 'flex-end',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1f1f1f',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#7a7a7a',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingTop: 30,
    paddingBottom: 20,
  },
  primaryButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#222222',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 10,
  },
  solidButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginText: {
    color: '#7f7f7f',
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 4,
  },
  loginLink: {
    color: '#5a5a5a',
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  secondaryButtonText: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#BBB',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#5B9BD5',
  },
  // Form styles (for sign in/up screens)
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  backText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  formLogoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  formDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 20,
  },
  emailHighlight: {
    color: '#333333',
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressedButton: {
    opacity: 0.8,
  },
  switchText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  switchTextBold: {
    color: '#333333',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
});
