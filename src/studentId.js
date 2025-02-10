import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getStudentId = async () => {
  let studentId = localStorage.getItem("studentId");

  if (!studentId) {
    studentId = `student_${Math.floor(Math.random() * 100000)}`;
    localStorage.setItem("studentId", studentId);
  }

  // Ensure student document exists in Firestore
  const studentRef = doc(db, "students", studentId);
  const studentSnap = await getDoc(studentRef);

  if (!studentSnap.exists()) {
    await setDoc(studentRef, {
      enrolledCourses: [],
      likedCourses: [],
    });
  }

  return studentId;
};
