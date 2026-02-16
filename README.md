
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
    

## 📐 System Architecture

`Client (Browser)
       ↓
Frontend (Vercel - React + Vite)
       ↓ 
REST API (Render - FastAPI)
       ↓
SQLite Database` 

Authentication Flow:

`Register/Login 
      ↓
JWT Token Issued
      ↓
Stored in localStorage
      ↓
Attached to API requests (Authorization: Bearer token)` 

Auto-save Flow:

`Editor Change
     ↓
Zustand State Update 
     ↓
Debounce Timer
     ↓
PATCH /api/posts/{id}
     ↓ 
Database  Update` 


## 📂 Project Structure (Monorepo)

`clariox/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   └── types/
│   └── vite.config.ts │
└── backend/
    ├── app/
    │   ├── routes/
    │   ├── models.py 
    │   ├── schemas.py 
    │   ├──  core/
    │   ├──  services/
    │   └── main.py 
    └── requirements.txt` 

----------

## 🔧 Local Setup

### Backend

`cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload` 

### Frontend

`cd frontend
npm install
npm run dev` 



## 🌍 Production Notes

-   Render free tier may sleep after inactivity.
    
-   First API request may take 30–40 seconds.
    
-   SQLite is used for simplicity in deployment.

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