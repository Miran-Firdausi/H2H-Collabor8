# Collabor8  

An intuitive and efficient platform designed to enhance team collaboration by streamlining task management, resource sharing, version control, and real-time updates.  

---

## 🚀 **Getting Started**  

### 📂 Clone the Repository  
```bash  
git clone https://github.com/Miran-Firdausi/H2H-Collabor8.git  
```  

### 📦 Install Dependencies  
#### Frontend:  
```bash
cd frontend 
npm install  
```  

#### Backend:  
```bash
cd backend  
python -m venv venv  
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`  
pip install -r requirements.txt  
```  

### ▶️ Start the Development Server  
#### Start Frontend:  
```bash
cd frontend  
npm run dev  
```  

#### Start Backend:  
```bash
cd backend  
python manage.py makemigrations  
python manage.py migrate  
uvicorn collabor8.asgi:application --reload  
```  

---

## 🌐 **Pages**  
| **Page**      | **Description**                                   | **URL**                                  |  
|----------------|---------------------------------------------------|------------------------------------------|  
| **Home**       | Landing page showcasing Collabor8 features       | [http://localhost:5173/](http://localhost:5173/) |  
| **Login**      | Secure user login                                | [http://localhost:5173/login](http://localhost:5173/login) |  
| **Signup**     | Create a new account                             | [http://localhost:5173/signup](http://localhost:5173/signup) |  
| **Projects**   | Manage and access all projects in one place      | [http://localhost:5173/projects](http://localhost:5173/projects) |  
| **Todo**       | Organize and track tasks effectively             | [http://localhost:5173/todo](http://localhost:5173/todo) |  
| **Board**      | Visualize and manage ideas using sticky notes    | [http://localhost:5173/board](http://localhost:5173/board) |  
| **Calendar**   | Unified calendar view of deadlines and tasks     | [http://localhost:5173/calendar](http://localhost:5173/calendar) |  
| **GitHub**     | Git repository management and interactions       | [http://localhost:5173/gitboard](http://localhost:5173/gitboard) |  
| **Profile**    | Update details, track achievements, and log out  | [http://localhost:5173/profile](http://localhost:5173/profile) |  

---

## ✨ **Features**  

- **Projects Management**: Effortlessly manage and access all projects in a centralized location.  
- **Todo List**: Create, search, and sort tasks, and update their statuses between "To-Do," "In Progress," and "Completed."  
- **Sticky Board**: Visualize and organize ideas with sticky notes. Create, edit, and delete notes with ease.  
- **GitHub Repository Dashboard**: Fetch repositories, create repositories, and manage pull requests directly from the app.  
- **Calendar View**: Stay organized by tracking deadlines and events in an intuitive calendar interface.  
- **Profile Management**: Track your achievements, earn badges, and update personal details.  
- **Real-Time Chats**: Enjoy individual, group, and video chat functionality with time-stamped messages.  
- **File Sharing**: Upload and collaborate on project-related files, including real-time editing of documents like Figma files.  

---

## 🛠️ **Tech Stack**  

- **Frontend**: React JS (Vite for blazing-fast builds).  
- **Backend**: Django (ASGI support for real-time updates).  
- **APIs**: GitHub API, Gemini API.  

---

## 📂 **Project Structure**  
```plaintext  
H2H-Collabor8/
├── backend/                 # Backend directory
│   ├── accounts/            # Account management app
│   ├── auth/                # Authentication app
│   ├── collabor8/           # Django project configuration
│   ├── dist/                # Deployment files
│   ├── task_automation/     # Task automation functionality
│   ├── templates/           # HTML templates
│   ├── users/               # User management app
│   ├── venv/                # Python virtual environment
│   ├── .env                 # Backend environment variables
│   ├── db.sqlite3           # SQLite database
│   ├── manage.py            # Django management script
│   └── requirements.txt     # Backend dependencies

├── frontend/                # Frontend directory
│   ├── node_modules/        # Frontend dependencies
│   ├── public/              # Public assets
│   ├── src/                 # Frontend source code
│   │   ├── actions/         # App actions
│   │   ├── components/      # UI components
│   │   ├── contexts/        # Global state contexts
│   │   ├── reducers/        # State reducers
│   │   ├── routes/          # Application routes
│   │   ├── pages/           # App pages
│   │   ├── assets/          # Static assets
│   ├── .env                 # Frontend environment variables
│   ├── eslint.config.js     # ESLint configuration
│   ├── .gitignore           # Git ignored files
│   ├── vite.config.js       # Vite configuration
│   ├── package.json         # Frontend dependencies
│   └── package-lock.json    # Locked dependency versions

├── README.md                # Project documentation
├── .env                     # General environment variables
└── .gitignore               # Git ignore rules
```  

---

## 🤝 **Connect**  
Have questions or suggestions? We'd love to hear from you!  

- **GitHub**: [Miran-Firdausi](https://github.com/Miran-Firdausi)  
- **Email**: miranfirdausi027@gmail.com  

---  
