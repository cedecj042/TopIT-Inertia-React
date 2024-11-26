import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ courses, currentCourseIndex, setCurrentCourseIndex }) => {
  const coursesData = courses.data || [];

  return (
    <div className="p-4">
      <h2 className="h5 mb-3">Courses</h2>
      <div className="list-group">
        {coursesData.length === 0 ? (
          <p className="text-muted">No courses available</p>
        ) : (
          coursesData.map((course, index) => (
            <button
              key={course.course_id}
              onClick={() => setCurrentCourseIndex(index)}
              className={`list-group-item list-group-item-action ${currentCourseIndex === index ? 'active' : ''}`}
            >
              {course.title}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
