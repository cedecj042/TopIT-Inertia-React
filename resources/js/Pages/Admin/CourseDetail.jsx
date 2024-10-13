import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";

export default function CourseDetail({ title, course, queryParams }) {
    const handleBackClick = () => {
        router.get(route("admin.course", queryParams));
    };
    return (
        <AdminLayout title={title}>
            <div className="row p-3 mt-2">
                <div className="row mt-4 px-5">
                    <div className="d-flex justify-content-between flex-column">
                        <div className="d-flex flex-row align-items-center">
                            <button
                                className="btn btn-transparent"
                                onClick={handleBackClick}
                            >
                                <i className="bi bi-arrow-left"></i>
                            </button>
                            <h5 className="fw-semibold m-0">Course Detail</h5>
                        </div>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3 p-0">
                            <h1 className="h3 fw-semibold m-0 ">Courses</h1>
                            <div className="btn-toolbar mb-2 mb-md-0">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-md btn-size"
                                    onClick={openModal}
                                >
                                    Add Course
                                </button>
                            </div>
                        </div>
                        {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                            <h1 className="h3 fw-semibold m-0">
                                {course.data.title}
                            </h1>
                            <div className="btn-toolbar mb-2 mb-md-0 ">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-md"
                                    data-bs-toggle="modal"
                                    data-bs-target="#uploadModal"
                                    style="font-size: 0.9rem; padding: 0.8em 1em"
                                >
                                    Upload Materials
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
