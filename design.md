esign.md</path>
<content of the codebase.># TravelLog - Design Document

## 1. System Architecture

### 1.1 Overview
TravelLog is a full-stack web application with a client-server architecture. The application follows a RESTful API design pattern and uses a MongoDB database for persistent storage.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  HTML/CSS/JS                        │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐ │    │
│  │  │  Index  │  │  Login  │  │  Styles (CSS)      │ │    │
│  │  └─────────┘  └─────────┘  └─────────────────────┘ │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐ │    │
│  │  │ Script  │  │  Utils  │  │  External Libs      │ │    │
│  │  └─────────┘  └─────────┘  └─────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Node.js/Express                     │    │
│  │  ┌──────────────┐  ┌──────────────┐                 │    │
│  │  │  Routes     │  │  Models      │                 │    │
│  │  │  /api/trips │  │  Trip        │                 │    │
│  │  │  /api/expenses│ │  Expense    │                 │    │
│  │  │  /api/photos │  │  Photo       │                 │    │
│  │  └──────────────┘  └──────────────┘                 │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  MongoDB                             │    │
│  │  ┌──────────────┐  ┌──────────────┐                 │    │
│  │  │   trips     │  │  expenses    │                 │    │
│  │  └──────────────┘  └──────────────┘                 │    │
│  │  ┌──────────────┐                                   │    │
│  │  │   photos    │                                   │    │
│  │  └──────────────┘                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest LTS | Runtime environment |
| Express.js | ^4.18.2 | Web framework |
| Mongoose | ^7.5.0 | MongoDB ODM |
| CORS | ^2.8.5 | Cross-origin resource sharing |
| Body-parser | ^1.20.2 | Request body parsing |

### 2.2 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Markup language |
| CSS3 | - | Styling |
| JavaScript (ES6+) | - | Client-side logic |
| Font Awesome | 6.4.0 | Icons (CDN) |
| jsPDF | 2.5.1 | PDF generation (CDN) |

### 2.3 Database
| Technology | Type | Purpose |
|------------|------|---------|
| MongoDB | Document | Primary database |
| Mongoose | ODM | Schema modeling |

---

## 3. Data Models

### 3.1 Trip Schema (MongoDB)
```
javascript
{
  name: String,        // Required - Trip name
  start: Date,         // Required - Start date
  end: Date,           // Required - End date
  schedule: String     // Optional - Itinerary/schedule
}
```

### 3.2 Expense Schema (MongoDB)
```
javascript
{
  description: String, // Required - Expense description
  amount: Number,      // Required - Expense amount
  category: String     // Required - Category (accommodation/food/transport/activities/shopping/other)
}
```

### 3.3 Photo Schema (MongoDB)
```
javascript
{
  src: String,         // Required - Base64 encoded image
  note: String         // Optional - Photo caption/note
}
```

### 3.4 Trip State (Frontend/LocalStorage)
```
javascript
{
  id: String,                    // Unique identifier
  name: String,                  // Trip name
  startDate: String,             // Start date (ISO format)
  endDate: String,                // End date (ISO format)
  destinations: String,          // Comma-separated destinations
  itinerary: String,             // Daily plan
  notes: String,                 // Notes & reminders
  budget: Number,                // Trip budget
  expenses: Array<Expense>,      // Array of expense objects
  photos: Array<Photo>,         // Array of photo objects
  coverPhoto: String|null,       // Cover photo (base64)
  offlineMode: Boolean,         // Offline mode flag
  shareOption: String,          // Privacy option (private/link/public)
  createdAt: String              // Creation timestamp
}
```

---

## 4. API Endpoints

### 4.1 Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | Fetch all trips |
| POST | `/api/trips` | Create new trip |

### 4.2 Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Fetch all expenses |
| POST | `/api/expenses` | Create new expense |

### 4.3 Photos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/photos` | Fetch all photos |
| POST | `/api/photos` | Create new photo |

---

## 5. User Interface Design

### 5.1 Page Structure

#### Login Page (login.html)
- Simple login form
- Stores authentication status in localStorage
- Redirects to index.html on successful login

#### Main Application (index.html)
```
┌─────────────────────────────────────────┐
│  HEADER                                 │
│  ┌─────────────────────────────────┐   │
│  │ Logo/Title    Profile Dropdown  │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  NAVIGATION                             │
│  [Feed] [My Trips]                      │
├─────────────────────────────────────────┤
│  MAIN CONTENT                           │
│  ┌─────────────────────────────────┐   │
│  │  Trip Cards Feed / My Trips    │   │
│  │  (Scrollable grid of trips)    │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  FAB (Floating Action Button)           │
│  [+]                                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  MODAL (Create/Edit Trip)               │
│  ┌─────────────────────────────────┐   │
│  │  [Planner] [Expenses] [Photos]  │   │
│  │  [AI Summary] [Settings]        │   │
│  ├─────────────────────────────────┤   │
│  │  Tab Content Area               │   │
│  └─────────────────────────────────┘   │
│  [Cancel]              [Save Trip]      │
└─────────────────────────────────────────┘
```

### 5.2 Visual Design

#### Color Palette
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary | #667eea | Main accent, buttons, links |
| Primary Dark | #5568d3 | Hover states |
| Secondary | #764ba2 | Gradients, accents |
| Success | #43e97b | Success states, positive indicators |
| Error | #f5576c | Error states, warnings |
| Background | #f5f7fa | Page background |
| Surface | #ffffff | Cards, modals |
| Text Primary | #2d3748 | Main text |
| Text Secondary | #718096 | Secondary text |

#### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | System UI | 1.5rem - 2rem | 700 |
| Body | System UI | 1rem | 400 |
| Small | System UI | 0.875rem | 400 |

#### Spacing System
- Base unit: 8px
- Common spacing: 8px, 16px, 24px, 32px
- CSS custom properties for consistent spacing

#### Visual Effects
- Box shadows: `0 4px 6px rgba(0, 0, 0, 0.1)`
- Border radius: 8px - 16px
- Gradient backgrounds: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Animations: Fade in, slide, transitions

### 5.3 Components

#### Trip Card
- Cover image (or default placeholder)
- Trip name
- Date range
- Duration badge
- Summary preview
- Stats (expenses, photos, expense count)

#### Modal Tabs
1. **Trip Planner**: Name, dates, destinations, itinerary, notes
2. **Expenses**: Budget, expense form, expense list, chart
3. **Photos**: Upload area, photo gallery
4. **AI Summary**: Generate button, summary display, export options
5. **Settings**: Offline mode, sharing options, cover photo

#### Expense Chart
- Horizontal bar chart
- Category labels with emojis
- Percentage and amount display

#### Toast Notifications
- Slide in from right
- Auto-dismiss after 3 seconds
- Success (green) / Error (red) variants

---

## 6. Application Flow

### 6.1 Authentication Flow
```
User opens login.html
    │
    ▼
Enter credentials (any input works for demo)
    │
    ▼
Set localStorage['loggedIn'] = 'true'
    │
    ▼
Redirect to index.html
    │
    ▼
Check localStorage on page load
    │
    ▼
If not logged in → Redirect back to login.html
```

### 6.2 Create Trip Flow
```
Click FAB (+)
    │
    ▼
Open modal, reset form
    │
    ▼
Fill Trip Planner tab
    │
    ▼
Switch to Expenses tab
    │
    ▼
Add expenses (optional)
    │
    ▼
Switch to Photos tab
    │
    ▼
Upload photos (optional)
    │
    ▼
Switch to AI Summary tab
    │
    ▼
Generate summary (optional)
    │
    ▼
Click Save Trip
    │
    ▼
Validate required fields
    │
    ▼
Save to localStorage['trips']
    │
    ▼
Close modal, refresh feed
```

### 6.3 Share Trip Flow
```
User selects sharing option in Settings
    │
    ▼
Generate base64 encoded trip data
    │
    ▼
Create URL with trip parameter
    │
    ▼
Copy link to clipboard
    │
    ▼
Recipient opens link
    │
    ▼
App detects trip parameter in URL
    │
    ▼
Load and display trip (view-only mode)
```

---

## 7. Key Functions

### 7.1 Frontend (script.js)
| Function | Purpose |
|----------|---------|
| `init()` | Initialize app, load trips, check URL |
| `showSection()` | Switch between main sections |
| `openCreateTripModal()` | Open trip creation modal |
| `closeModal()` | Close modal |
| `switchTab()` | Switch modal tabs |
| `addExpense()` | Add expense to current trip |
| `updateExpenseDisplay()` | Render expense list and chart |
| `handlePhotoFiles()` | Process uploaded photos |
| `generateSummary()` | Generate AI summary |
| `saveTrip()` | Save trip to localStorage |
| `renderFeed()` | Render trip cards in feed |

### 7.2 Utility Functions (utils.js)
| Function | Purpose |
|----------|---------|
| `formatDate()` | Format date to readable string |
| `formatCurrency()` | Format amount as USD currency |
| `calculateDaysBetween()` | Calculate trip duration |
| `compressImage()` | Compress image using Canvas API |
| `generateId()` | Generate unique ID |
| `showToast()` | Display toast notification |
| `generateAISummary()` | Create AI summary text and stats |
| `exportToPDF()` | Export trip to PDF file |
| `generateShareableLink()` | Create shareable URL |
| `loadTripFromURL()` | Parse trip from URL parameter |

---

## 8. File Structure

```
TravelLog/
├── server.js          # Express server and API routes
├── package.json       # Node.js dependencies
├── index.html         # Main application page
├── login.html         # Login page
├── styles.css         # Global styles
├── script.js          # Main application logic
├── utils.js           # Utility functions
├── requirements.md    # Requirements document
├── design.md          # Design document
└── node_modules/      # Installed dependencies
```

---

## 9. Security Considerations

### 9.1 Current Implementation (v1.0)
- Simple localStorage-based authentication (demo only)
- No password encryption
- No HTTPS (development)
- No input sanitization on server
- Base64 encoded URLs (not secure for sensitive data)

### 9.2 Recommended Improvements for Production
- Implement proper user authentication (JWT, OAuth)
- Use HTTPS/TLS
- Implement input validation and sanitization
- Add rate limiting
- Implement proper session management
- Store images in cloud storage (AWS S3, Cloudinary)
- Add CSRF protection
- Implement proper error handling

---

## 10. Performance Optimizations

### 10.1 Image Handling
- Compress images to max 1200px width
- Use JPEG format with 80% quality
- Lazy load images in gallery
- Use placeholder images for failed loads

### 10.2 Data Management
- Store trips in localStorage for offline access
- Use efficient data structures
- Limit photo storage (consider cloud storage for production)

### 10.3 Rendering
- Use CSS animations (GPU accelerated)
- Minimize DOM manipulations
- Use event delegation where applicable

---

## 11. Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Opera | 67+ |

---

## 12. Deployment

### 12.1 Development
```
bash
npm install
npm run dev    # Start with nodemon
```

### 12.2 Production
```
bash
npm install --production
npm start     # Start with node
```

### 12.3 Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| MONGODB_URI | mongodb://localhost:27017/travellog | MongoDB connection string |

---

## 13. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025 | Initial release with trip management, expense tracking, photo upload, AI summary, PDF export |

---

*Document Version: 1.0*
*Last Updated: 2025*
