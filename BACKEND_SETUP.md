# 🚀 How to Start the Backend Server

## Prerequisites
- Make sure you have `.env` file in `web/` folder with MongoDB connection string

## Steps to Start Backend

1. **Navigate to backend directory:**
   ```bash
   cd web/backend
   ```

2. **Start the server:**
   ```bash
   node index.js
   ```

   Or if you have nodemon installed:
   ```bash
   npm start
   ```

3. **You should see:**
   ```
   MongoDB connected successfully
   Server running on http://localhost:4000
   ```

## Verify Server is Running

Open your browser and go to:
```
http://localhost:4000/health
```

You should see:
```json
{"ok":true,"uptime":123}
```

## New API Endpoints Added

### 1. Patient Registration
- **URL:** `POST /api/patients/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "phone": "1234567890",
    "password": "password123",
    "age": 25,
    "gender": "Male"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Patient registered successfully",
    "patient": {
      "patientId": "P002",
      "name": "John Doe",
      "phone": "1234567890",
      "age": 25,
      "gender": "Male"
    }
  }
  ```

### 2. Patient Login
- **URL:** `POST /api/patients/login`
- **Body:**
  ```json
  {
    "phone": "1234567890",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "patient": {
      "patientId": "P002",
      "name": "John Doe",
      "phone": "1234567890",
      "age": 25,
      "gender": "Male"
    }
  }
  ```

## Patient Schema (Updated)

```javascript
{
  name: String (required),
  patientId: String (auto-generated: P002, P003...),
  phone: String (required),
  age: Number (1-120, required),
  gender: String (Male/Female/Other, required),
  password: String (bcrypt hashed, min 6 chars),
  createdAt: Date (auto)
}
```

## Auto-Generated Patient IDs
- First patient: **P002**
- Second patient: **P003**
- Third patient: **P004**
- And so on...

## Security
- Passwords are hashed using bcryptjs before storing
- Passwords are never returned in API responses
- Phone numbers must be unique

---

**Backend is ready to receive data from the mobile app!** 🎉
