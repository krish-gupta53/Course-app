import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { loadEnrolledCourses, addToEnrolledCourses, removeFromEnrolledCourses } from "../enrollSlice";
import { Link } from "react-router-dom";
import { getStudentId } from "../studentId";
import "../styles/CourseList.css";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Search state
    const [likedCourses, setLikedCourses] = useState([]);
    const [stId, setStId] = useState(null);
    const dispatch = useDispatch();
    const enrolledCourses = useSelector((state) => state.enrolledCourses.enrolledCourses);

    useEffect(() => {
        const fetchStudentId = async () => {
            const id = await getStudentId();
            if (id) {
                setStId(id);
            } else {
                console.error("Failed to retrieve student ID.");
            }
        };
        fetchStudentId();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "courses"));
                setCourses(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (stId) {
            dispatch(loadEnrolledCourses(stId));
        }
    }, [dispatch, stId]);

    const handleEnroll = (courseId) => {
        if (enrolledCourses.includes(courseId)) {
            dispatch(removeFromEnrolledCourses(courseId));
        } else {
            dispatch(addToEnrolledCourses(courseId));
        }
    };

    // Function to handle search input
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    // Function to handle like/unlike feature
    const handleLike = async (courseId) => {
        try {
            const stId = await getStudentId();
            if (!stId) {
                console.error("Student ID not found!");
                return;
            }

            const studentRef = doc(db, "students", stId);
            const studentSnap = await getDoc(studentRef);
            if (!studentSnap.exists()) {
                console.error("Student not found!");
                return;
            }

            let likedCourses = studentSnap.data().likedCourses || [];
            const isLiked = likedCourses.includes(courseId);

            const courseRef = doc(db, "courses", courseId);
            const courseSnap = await getDoc(courseRef);
            if (!courseSnap.exists()) {
                console.error("Course not found!");
                return;
            }

            const currentLikes = courseSnap.data().likes || 0;
            const updatedLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

            await updateDoc(courseRef, { likes: updatedLikes });

            await updateDoc(studentRef, {
                likedCourses: isLiked ? arrayRemove(courseId) : arrayUnion(courseId),
            });

            setCourses((prev) =>
                prev.map((c) => (c.id === courseId ? { ...c, likes: updatedLikes } : c))
            );
            setLikedCourses(isLiked ? likedCourses.filter((id) => id !== courseId) : [...likedCourses, courseId]);
        } catch (error) {
            console.error("Error updating like count:", error);
        }
    };

    // Filter courses based on search query (search by name or instructor)
    const filteredCourses = courses.filter(
        (course) =>
            course.name.toLowerCase().includes(searchQuery) ||
            course.instructor.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="course-list-container">
            <h2 className="course-title">Available Courses</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder=" course or instructor..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
            />

            <Link to="/dashboard" className="dashboard-link">
                <button className="dashboard-btn">Go to Student Dashboard</button>
            </Link>

            <div className="course-grid">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="course-card">
                        <img src={course.thumbnail} alt={course.name} className="course-thumbnail" />
                        <h3 className="course-name">{course.name}</h3>
                        <p className="course-description">{course.description}</p>
                        <p className="course-instructor">Instructor: {course.instructor}</p>
                        <p className="course-likes">Likes: {course.likes}</p>
                        <div className="course-actions">
                            <button
                                className={`enroll-btn ${enrolledCourses.includes(course.id) ? "enrolled" : ""}`}
                                onClick={() => handleEnroll(course.id)}
                            >
                                {enrolledCourses.includes(course.id) ? "Enrolled ✅" : "Enroll"}
                            </button>
                            <button
                                className={`like-btn ${likedCourses.includes(course.id) ? "liked" : ""}`}
                                onClick={() => handleLike(course.id)}
                            >
                                {likedCourses.includes(course.id) ? "❤️ Liked" : "🤍 Like"}
                            </button>
                        </div>
                        <Link to={`/course/${course.id}`}>
                            <button className="view-details-btn">View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
