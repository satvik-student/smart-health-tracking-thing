Mobile (Expo) app

This is a minimal Expo React Native app scaffold focused on offline-first patient health tracking.

Features included in scaffold:
- AsyncStorage-based registration (phone, age, gender)
- Simple dashboard showing latest readings with color indicators
- Local reminders using react-native-push-notification (placeholder)
- Chart placeholder using react-native-chart-kit
- Firebase & Fast2SMS integration points (not configured)

Setup
1. Install dependencies:
   npm install
2. Start Expo:
   expo start

Notes
- Replace Firebase config in `src/config/firebase.js` and enable phone auth.
- Add Fast2SMS API key to `web/.env` when integrating SMS.
