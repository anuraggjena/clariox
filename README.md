
# ClarioX

### Intelligent Block-Based Writing Platform

ClarioX is a modern Notion-style block editor built with React and FastAPI.  
It supports structured rich text editing, auto-save with debounce, publishing workflow, and secure JWT authentication.

Deployed Frontend: [https://clariox-snowy.vercel.app](https://clariox-snowy.vercel.app)

Deployed Backend: [https://clariox.onrender.com](https://clariox.onrender.com)

----------

## 🚀 Features

### ✍️ Rich Text Editor (Lexical)

-   Paragraphs
    
-   H1 / H2
    
-   Bold, Italic, Underline
    
-   Bullet Lists
    
-   Numbered Lists
    
-   Text Alignment
    
-   Block-based architecture
    

### 💾 Smart Auto-Save

-   Debounced API saving
    
-   Prevents unnecessary network calls
    
-   Save indicator (Saving / Saved)
    
-   Manual Save button available
    

### 🔐 Authentication

-   JWT-based authentication
    
-   Secure password hashing (bcrypt)
    
-   Protected routes
    
-   Persistent login state
    

### 📝 Publishing System

-   Draft / Published status
    
-   Toggle publish/unpublish
    
-   Status badge in dashboard
    
-   Persistent state across reloads
    

### 🗑 Post Management

-   Create draft
    
-   Edit post
    
-   Delete with confirmation dialog
    
-   Empty state UI when no drafts exist
    

### 🧠 Clean State Management

-   Zustand store
    
-   Editor reset when switching posts
    
-   Prevents cross-document state bleed
    
-   Stable content loading lifecycle
   

## 🏗 Architecture Overview

### Frontend (Vite + React)

-   React 18
    
-   TypeScript
    
-   Tailwind CSS
    
-   shadcn/ui
    
-   Zustand (state management)
    
-   Lexical (block editor engine)
    
-   Axios (API communication)
    
-   React Router
    

### Backend (FastAPI)

-   FastAPI
    
-   SQLAlchemy ORM
    
-   SQLite database
    
-   Pydantic v2
    
-   JWT authentication
    
-   CORS middleware
    
-   bcrypt password hashing
    

### Deployment

-   Frontend → Vercel
    
-   Backend → Render
    
-   Database → SQLite (file-based on Render)


## 📂 Project Structure (Monorepo)

```
clariox/
│
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand state management
│   │   ├── services/          # Axios API client
│   │   └── types/             # TypeScript types
│   │
│   └── vite.config.ts         # Vite configuration
│
└── backend/                   # FastAPI Backend
    ├── app/
    │   ├── routes/            # Auth & Post endpoints
    │   ├── core/              # Security & dependencies
    │   ├── models.py          # SQLAlchemy models
    │   ├── schemas.py         # Pydantic schemas
    │   └── main.py            # FastAPI entry point
    │
    └── requirements.txt       # Python dependencies
```

----------

## 🔧 Local Setup

### Clone Repository

`git clone https://github.com/anuraggjena/clariox.git`

`cd clariox`

### Backend

`cd backend`

`python -m venv venv`

`venv\Scripts\activate`

`pip install -r requirements.txt`

`uvicorn app.main:app --reload` 

### Frontend

`cd frontend`

`npm install`

`npm run dev` 


## 💾 Auto-Save Logic Explanation

The editor implements a debounced auto-save mechanism to prevent excessive API calls while maintaining real-time persistence.

### 🔄 Flow

1.  User edits content in Lexical editor
    
2.  `OnChangePlugin` updates Zustand store
    
3.  `useAutoSave` hook watches `title` and `content`
    
4.  A debounce timer (e.g., 800ms) is triggered
    
5.  If no further changes occur before timeout:
    
    -   `PATCH /api/posts/{id}` is sent
        
6.  Backend updates database
    
7.  Save status updates in UI (`Saving → Saved`)
    

----------

### 🧠 Why Debounce?

Without debounce:

-   Every keystroke would trigger an API request.
    
-   This causes unnecessary network traffic.
    
-   It may overload the backend.
    

With debounce:

-   API is called only after user pauses typing.
    
-   Improves performance.
    
-   Reduces server load.
    
-   Creates a smoother UX.
    

----------

### 🛡 Additional Safeguards

-   `lastSavedHash` prevents duplicate saves.
    
-   Manual "Save" button allows forced persistence.
    
-   Editor state resets when switching posts to prevent state leakage.
    

This ensures both performance efficiency and data integrity.


## 🌍 Production Notes

-   Render free tier may sleep after inactivity.
    
-   First API request may take 30–40 seconds.
    
-   SQLite is used for simplicity in deployment.


## 🗄 Database Schema Design Rationale

The database schema was intentionally designed to support structured rich text content and scalable post management.

## 📌 Core Tables

### Users Table

```
Field				Purpose

`id`				Primary key

`email`				Unique identifier

`hashed_password`	Secure authentication

`created_at`		Audit tracking timestamp
```

### Posts Table
```
Field				Purpose

id					Primary key

user_id				Foreign key (ownership)

title				Post title

content				JSON structure (Lexical format)

status				draft / published

created_at			Creation timestamp

updated_at			Auto-updated timestamp
```
## 🧠 Why Store Content as JSON?

Lexical editor produces structured JSON instead of plain text or HTML.

Storing JSON:

-   Preserves block structure (headings, lists, formatting)
    
-   Allows future extensibility (AI processing, analytics)
    
-   Avoids fragile HTML parsing
    
-   Maintains editor fidelity across sessions
    

Example stored structure:
```
`{  "root":  
	{  "type":  "root",  
		"children":  [ 
		 {  
			"type":  "paragraph",  
			"children":  [...]  
			} 
		 ]  
	}  
 }` 
```


## 🧱 Why SQLite?

-   Lightweight and simple for deployment
    
-   No external database dependency
    
-   Ideal for small-to-medium scale apps
    
-   Perfect for assignment scope
    

In a production-scale environment, PostgreSQL would be recommended.


## 🔐 Why JWT-Based Auth?

-   Stateless authentication
    
-   Scalable
    
-   No server-side session storage
    
-   Secure API protection via Authorization header
    


## ✅ Why This Design Works Well

-   Clean separation of concerns
    
-   Structured rich text storage
    
-   Efficient auto-save architecture
    
-   Secure authentication model
    
-   Production-ready full-stack deployment
    
-   Monorepo maintainability

## 🎯 Demo Flow

1.  Register new account
    
2.  Login
    
3.  Create new draft
    
4.  Edit content
    
5.  Observe auto-save indicator
    
6.  Publish post
    
7.  Return to dashboard
    
8.  See status badge
    
9.  Delete post with confirmation
    

## 🧠 Technical Decisions

-   Lexical chosen for flexible block-based editing.
    
-   Zustand used for lightweight predictable state.
    
-   Debounce implemented to reduce API pressure.
    
-   JWT used for stateless authentication.
    
-   SQLite chosen for simplicity in cloud deployment.
    
-   Monorepo structure for unified development.
    

----------

## ⚠️ Known Limitations

-   SQLite not ideal for high-scale production.
    
-   Render free tier has cold start delay.
    
-   Lists toggle removes entire list (intentional simplification).
    

----------

## 👨‍💻 Author

Anurag Jena  
Full Stack Developer
