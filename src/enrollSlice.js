import { createSlice } from "@reduxjs/toolkit";
import { db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getStudentId } from "./studentId";
const initialState = {
  enrolledCourses: [],
};

export const enrollSlice = createSlice({
  name: "enrolledCourses",
  initialState,
  reducers: {
    addCourse: (state, action) => {
      state.enrolledCourses.push(action.payload);
    },
    removeCourse: (state, action) => {
      state.enrolledCourses = state.enrolledCourses.filter(courseId => courseId !== action.payload);
    },
    setEnrolled: (state, action) => {
      state.enrolledCourses = action.payload;
    },
  },
});

export const { addCourse, removeCourse, setEnrolled } = enrollSlice.actions;

// Load enrolled courses from Firestore
export const loadEnrolledCourses = () => async (dispatch) => {
  try {
      const stId = await getStudentId(); // Fetch student ID dynamically
      if (!stId) throw new Error("Student ID not found");

      const studentRef = doc(db, "students", stId);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
          const enrolledCourses = studentSnap.data().enrolledCourses || [];
          dispatch(setEnrolled(enrolledCourses));
      } else {
          console.error("Student not found in Firestore");
      }
  } catch (error) {
      console.error("Error loading enrolled courses:", error);
  }
};


// Add course to enrolled list
export const addToEnrolledCourses = (courseId) => async (dispatch) => {
  try {
      const stId = await getStudentId();
      if (!stId) throw new Error("Student ID not found");

      const studentRef = doc(db, "students", stId);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
          const enrolledCourses = studentSnap.data().enrolledCourses || [];

          if (!enrolledCourses.includes(courseId)) {
              await updateDoc(studentRef, {
                  enrolledCourses: arrayUnion(courseId),
              });

              dispatch(addCourse({ id: courseId }));
          }
      } else {
          console.error("Student not found in Firestore");
      }
  } catch (error) {
      console.error("Error adding to enrolled courses:", error);
  }
};


// Remove course from enrolled list
export const removeFromEnrolledCourses = (courseId) => async (dispatch) => {
  try {
    const stId = await getStudentId()
    if (!stId) throw new Error("Student ID not found");

    const studentRef = doc(db, "students", stId);
    await updateDoc(studentRef, {
      enrolledCourses: arrayRemove(courseId),
    });

    dispatch(removeCourse(courseId));
  } catch (error) {
    console.error("Error removing from enrolled courses:", error);
  }
};

export default enrollSlice.reducer;
