import React from "react";
import "../styles/ProgressBar.css"; // Import CSS file

 export const CourseProgress = ({ course }) => {
  const progressPercentage = course || 0; // Ensure there's a value

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p>{progressPercentage}% Completed</p>
    </div>
  );
};


