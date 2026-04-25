# Super Reddit: Full-Stack Social Networking Platform

A comprehensive, Reddit-like social networking platform featuring communities, threaded discussions, real-time-like voting, and image support. This project was developed as a college DBMS assignment to demonstrate advanced database design, asynchronous backend processing, and modern frontend architecture.

## Tech Stack

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous ASGI)
- **ORM**: [SQLModel](https://sqlmodel.tiangolo.com/) (SQLAlchemy + Pydantic hybrid)
- **Database**: **MySQL** (using `aiomysql` for async I/O)
- **Auth**: [python-jose](https://github.com/mpdavis/python-jose) (JWT) & [passlib](https://passlib.readthedocs.io/) (Bcrypt)
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)

### **Frontend**
- **Framework**: [React](https://reactjs.org/) (Vite + TypeScript)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Feather icons)
- **Styling**: Vanilla CSS with modern flexbox/grid layouts.
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## Project Structure

```bash
dbms-proj/
├── client/             
│   ├── src/
│   │   ├── api/        
│   │   ├── components/ 
│   │   ├── pages/      
│   │   ├── types/      
│   │   └── utils/      
│   └── Feed.css        
│
└── server/             
    ├── src/
    │   ├── auth/       
    │   ├── communities/
    │   ├── posts/      
    │   ├── comments/   
    │   ├── users/      
    │   ├── core/       
    │   └── dependencies
    ├── migrations/     
    └── docs/           
```

---

## Setup & Installation

### **1. Prerequisites**
- Python 3.10+
- Node.js 22+
- MySQL Server

### **2. Backend Setup**
```bash
cd server
python -m venv venv
.//venv/Scripts/activate  # On Windows
pip install -r requirements.txt
```
Create a `.env` file in the `server` directory:
```env
DB_URL=mysql+aiomysql://root:password@localhost:3306/db_name
JWT_SECRET=your_super_secret_key
JWT_ALGORITHM=HS256
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
Run the server:
```bash
uvicorn src.main:app --reload
```

### **3. Frontend Setup**
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://127.0.0.1:8000
```
Run the client:
```bash
npm run dev
```