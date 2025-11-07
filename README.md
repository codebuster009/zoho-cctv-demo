# Smart CCTV Portal + Real Zoho CRM Integration

A full MERN stack application that connects a CCTV/IoT monitoring dashboard with real Zoho CRM integration. This project demonstrates real-time IoT event handling, API integration, and CRM synchronization.

## Flow

```
IoT Sensor → Node/Express → MongoDB → React UI → Zoho CRM API
```

Each event can be sent directly to Zoho CRM, where it's created as a Case. The integration uses Zoho OAuth2 and the v3 CRM API.

## Stack

- **MongoDB** - Database for storing IoT events
- **Express.js** - Backend server
- **React + Vite** - Frontend framework
- **TailwindCSS** - Styling
- **Node.js** - Runtime environment
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animation library
- **Lucide-react** - Icon library
- **Zoho CRM API** - Real OAuth2 integration

## Purpose

Show understanding of full-stack IoT event handling, real API integration, and CRM synchronization.

## Project Structure

```
SmartCCTV-Zoho-RealAPI/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── events.js
│   │   └── zoho.js
│   ├── models/
│   │   └── Event.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api.js
│   │   ├── styles.css
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── CameraGrid.jsx
│   │       ├── EventLog.jsx
│   │       └── Toast.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB installed and running locally
- Zoho CRM account with API access

### 1. MongoDB Setup

Make sure MongoDB is running on your local machine:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/data
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your Zoho credentials:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartcctv
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_REDIRECT_URI=https://www.google.com
ZOHO_BASE_URL=https://www.zohoapis.com
ZOHO_CRM_API=https://www.zohoapis.com/crm/v3
```

5. Start the backend server:
```bash
npm run dev
# or
npm start
```

The server will start on `http://localhost:5000` and begin generating random IoT events every 5 seconds.

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000` and automatically proxy API requests to the backend.

## API Endpoints

### GET /api/events
Fetch all events from MongoDB.

**Response:**
```json
[
  {
    "_id": "...",
    "camera_name": "Warehouse Entrance",
    "eventType": "Motion",
    "site": "Warehouse A",
    "time": "14:35:20",
    "status": "Pending",
    "syncedToCRM": false,
    "zohoCaseId": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### POST /api/events
Create a new event.

**Request Body:**
```json
{
  "camera_name": "Warehouse Entrance",
  "eventType": "Motion",
  "site": "Warehouse A",
  "time": "14:35:20"
}
```

### POST /api/zoho/:id
Send an event to Zoho CRM and create a Case.

**Response:**
```json
{
  "success": true,
  "message": "Event sent to Zoho CRM successfully",
  "caseId": "1234567890",
  "event": { ... }
}
```

## Zoho CRM Integration

### OAuth2 Flow

The application uses Zoho's OAuth2 refresh token flow:

1. **Refresh Token**: Used to obtain new access tokens
2. **Access Token**: Used to authenticate API requests
3. **Token Refresh**: Automatically handled when sending events to Zoho

### Creating Cases

When an event is sent to Zoho CRM:

- **Subject**: `CCTV Alert: {eventType} - {camera_name}`
- **Description**: Includes event details (type, camera, site, time, event ID)
- **Status**: "New"
- **Priority**: "High" for Fire/Intrusion, "Medium" for others
- **Origin**: "Web"

### Getting Zoho Credentials

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create a new client application
3. Generate a refresh token
4. Copy Client ID, Client Secret, and Refresh Token to `.env`

## Features

- **Real-time Event Generation**: Backend automatically creates random IoT events every 5 seconds
- **Live Dashboard**: Frontend polls for new events every 5 seconds
- **Zoho CRM Sync**: One-click sync to create Cases in Zoho CRM
- **Toast Notifications**: Success/error notifications with Case IDs
- **Dark Mode UI**: Modern dark theme with Tailwind CSS
- **Responsive Design**: Works on mobile and desktop
- **Smooth Animations**: Framer Motion for polished UI transitions

## Expected Result

1. Dashboard shows live CCTV/IoT events in real-time
2. Clicking "Send to Zoho CRM" creates a real Case in your Zoho account
3. Toast notification appears with the Case ID
4. Event status updates to "Synced" in the dashboard
5. You can open Zoho CRM → Cases → see your synced event instantly

## Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-reload on changes
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Building for Production
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongosh` or check service status
- Verify `MONGO_URI` in `.env` is correct

### Zoho API Issues
- Verify all Zoho credentials in `.env` are correct
- Check that refresh token is valid and not expired
- Ensure your Zoho account has CRM API access enabled

### CORS Issues
- Backend CORS is configured to allow requests from `localhost:3000`
- If using a different port, update CORS settings in `backend/server.js`

## License

ISC

