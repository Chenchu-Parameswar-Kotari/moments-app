# Moments App

A React Native social media app for sharing daily moments with friends, inspired by BeReal.

## Features

- ⏰ Timed daily posting windows
- 📸 Camera integration for capturing moments
- 👥 Friend activity feed
- 💬 Direct messaging and replies
- ⚡ Real-time notifications
- 🎨 Beautiful gradient UI

## Screens

1. **Welcome Screen** - Onboarding with authentication options
2. **Main Feed** - View friends' moments with countdown timer
3. **Camera Screen** - Capture and post your moment
4. **Activity Screen** - Notifications and interactions
5. **Messaging Screen** - Private replies to moments

## Installation

\`\`\`bash
# Install dependencies
npm install

# Start the app
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
\`\`\`

## Tech Stack

- React Native
- Expo
- React Navigation
- Expo Linear Gradient
- React Native Vector Icons

## Project Structure

\`\`\`
moments-app/
├── src/
│   └── screens/
│       ├── WelcomeScreen.js
│       ├── MainFeedScreen.js
│       ├── CameraScreen.js
│       ├── ActivityScreen.js
│       └── MessagingScreen.js
├── App.js
├── package.json
└── README.md
\`\`\`

## Getting Started

1. Make sure you have Node.js and Expo CLI installed
2. Clone this repository
3. Run \`npm install\` to install dependencies
4. Run \`npm start\` to start the development server
5. Use the Expo Go app on your phone to scan the QR code

## Notes

- This is a UI implementation. For full functionality, you'll need to add:
  - Camera permissions and actual camera integration
  - Backend API for user authentication
  - Real-time database for moments and messages
  - Push notifications
  - Image upload and storage

## License

MIT
