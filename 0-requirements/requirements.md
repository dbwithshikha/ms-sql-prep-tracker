# DevOps Learning Tracker

A responsive, modern static website to track and manage DevOps learning progress.

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data**: JSON-based learning path structure
- **Deployment**: Static hosting (no backend required)

## Features

### 1. User Interface ✅
- ✅ **Hero Banner**: Landing page with welcoming banner text "Welcome, Deepshikha!"
- ✅ **Responsive Design**: Mobile-first, works seamlessly across all devices (mobile, tablet, desktop)
- ✅ **Modern Aesthetics**: Clean, professional UI with intuitive navigation and smooth transitions

### 2. Layout ✅
- ✅ **Left Sidebar Navigation**: Dynamically loads all 7 categories with icons
- ✅ **Center Panel**: Displays category title and description
- ✅ **Right Content Area**: Displays learning topics in responsive grid layout
- ✅ **Progress Tracking**: Checkboxes next to each subtopic to mark completion status
- ✅ **Progress Dashboard**: Real-time progress stats with visual progress bar

### 3. Data Management ✅
- ✅ **Import Functionality**: Load custom learning paths via JSON file upload
- ✅ **Export Functionality**: Download current progress and learning path as JSON with timestamp
- ✅ **Persistent Storage**: Save progress locally using browser localStorage
- ✅ **Dynamic Category Loading**: Automatically discovers all categories from JSON

### 4. Theming ✅
- ✅ **Dark/Light Mode Toggle**: Theme switcher in UI for user preference
- ✅ **Persistent Theme**: Remember user's theme choice across sessions
- ✅ **CSS Variables**: Modern theming system with consistent color palette

## Supported Categories ✅
- ✅ **MS_SQL** (30 phases with detailed subtopics)
- ✅ **ORACLE** (35 phases with detailed subtopics)
- ✅ **SSIS** (23 phases with detailed subtopics)
- ✅ **SSRS** (17 phases with detailed subtopics)
- ✅ **AWS_CLOUD** (40 phases with detailed subtopics)
- ✅ **AI** (25 phases with detailed subtopics)
- ✅ **AI_in_DBA** (30 phases with detailed subtopics)

## File References
- ✅ Data Source: `data/topics.json` (fully implemented with 7 categories)
- Backup Format: `topics.csv` (optional)

## User Stories - All Completed ✅
- ✅ As a learner, I want to see all DB/Cloud/AI topics organized hierarchically by category
- ✅ As a user, I want to track my progress with visual indicators (checkboxes and progress bar)
- ✅ As a planner, I want to export my learning progress for backup (JSON export with timestamp)
- ✅ As a customizer, I want to import my own learning paths (custom JSON file upload)
- ✅ As a mobile user, I want a responsive interface that works on all devices
- ✅ As a power user, I want dark mode support with persistent preferences

### Technical Stack - Implementation Complete ✅
- ✅ Frontend: HTML5, CSS3, JavaScript (ES6+)
- ✅ Data: JSON-based structure (7 categories, 200+ phases)
- ✅ Storage: Browser localStorage for persistence
- ✅ Architecture: No backend required, fully static
- ✅ Responsive: Mobile-first design with media queries for all breakpoints
- ✅ Grid Layout: Auto-responsive topic cards (300px minimum width)
- ✅ Accessibility: Proper semantic HTML, ARIA labels, keyboard navigation

## Project Structure
```
ms-sql-prep-tracker/
├── 0-requirements/
│   └── requirements.md (this file)
├── data/
│   └── topics.json (7 categories, 200+ phases)
└── app/
    ├── index.html (main application)
    ├── styles.css (responsive design with dark mode)
    └── app.js (dynamic functionality)
```

## Deployment
The `app/` folder is ready for deployment to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any web server serving static files

Simply copy the contents of the `app/` folder to your hosting service.

## Implementation Notes
- All topics are loaded dynamically from `topics.json`
- Progress is stored in browser localStorage with automatic sync
- Export includes all progress data and can be imported back
- Theme preference persists across sessions
- Mobile sidebar collapses on screens < 768px width
- Tested responsive behavior across mobile, tablet, and desktop viewports