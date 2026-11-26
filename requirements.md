# TravelLog - Requirements Document

## 1. Project Overview

**Project Name:** TravelLog
**Project Type:** Web Application (Full-Stack)
**Core Functionality:** A travel management platform that allows users to document, track, and share their travel adventures including trips, expenses, and photos with AI-powered summaries.
**Target Users:** Travelers who want to document and manage their travel experiences in one place.

---

## 2. Functional Requirements

### 2.1 Authentication
- [ ] Simple login system using localStorage
- [ ] Logout functionality that clears session
- [ ] Redirect to login page if not authenticated

### 2.2 Trip Management
- [ ] Create new trips with:
  - Trip name (required)
  - Start date (required)
  - End date (required)
  - Destinations (optional, comma-separated)
  - Itinerary/Daily plan (optional, textarea)
  - Notes & reminders (optional, textarea)
- [ ] View all trips in a feed format
- [ ] View all user's trips in "My Trips" section
- [ ] Upload cover photo for trips
- [ ] Calculate trip duration automatically
- [ ] Sort trips by creation date (newest first)

### 2.3 Expense Tracking
- [ ] Set trip budget (optional)
- [ ] Add expenses with:
  - Description (required)
  - Amount (required, numeric)
  - Category (required, dropdown)
- [ ] Expense categories:
  - Accommodation
  - Food & Dining
  - Transportation
  - Activities
  - Shopping
  - Other
- [ ] View expense list for each trip
- [ ] Calculate total expenses automatically
- [ ] Display budget warning when over budget
- [ ] Visual expense chart showing spending by category
- [ ] Delete/remove expenses

### 2.4 Photo Management
- [ ] Upload multiple photos (drag & drop or file browser)
- [ ] Support image formats: JPEG, PNG, GIF, etc.
- [ ] Compress images before storing (max width: 1200px, quality: 80%)
- [ ] Store photos as base64 strings
- [ ] Add captions to photos
- [ ] Display photo gallery for each trip
- [ ] Use first photo as cover if no cover photo set

### 2.5 AI Summary Generation
- [ ] Generate AI-powered trip summary
- [ ] Summary includes:
  - Trip overview
  - Duration analysis
  - Spending breakdown
  - Top spending category
  - Average daily spend
  - Photo count
  - Destination count
  - Highlights from itinerary
- [ ] Display statistics cards
- [ ] Copy summary to clipboard
- [ ] Export summary to PDF

### 2.6 Sharing & Settings
- [ ] Privacy options:
  - Private (only user can see)
  - Anyone with link can view
  - Public (visible to everyone)
- [ ] Generate shareable link (base64 encoded in URL)
- [ ] Load trip from shared URL
- [ ] Enable offline mode (localStorage)
- [ ] Cover photo selection

### 2.7 User Interface
- [ ] Responsive design (mobile-friendly)
- [ ] Floating particles background animation
- [ ] Navigation with sections: Feed, My Trips
- [ ] Profile dropdown with:
  - Profile link
  - Settings link
  - Logout
- [ ] Floating action button (FAB) to create new trip
- [ ] Modal dialog for trip creation/editing
- [ ] Tabbed interface in modal:
  - Trip Planner
  - Expenses
  - Photos
  - AI Summary
  - Settings
- [ ] Toast notifications for user feedback
- [ ] Date formatting (readable format)
- [ ] Currency formatting (USD)

---

## 3. Technical Requirements

### 3.1 Backend (Node.js/Express)
- [ ] RESTful API endpoints:
  - GET /api/trips - Fetch all trips
  - POST /api/trips - Create new trip
  - GET /api/expenses - Fetch all expenses
  - POST /api/expenses - Create new expense
  - GET /api/photos - Fetch all photos
  - POST /api/photos - Create new photo
- [ ] MongoDB connection using Mongoose
- [ ] CORS enabled for cross-origin requests
- [ ] Body parser for JSON data
- [ ] Serve static files from root directory

### 3.2 Database (MongoDB)
- [ ] Trip collection schema:
  - name: String
  - start: Date
  - end: Date
  - schedule: String
- [ ] Expense collection schema:
  - description: String
  - amount: Number
  - category: String
- [ ] Photo collection schema:
  - src: String (base64)
  - note: String

### 3.3 Frontend
- [ ] Vanilla JavaScript (no framework)
- [ ] LocalStorage for data persistence
- [ ] Image compression using Canvas API
- [ ] PDF generation using jsPDF library
- [ ] Font Awesome icons
- [ ] CSS custom properties for theming
- [ ] Responsive CSS with media queries

### 3.4 External Dependencies
- express: ^4.18.2
- mongoose: ^7.5.0
- cors: ^2.8.5
- body-parser: ^1.20.2
- nodemon (dev): ^3.0.1
- Font Awesome 6.4.0 (CDN)
- jsPDF 2.5.1 (CDN)

---

## 4. Non-Functional Requirements

### 4.1 Performance
- [ ] Image compression to reduce storage size
- [ ] Lazy loading for images where applicable
- [ ] Efficient DOM manipulation

### 4.2 User Experience
- [ ] Intuitive modal-based interface
- [ ] Clear visual feedback (toast notifications)
- [ ] Responsive design for all screen sizes
- [ ] Accessible color contrast

### 4.3 Maintainability
- [ ] Clean code structure
- [ ] Modular functions in separate files
- [ ] Clear naming conventions

---

## 5. Future Enhancements (Out of Scope for v1.0)
- User authentication system with database
- Cloud storage for photos
- Real-time sync across devices
- Social features (follow other travelers)
- Trip sharing with comments
- Map integration
- Travel itinerary planning with maps
- Currency conversion
- Multi-language support
- Push notifications
- Mobile app version

---

## 6. Acceptance Criteria

1. ✅ User can log in and access the main application
2. ✅ User can create a new trip with all required fields
3. ✅ User can add expenses to a trip with categories
4. ✅ User can upload and view photos
5. ✅ User can generate AI summary of a trip
6. ✅ User can export trip data to PDF
7. ✅ User can set privacy options for trips
8. ✅ User can view all trips in feed and My Trips section
9. ✅ User can log out and return to login page
10. ✅ Application is responsive and works on mobile devices
