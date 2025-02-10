import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs, query, where } from "firebase/firestore";
import { documentId } from "firebase/firestore";

import {CourseProgress} from "./CourseProgress"
const StudentDashboard = () => {
  const enrolledCourseIds = useSelector((state) => state.enrolledCourses.enrolledCourses); // Get enrolled course IDs from Redux
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (enrolledCourseIds.length === 0) return;

      try {
        const q = query(collection(db, "courses"), where(documentId(), "in", enrolledCourseIds));
 
        const querySnapshot = await getDocs(q);
        const coursesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEnrolledCourses(coursesData);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    fetchEnrolledCourses();
  }, [enrolledCourseIds]);
  const calculateProgress = (completion, duration) => {
    if (!completion) return 0; // Handle missing timestamp

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weeksPassed = Math.floor((today.getTime() - completion.toMillis()) / (7 * 24 * 60 * 60 * 1000)); // Convert ms to weeks
    const progress = (weeksPassed / duration) * 100;
    return Math.min(progress, 100); // ✅ Cap at 100%
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Enrolled Courses</h2>
      {enrolledCourses.length > 0 ? (
        <ul className="course-list">
          {enrolledCourses.map((course) => (
            <li key={course.id} className="course-item">
              <img src={course.thumbnail} alt={course.name} className="course-thumbnail" />
              <h3 className="course-name">{course.name}</h3>
              <p className="course-instructor">Instructor: {course.instructor}</p>
              
              <CourseProgress course={calculateProgress(course.completion,course.duration)} />
              
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-courses">No enrolled courses.</p>
      )}
    </div>
  );
};

export default StudentDashboard;
