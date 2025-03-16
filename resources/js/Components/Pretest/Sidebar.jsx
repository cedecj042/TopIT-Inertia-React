import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";


export default function Sidebar({ assessment_courses,selectedCourse,handleCourseChange}) {
  return (
    <div className="p-4">
      <h2 className="h5 mb-3">Courses</h2>
      <div className="list-group">
        {assessment_courses.length === 0 ? (
          <p className="text-muted">No courses available</p>
        ) : (
          assessment_courses.map((assessment_course,index) => (
            <button
              key={assessment_course.course_id}
              onClick={() => handleCourseChange(index)}
              className={`list-group-item list-group-item-action ${assessment_course.course_id === selectedCourse.course_id ? 'active' : ''}`}
            >
              {assessment_course.course.title}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

