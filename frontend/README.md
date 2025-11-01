# Web Vitals Dashboard - Frontend

A modern React application built with TypeScript, Material-UI, and TanStack Query for analyzing Chrome UX Report performance metrics.

## ✅ Features Implemented

### Part 1: Basic Functionality
- ✅ Single URL input with validation
- ✅ Form factor selection (Mobile/Desktop/Tablet)
- ✅ Real-time performance metrics display
- ✅ Chrome UX Report API integration

### Part 2: Data Manipulation
- ✅ Sortable data table (all columns)
- ✅ Color-coded performance indicators (Green/Orange/Red)
- ✅ Tooltips with metric descriptions
- ✅ Responsive table design

### Part 3: Multi-URL Support
- ✅ Multiple URL input (up to 10 URLs)
- ✅ Parallel data fetching with React Query
- ✅ Summary statistics with averages
- ✅ Success/failure tracking

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at **http://localhost:5173**

**Note:** Make sure the backend API is running on http://localhost:5000

## 📦 Technology Stack

- **React 19.2.0** - Latest React with React Compiler
- **TypeScript 5.9.3** - Full type safety
- **Vite** - Lightning-fast build tool
- **Material-UI (MUI)** - Professional component library
- **TanStack Query** - Smart data fetching & caching
- **Axios** - HTTP client

## 🎯 How to Use

### Single URL Analysis
1. Enter URL: `https://example.com`
2. Select device type (optional)
3. Click **Search**
4. View performance metrics in table
5. Sort by any column

### Multiple URLs Comparison
1. Switch to **"Multiple URLs Comparison"** tab
2. Enter URLs (one per line):
   ```
   https://example1.com
   https://example2.com
   https://example3.com
   ```
3. Click **Analyze All**
4. View summary statistics and individual results

## 📊 Performance Metrics

| Metric | Full Name | Good | Needs Improvement | Poor |
|--------|-----------|------|-------------------|------|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FCP** | First Contentful Paint | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| **CLS** | Cumulative Layout Shift | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **FID** | First Input Delay | ≤ 100ms | 100ms - 300ms | > 300ms |
| **INP** | Interaction to Next Paint | ≤ 200ms | 200ms - 500ms | > 500ms |
| **TTFB** | Time to First Byte | ≤ 600ms | 600ms - 1200ms | > 1200ms |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI components
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorDisplay.tsx
│   │   └── features/            # Feature components
│   │       ├── URLInput.tsx
│   │       ├── MultiURLInput.tsx
│   │       ├── DataTable.tsx
│   │       └── SummaryStatistics.tsx
│   ├── hooks/                   # React Query hooks
│   │   └── useWebVitals.ts
│   ├── services/                # API services
│   │   └── api.ts
│   ├── types/                   # TypeScript definitions
│   │   └── webVitals.ts
│   ├── utils/                   # Helper functions
│   │   └── metrics.ts
│   ├── styles/                  # Material-UI theme
│   │   └── theme.ts
│   ├── App.tsx                  # Main component
│   └── main.tsx                 # Entry point
├── .env                         # Environment variables
└── package.json
```

## 🔧 Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## 🎨 Features Highlights

### React Query Integration
- Automatic caching (5 min stale time)
- Smart background refetching
- Built-in loading/error states
- DevTools for debugging

### Material-UI Theme
- Custom color palette
- Performance category colors:
  - 🟢 Green (Good)
  - 🟠 Orange (Needs Improvement)
  - 🔴 Red (Poor)
- Responsive design
- Professional typography

### TypeScript
- Full type safety
- IntelliSense support
- Compile-time error checking

## 🐛 Troubleshooting

**Backend connection error:**
- Ensure backend is running: `cd ../backend && npm run dev`
- Check `.env` has correct `VITE_API_BASE_URL`

**Port already in use:**
- Vite will automatically use next available port

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Resources

- [Chrome UX Report API](https://developer.chrome.com/docs/crux/api)
- [Material-UI Docs](https://mui.com/)
- [TanStack Query](https://tanstack.com/query/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Built with React, TypeScript, and Material-UI** 🚀
