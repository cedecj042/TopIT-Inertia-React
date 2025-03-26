import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import '../../../../css/student/test.css';

function Courses ({courses}) {

    const handleClick = (courseId) => {
        window.location.href = route("course.show", courseId);
    };

    return (
        <>
            <div className="row p-3">
                <div className="row mt-4 px-5">
                    <h3 className="fw-bold">Courses</h3>
                </div>
            </div>
            <div className="px-md-5">
                <div className="course-list w-100">
                    {courses.map((course) => (
                        <div
                            key={course.course_id}
                            className="card mb-3 border-1 shadow-sm rounded-4 overflow-hidden clickable"
                            onClick={() => handleClick(course.course_id)}
                        >
                            <div className="card-body p-0">
                                <div className="d-flex align-items-center">
                                    <div
                                        className="bg-grey"
                                        style={{
                                            width: "20px",
                                            height: "90px",
                                        }}
                                    ></div>
                                    <div className="flex-grow-1 px-3">
                                        <div className="h5 mb-0 fw-semibold">
                                            {course.title}
                                        </div>
                                        {course.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default StudentContent(Courses);
