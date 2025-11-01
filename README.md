# Web Vitals Dashboard

A fullstack web application that retrieves and analyzes real-world performance data from Google's Chrome UX Report (CrUX) API. This tool helps identify website performance issues and provides insights for improving page load speeds.

## Project Overview

This application allows users to:
- Analyze performance metrics for any URL with sufficient Chrome user data
- View Core Web Vitals (LCP, FCP, CLS, FID/INP, TTFB)
- Filter and sort performance data
- Compare multiple URLs simultaneously
- View aggregate statistics across multiple URLs

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for CrUX API
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client for API calls
- **React Hooks** - State management

### External API
- **Chrome UX Report (CrUX) API** - Performance data from Google

## Project Structure

```
web-vitals-dashboard/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── services/          # Business logic & API integration
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Custom middleware
│   │   └── server.js          # Entry point
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Environment template
│   └── package.json           # Dependencies
│
├── frontend/                  # React application (TBD)
│   └── (to be created)
│
├── .docs/                     # Documentation
│   ├── BrightEdge_Assignment_Analysis.md
│   ├── Architecture_Diagram.html
│   ├── backend-todos.md       # Backend task checklist
│   ├── frontend-todos.md      # Frontend task checklist
│   └── future-enhancements.md # Bonus features
│
├── README.md                  # This file
└── LICENSE                    # MIT License
```

## Core Features

### Part 1: Basic Functionality ✅ (In Progress)
- Single URL input and search
- Fetch data from CrUX API
- Display performance metrics in table format
- Error handling for invalid URLs and API failures

### Part 2: Data Manipulation
- Sort data by any column (ascending/descending)
- Filter by performance thresholds
- Filter by metric type
- Clear filters functionality

### Part 3: Multi-URL Support
- Input multiple URLs at once
- Parallel API requests for efficiency
- Display individual results for each URL
- Calculate and show aggregate statistics (averages, totals)
- Summary view across all URLs

## Performance Metrics Explained

| Metric | Name | What It Measures | Good | Needs Improvement | Poor |
|--------|------|------------------|------|-------------------|------|
| **LCP** | Largest Contentful Paint | Time until main content is visible | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FCP** | First Contentful Paint | Time until first content appears | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| **CLS** | Cumulative Layout Shift | Visual stability (layout shifts) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **FID** | First Input Delay | Interactivity (response time) | ≤ 100ms | 100ms - 300ms | > 300ms |
| **INP** | Interaction to Next Paint | Overall responsiveness | ≤ 200ms | 200ms - 500ms | > 500ms |
| **TTFB** | Time to First Byte | Server response time | ≤ 600ms | 600ms - 1200ms | > 1200ms |

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Cloud account with CrUX API enabled
- CrUX API key

### Quick Start (Recommended)

**Run both frontend and backend together:**

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   CRUX_API_KEY=your_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Start both servers:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```
   or (on macOS/Linux)
   ```bash
   ./start.sh
   ```

This will start:
- Backend API at `http://localhost:5000`
- Frontend at `http://localhost:5173` (or another available port)

Both servers will run concurrently and can be stopped with `Ctrl+C`

### Manual Setup (Individual Servers)

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   CRUX_API_KEY=your_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Available Scripts

From the root directory:
- `npm run dev` - Start both frontend and backend
- `npm start` - Alias for `npm run dev`
- `npm run dev:backend` - Start only backend
- `npm run dev:frontend` - Start only frontend
- `npm run install:all` - Install dependencies for root, backend, and frontend

## API Endpoints

### Health Check
```http
GET /api/health
```
Returns server health status.

### Single URL Lookup
```http
POST /api/crux/single
Content-Type: application/json

{
  "url": "https://example.com",
  "formFactor": "PHONE" // Optional: PHONE, DESKTOP, TABLET
}
```

### Multiple URL Lookup
```http
POST /api/crux/multiple
Content-Type: application/json

{
  "urls": [
    "https://example1.com",
    "https://example2.com"
  ],
  "formFactor": "PHONE" // Optional
}
```

## Development Workflow

### Current Status
- ✅ Documentation complete
- ✅ TODO tracking files created
- 🔄 Backend implementation in progress
- ⏳ Frontend implementation pending

### Task Tracking
Check the following files in `.docs/` for detailed progress:
- [backend-todos.md](.docs/backend-todos.md) - Backend checklist
- [frontend-todos.md](.docs/frontend-todos.md) - Frontend checklist
- [future-enhancements.md](.docs/future-enhancements.md) - Bonus features

## Testing

### Manual API Testing
Use curl or Postman to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Single URL
curl -X POST http://localhost:5000/api/crux/single \
  -H "Content-Type: application/json" \
  -d '{"url": "https://developer.intuit.com"}'

# Multiple URLs
curl -X POST http://localhost:5000/api/crux/multiple \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://developer.intuit.com", "https://quickbooks.intuit.com"]}'
```

## Known Limitations

1. **Data Availability**: CrUX only has data for URLs with sufficient Chrome user traffic
2. **Rate Limits**: Google APIs have rate limits (handled with queuing)
3. **Historical Data**: Current implementation shows latest data only (no historical trends)
4. **Form Factors**: Some URLs may not have data for all form factors (mobile/desktop/tablet)

## Contributing

This is a BrightEdge assignment project. Contributions are not currently accepted.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Chrome UX Report API Documentation](https://developer.chrome.com/docs/crux/api)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Documentation](https://expressjs.com/)

## Contact

For questions or issues, please refer to the project documentation in `.docs/`.

---

**Status:** ✅ Fullstack Application Complete with Filtering Features
**Last Updated:** 2025-11-01
