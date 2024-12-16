import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ courses }) => {
  const coursesData = courses.data || [];

  return (
    <div className="p-4 mt-3">
      <h2 className="h5 mb-3">Selected Course</h2>
      <div className="list-group">
        {coursesData.length === 0 ? (
          <p className="text-muted">No courses available</p>
        ) : (
          coursesData.map((course) => (
            <div
              key={course.course_id}
              className="list-group-item list-group-item-action active"
            >
              {course.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;