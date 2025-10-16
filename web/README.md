# Smart Health Tracking System - Web Platform

A modern, full-stack health tracking platform with a beautiful React frontend and powerful Node.js backend.

## 🏗️ Project Structure

```
web/
├── backend/          # Node.js + Express API
│   ├── index.js     # Main server file
│   ├── models.js    # MongoDB models
│   ├── .env         # Environment variables
│   └── package.json
│
├── frontend/        # React.js application
│   ├── src/
│   │   ├── landing/ # Landing page with god-level UI
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── public/          # Legacy HTML files (reference)
```

## ✨ Features

### Backend
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- Doctor authentication and management
- Secure password hashing with bcryptjs
- CORS enabled for cross-origin requests

### Frontend
- Modern React.js with Create React App
- Beautiful landing page with animations
- Responsive design for all devices
- Smooth scroll effects and transitions
- God-level UI with gradient effects

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Test database connection:
```bash
npm run test
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📡 API Endpoints

### Doctor Management

- **POST** `/api/doctors` - Create new doctor account
- **POST** `/api/doctors/login` - Doctor login
- **GET** `/api/doctors` - Get all active doctors
- **GET** `/api/doctors/:id` - Get specific doctor
- **PUT** `/api/doctors/:id` - Update doctor info
- **DELETE** `/api/doctors/:id` - Soft delete doctor

## 🎨 Frontend Features

- **Landing Page**: Eye-catching hero section with animated gradients
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Floating elements, parallax effects, and transitions
- **Modern UI**: Clean, professional design with glassmorphism effects
- **Performance Optimized**: Fast loading and smooth interactions

## 🔧 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- CORS
- dotenv

### Frontend
- React.js
- CSS3 with animations
- Modern ES6+ JavaScript
- Responsive design

## 📦 Production Deployment

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Deploy the `build` folder to your hosting service (Vercel, Netlify, etc.)

## 🛠️ Development

### Backend
- Uses nodemon for auto-reload during development
- Environment variables for configuration
- MongoDB for data persistence

### Frontend
- Hot module replacement for instant updates
- Component-based architecture
- CSS modules for scoped styling

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/health-tracker
PORT=3000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the SmartHealth team

---

For more information, visit our [documentation](https://docs.smarthealth.com) or contact support@smarthealth.com
