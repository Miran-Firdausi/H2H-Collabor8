
# Collabor8
A powerful and user-friendly platform to streamline team collaboration with task management, resource sharing, version control, and real-time updates.  

## ⚙️ Getting Started  

### 1️⃣ Clone the Repository  
```bash  
git clone https://github.com/Miran-Firdausi/H2H-Collabor8.git
```  

### 2️⃣ Install Dependencies  
Run the following command in the project directory:  
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
### 3️⃣ Start the Development Server  
Run the app locally:  
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
The app will be accessible at [http://localhost:5173/](http://localhost:5173/).  

---
## 🌐 URL Paths

### User Interface  
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

## 🚀 Features  
 
- **Projects**: Manage and access all projects.
- **Todo**: Generate tasks, search and sort tasks, update task status between todo, in progress and completed. 
- **Sticky Board**: Create, edit and delete sticky notes. 
- **Github Repository Dashboard**: Fetch and create repositories, open pull requests etc. 
- **Calendar**: View assigned tasks and deadlines.  
- **Profile**: View badges, update details, change password and logout.  

---

## 🛠️ Tech Stack  
- **Frontend**: React JS.  
- **Backend**: Django.  
- **APIs**: GitHub, Gemini.  

---

## 📂 Project Structure  
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
│   ├── dist/                # Deployment build files
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

## 🌟 Features Breakdown  

### 📊 Dashboard  
- Displays an overview of productivity, tasks, and recent repositories.  

### 📂 Version Control and Collaboration  
- GitHub integration provides a user-friendly interface for version control, suitable for all user levels.
- 
### 📅 Task & Deadline Management  
- Supports Scrum, Kanban, and Gantt methodologies with customizable templates for flexible task visualization.
- Task dependencies ensure proper sequencing, with intelligent task suggestions to enhance productivity.
  
### 🗓️ Calendar Integration  
- Google Calendar sync for tracking project deadlines and tasks.

### 💬 Creative Collaboration
- Seamless integration with tools like Figma and Google Sheets for centralized resource management.
---


## 🤝 Contributing  
Contributions are welcome! To contribute:  
1. Fork the repository.  
2. Create a feature branch (`git checkout -b feature-name`).  
3. Commit your changes (`git commit -m "Add new feature"`).  
4. Push to the branch (`git push origin feature-name`).  
5. Open a Pull Request.
   
---

## 💬 Connect  
Have questions or suggestions? Feel free to reach out!  
- **GitHub**: [Miran-Firdausi](https://github.com/Miran-Firdausi)  

---

**Built with ❤️ by Collabor8 Developers.**
