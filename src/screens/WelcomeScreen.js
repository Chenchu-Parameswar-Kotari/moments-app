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
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const heroPortrait = { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80' };

export default function WelcomeScreen({ onAuth }) {
  const [mode, setMode] = useState('welcome'); // 'welcome', 'signin', 'signup', 'otp'
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSignUp, setIsSignUp] = useState(false);
  const otpRefs = useRef([]);
  
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

  const handleSendOtp = (forSignUp) => {
    if (forSignUp && (!emailOrPhone || !name)) {
      alert('Please enter your name and email/phone');
      return;
    }
    if (!forSignUp && !emailOrPhone) {
      alert('Please enter your email or phone number');
      return;
    }
    setIsSignUp(forSignUp);
    setMode('otp');
    // In real app, send OTP here
    console.log('Sending OTP to:', emailOrPhone);
  };

  const handleOtpChange = (value, index) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      console.log('Verifying OTP:', otpCode);
      onAuth();
    } else {
      alert('Please enter the complete 6-digit code');
    }
  };

  const resetForm = () => {
    setEmailOrPhone('');
    setName('');
    setOtp(['', '', '', '', '', '']);
  };

  if (mode === 'otp') {
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.content}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => {
                    setMode(isSignUp ? 'signup' : 'signin');
                    setOtp(['', '', '', '', '', '']);
                  }}
                >
                  <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                  <View style={styles.emoji}>
                    <Text style={styles.emojiText}>😊</Text>
                    <View style={styles.cameraBadge}>
                      <Text style={styles.cameraEmoji}>📷</Text>
                    </View>
                  </View>
                  <Text style={styles.title}>moments</Text>
                </View>

                <Text style={styles.formTitle}>Verify OTP</Text>
                <Text style={styles.formDescription}>
                  We've sent a 6-digit code to{'\n'}
                  <Text style={styles.emailHighlight}>{emailOrPhone}</Text>
                </Text>

                <View style={styles.formContainer}>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (otpRefs.current[index] = ref)}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                    <TouchableOpacity 
                      style={styles.primaryButton}
                      onPress={handleVerifyOtp}
                    >
                      <View style={styles.solidButton}>
                        <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                      </View>
                    </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleSendOtp(isSignUp)}>
                    <Text style={styles.resendText}>
                      Didn't receive code? <Text style={styles.switchTextBold}>Resend</Text>
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  <View style={styles.emoji}>
                    <Text style={styles.emojiText}>😊</Text>
                    <View style={styles.cameraBadge}>
                      <Text style={styles.cameraEmoji}>📷</Text>
                    </View>
                  </View>
                  <Text style={styles.title}>moments</Text>
                </View>

                <Text style={styles.formTitle}>Sign In</Text>
                <Text style={styles.formDescription}>
                  Welcome back! Enter your email or phone{'\n'}to receive a verification code
                </Text>

                <View style={styles.formContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email or Mobile Number"
                    placeholderTextColor="#999"
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />

                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => handleSendOtp(false)}
                  >
                      <View style={styles.solidButton}>
                        <Text style={styles.primaryButtonText}>Send OTP</Text>
                      </View>
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
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
          style={styles.gradient}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  <View style={styles.emoji}>
                    <Text style={styles.emojiText}>😊</Text>
                    <View style={styles.cameraBadge}>
                      <Text style={styles.cameraEmoji}>📷</Text>
                    </View>
                  </View>
                  <Text style={styles.title}>moments</Text>
                </View>

                <Text style={styles.formTitle}>Sign Up</Text>
                <Text style={styles.formDescription}>
                  Create an account to get started
                </Text>

                <View style={styles.formContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Email or Mobile Number"
                    placeholderTextColor="#999"
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />

                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => handleSendOtp(true)}
                  >
                      <View style={styles.solidButton}>
                        <Text style={styles.primaryButtonText}>Send OTP</Text>
                      </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    setMode('signin');
                    resetForm();
                  }}>
                    <Text style={styles.switchText}>
                      Already have an account? <Text style={styles.switchTextBold}>Sign In</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        {/* Pure white background */}
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      
      <View style={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity style={styles.skipButton} onPress={onAuth}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: Animated.add(slideAnim, floatAnim) },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.logoMark}>
            <Ionicons name="camera-outline" size={42} color="#1f1f1f" />
          </View>

          <Text style={styles.brandName}>moments</Text>
          <Text style={styles.tagline}>Share life, as it happens.</Text>

          <View style={styles.cardStack}>
            <Image
              source={heroPortrait}
              style={[styles.card, styles.cardBack]}
              resizeMode="cover"
            />
            <Image
              source={heroPortrait}
              style={[styles.card, styles.cardMid]}
              resizeMode="cover"
            />
            <Image
              source={heroPortrait}
              style={[styles.card, styles.cardFront]}
              resizeMode="cover"
            />
          </View>
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
      </View>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: height * 0.06,
    marginBottom: height * 0.05,
    gap: 12,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f1f1f',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  tagline: {
    fontSize: 15,
    color: '#7a7a7a',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  cardStack: {
    width: width * 0.64,
    height: Math.min(width * 0.75, 360),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  card: {
    width: '84%',
    aspectRatio: 4 / 5,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#fff',
  },
  cardBack: {
    top: 26,
    left: -6,
    transform: [{ rotate: '-9deg' }, { scale: 0.94 }],
  },
  cardMid: {
    top: 14,
    right: -4,
    transform: [{ rotate: '6deg' }, { scale: 0.97 }],
  },
  cardFront: {
    top: 0,
    transform: [{ rotate: '-2deg' }],
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
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
    paddingVertical: 24,
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
  emoji: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 40,
  },
  cameraBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
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
    flex: 1,
    justifyContent: 'center',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 48,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resendText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
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
});
