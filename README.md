# 🏥 ArogyaLink - Smart Health Tracking System

[![React Native](https://img.shields.io/badge/React_Native-0.76.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.13-000020.svg)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)

> **Your Health, Connected** - A comprehensive health tracking platform designed for seamless doctor-patient communication with real-time monitoring and multi-language support.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🌟 Overview

ArogyaLink is a modern health tracking system that bridges the gap between patients and healthcare providers. The platform consists of:

- **Mobile App** - React Native patient application with offline-first capabilities
- **Web Dashboard** - Doctor portal for patient management and health data visualization
- **Backend API** - Node.js/Express server with MongoDB for data management

### Key Highlights

- ✅ **Multi-language Support** - English, Hindi (हिंदी), Marathi (मराठी)
- ✅ **Real-time Notifications** - Push notifications for health updates
- ✅ **Health Analytics** - Interactive charts for blood pressure, sugar, heart rate, weight
- ✅ **Offline-first** - Mobile app works without internet connection
- ✅ **Secure Authentication** - Phone number-based authentication
- ✅ **Responsive Design** - Works on all devices

## ✨ Features

### Mobile App (Patient)
- 📱 Beautiful gradient-based UI with dark theme
- 🌐 Multi-language interface (English/Hindi/Marathi)
- 📊 Health records visualization with line charts
- 🔔 Push notifications for doctor updates
- 👤 Patient profile management
- 💾 Offline-first architecture with AsyncStorage
- 🎯 Quick actions dashboard

### Web Dashboard (Doctor)
- 🏥 Patient management system
- 📈 Health trends visualization with recharts
- 📝 Add/update patient health data
- 👥 Patient list with search and filters
- 📱 Send notifications to patients
- 📊 Multi-line health charts (BP, Sugar, HR, Weight)
- 🔐 Secure doctor authentication

## 🏗️ Architecture

```
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
└────────┬────────┘
         │
         │ REST API
         │
┌────────▼────────┐      ┌──────────────┐
│  Backend API    │◄────►│   MongoDB    │
│  (Node.js)      │      │   Database   │
└────────┬────────┘      └──────────────┘
         │
         │ REST API
         │
┌────────▼────────┐
│  Web Dashboard  │
│  (React)        │
└─────────────────┘
```

## 🛠️ Tech Stack

### Mobile App
- **Framework:** React Native with Expo SDK 54
- **UI Components:** React Native Core + Expo Linear Gradient
- **Charts:** react-native-chart-kit + react-native-svg
- **i18n:** i18next, react-i18next
- **Storage:** AsyncStorage
- **Navigation:** expo-router
- **Notifications:** expo-notifications

### Web Frontend
- **Framework:** React 18
- **Charts:** recharts
- **Styling:** CSS with CSS Modules
- **HTTP Client:** fetch API
- **Build Tool:** Create React App

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (planned)
- **CORS:** Enabled for web/mobile access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6.0+
- Expo CLI (for mobile development)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/satvik-student/smart-health-tracking-thing.git
cd smart-health-tracking-thing
```

2. **Backend Setup**
```bash
cd web/backend
npm install
npm start
# Server runs on http://localhost:4000
```

3. **Web Frontend Setup**
```bash
cd web/frontend
npm install
npm start
# Opens on http://localhost:3000
```

4. **Mobile App Setup**
```bash
cd mobile/my-app
npm install
npx expo start
# Scan QR code with Expo Go app
```

### Environment Variables

Create `.env` files in respective directories:

**Backend (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/healthtracking
PORT=4000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:4000
```

## 📁 Project Structure

```
smart-health-tracking-thing/
├── mobile/                 # React Native mobile app
│   └── my-app/
│       ├── app/           # Screen components (expo-router)
│       ├── components/    # Reusable components
│       ├── i18n/          # Internationalization
│       └── config/        # Configuration files
├── web/                   # Web application
│   ├── frontend/          # React doctor dashboard
│   │   └── src/
│   │       ├── home-dashboard/
│   │       ├── auth/
│   │       └── landing/
│   └── backend/           # Node.js API server
│       ├── index.js       # Server entry point
│       ├── models.js      # MongoDB models
│       └── package.json
└── README.md             # This file
```

## 📚 Documentation

- [Mobile App README](./mobile/README.md) - Detailed mobile app documentation
- [Web README](./web/README.md) - Web frontend and backend documentation
- [API Documentation](#) - Coming soon

## 🎨 Features by Module

### Authentication
- Phone number-based login/registration
- Session management with AsyncStorage
- Secure token handling

### Patient Dashboard (Mobile)
- 4-tab navigation: Home, Alerts, Profile, Language
- Quick action cards for common tasks
- Recent notifications preview
- Health records access

### Doctor Dashboard (Web)
- Patient list with filtering
- Add/edit patient information
- Health data entry (BP, Sugar, HR, Weight)
- Send notifications to patients
- Health trends visualization

### Multi-language Support
- Automatic language detection
- Persistent language preference
- Complete UI translation
- Supports: English, Hindi, Marathi

## 🧪 Testing

```bash
# Backend tests
cd web/backend
npm test

# Frontend tests
cd web/frontend
npm test

# Mobile app tests
cd mobile/my-app
npm test
```

## 🚧 Roadmap

- [ ] Firebase authentication integration
- [ ] SMS notifications via Fast2SMS
- [ ] Hospital/clinic directory
- [ ] Appointment scheduling
- [ ] Video consultation
- [ ] Health tips and articles
- [ ] Lab report upload
- [ ] Medicine reminders

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer:** Satvik Student
- **Project:** Smart Health Tracking System
- **Organization:** Team 1

## 📞 Support

For support, email support@arogyalink.com or open an issue in the repository.

## 🙏 Acknowledgments

- Expo team for the amazing React Native framework
- MongoDB for the database solution
- All contributors and supporters

---

**Built with ❤️ for better healthcare accessibility**
