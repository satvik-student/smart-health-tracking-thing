# Health Tracker Backend

Backend API server for the Smart Health Tracking application.

## Technology Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- bcryptjs for password hashing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

3. Test database connection:
```bash
npm run test
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Doctor Management

#### Create Doctor
- **POST** `/api/doctors`
- Body: `{ name, phone, email, password, clinic }`

#### Login
- **POST** `/api/doctors/login`
- Body: `{ phone, password }`

#### Get All Doctors
- **GET** `/api/doctors`

#### Get Doctor by ID
- **GET** `/api/doctors/:id`

#### Update Doctor
- **PUT** `/api/doctors/:id`

#### Delete Doctor (soft delete)
- **DELETE** `/api/doctors/:id`

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3000)
