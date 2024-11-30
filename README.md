
# Collabor8
An intuitive and efficient platform designed to enhance team collaboration through streamlined task management, resource sharing, version control, and real-time updates.

## Getting Started  

### Clone the Repository  
```bash  
git clone https://github.com/Miran-Firdausi/H2H-Collabor8.git
```  

### Install Dependencies  
Navigate to frontend:  
```bash
cd frontend 
npm install  
```
Navigate to backend directory: 
```bash
cd backend  
python -m venv venv  
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`  
pip install -r requirements.txt  
```
### Start the Development Server  
Start frontend:  
```bash
cd frontend  
npm run dev  
```  
Start backend: 
```bash
cd backend  
python manage.py makemigrations  
python manage.py migrate  
python manage.py runserver  
```
---

### Pages  
- **Home**: [http://localhost:5173/](http://localhost:5173/)
- **Login**: [http://localhost:5173/login](http://localhost:5173/login)
- **Signup**: [http://localhost:5173/signup](http://localhost:5173/signup)
- **Projects**: [http://localhost:5173/projects](http://localhost:5173/projects)  
- **Todo**: [http://localhost:5173/todo](http://localhost:5173/todo)  
- **Board**: [http://localhost:5173/board](http://localhost:5173/board)  
- **Calendar**: [http://localhost:5173/calendar](http://localhost:5173/calendar)  
- **Github**: [http://localhost:5173/gitboard](http://localhost:5173/gitboard)  
- **Profile**: [http://localhost:5173/profile](http://localhost:5173/profile)
---

## Features  
 
- **Projects**: Effortlessly manage and access all your projects in one place.
- **Todo**: Create tasks, search and sort them, and seamlessly update task statuses between "To-Do," "In Progress," and "Completed."
- **Sticky Board**: Organize ideas visually with the ability to create, edit, and delete sticky 
- **Github Repository Dashboard**: Interact with repositories directly, fetch and create repositories, and manage pull requests with ease.
- **Calendar**: Stay on top of deadlines by viewing assigned tasks and important dates in a unified calendar view.
- **Profile**: Track achievements with badges, update personal details, change your password, and log out securely.

---

## Tech Stack  
- **Frontend**: React JS.  
- **Backend**: Django.  
- **APIs**: GitHub, Gemini.  

---

## Project Structure  
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

## Connect  
Reach out to us for any questions or suggestions!  
- **GitHub**: [Miran-Firdausi](https://github.com/Miran-Firdausi)  

---
