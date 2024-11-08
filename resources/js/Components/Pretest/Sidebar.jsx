import React from 'react';

const Sidebar = ({ courses, currentCourseIndex, setCurrentCourseIndex, answeredQuestions }) => {
  // Safely access courses data
  const coursesData = courses.data || [];

  return (
    <aside className="w-64 bg-white shadow-lg">
      <nav className="p-4">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        <ul className="space-y-2">
          {coursesData.length === 0 ? (
            <li className="text-gray-500">No courses available</li>
          ) : (
            coursesData.map((course, index) => (
              <li key={course.course_id}>
                <button
                  onClick={() => setCurrentCourseIndex(index)} // Set course index on button click
                  className={`w-full text-left px-4 py-2 rounded ${currentCourseIndex === index 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{course.title}</span>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
