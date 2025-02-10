# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Course App 🎓

This is a React + Firebase-based Course Management Application.

## Features 🚀
- Course Listing Page (Search by instructor and course name)
- Course Details Page
- Student Dashboard (Progress Bar for enrolled courses)
- Like & Enroll functionality
- Real-time updates using Firebase
- ## firbase
- In firebase i manually created two collections , courses and students.
- courses has the following fields(completion(timestamp),description(string),duration(number),enrollment_status(string),instructor(string),likes(number),location(string),name(string),prerequisites(string),schedule(string),syllabus(array of maps of content(string),topic(string),week(number)),thumbnail(string)).
- students has the following fields(enrolledCourses(array of courseId's), likedCourses(array of courseId's which are liked)).

## Installation & Setup 🛠
1. Clone the repository:
git clone https://github.com/krish-gupta53/Course-app.git cd Course-app

2. Install dependencies:

3. Create a `.env` file and add Firebase credentials:
VITE_API_KEY=your_api_key ,VITE_AUTH_DOMAIN=your_auth_domain, VITE_PROJECT_ID=your_project_id VITE_STORAGE_BUCKET=your_storage_bucket ,VITE_MESSAGING_SENDER_ID=your_messaging_sender_id, VITE_APP_ID=your_app_id, VITE_MEASUREMENT_ID=your_measurement_id

4. Run the app:
npm run dev

5. Open the app in the browser:
http://localhost:5173
