import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseList from "./pages/CourseList";
import CourseDetails from "./pages/CourseDetails";
import StudentDashboard from "./pages/StudentDashboard";
import { getStudentId } from "./studentId";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./Store";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStudent = async () => {
      await getStudentId(); // Ensure student exists before proceeding
      setLoading(false);
    };

    initializeStudent();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Prevent rendering before studentId exists
  }

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
