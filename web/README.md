Web backend (Node.js + Express)

This is a minimal backend to accept and serve patient health readings for doctors/health workers.

Features:
- Simple Express server
- In-memory store (replace with Firestore/MongoDB in production)
- Endpoints: POST /patients/:phone/readings, GET /patients/:phone/readings
- Placeholder for Fast2SMS and Firebase Admin integration

Run:
- npm install
- npm run dev
