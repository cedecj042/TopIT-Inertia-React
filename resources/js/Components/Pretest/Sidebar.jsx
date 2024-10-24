import React from "react";

const Sidebar = ({ coursesData, currentCourseIndex, onCourseSelect }) => {
    console.log("Received coursesData in Sidebar: ", coursesData);
    if (!Array.isArray(coursesData) || coursesData.length === 0) {
        return <div>No courses available.</div>;
    }
    
    return (
        <nav className="nav flex-column shadow-sm p-3 mb-5 bg-white rounded">
            {coursesData.map((course, index) => (
                <a
                    key={course.course_id} 
                    className={`nav-link ${currentCourseIndex === index ? "active" : ""}`} // Adjusted active class condition
                    onClick={() => onCourseSelect(index)}
                >
                    {course.title} 
                </a>
            ))}
        </nav>
    );
};

export default Sidebar;
